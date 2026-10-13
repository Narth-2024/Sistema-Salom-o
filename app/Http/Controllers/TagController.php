<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TagController extends Controller
{
    public function index(Request $request): Response
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $sort = in_array($request->query('sort'), ['name', 'transactions_count'], true)
            ? $request->query('sort')
            : 'name';
        $direction = $request->query('direction') === 'desc' ? 'desc' : 'asc';

        $tags = $user->tags()
            ->withCount('transactions')
            ->orderBy($sort, $direction)
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Tags/Index', [
            'tags' => $tags,
            'sort' => $sort,
            'direction' => $direction,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            // O nome é único DENTRO do usuário: não pode repetir nas suas tags,
            // mas pode coincidir com a tag de outra pessoa.
            'name' => [
                'required',
                'string',
                'max:50',
                Rule::unique('tags', 'name')->where('user_id', auth()->id()),
            ],
            'color' => 'required|string|size:7',
        ]);

        /** @var \App\Models\User $user */
        $user = auth()->user();

        $user->tags()->create($request->only('name', 'color'));

        return redirect()->route('tags.index')
            ->with('success', 'Tag criada com sucesso.');
    }

    public function update(Request $request, Tag $tag): RedirectResponse
    {
        $this->authorize('update', $tag);

        $request->validate([
            'name' => 'required|string|max:50|unique:tags,name,' . $tag->id . ',id,user_id,' . auth()->id(),
            'color' => 'required|string|size:7',
        ]);

        $tag->update($request->only('name', 'color'));

        return redirect()->route('tags.index')
            ->with('success', 'Tag atualizada com sucesso.');
    }

    public function destroy(Tag $tag): RedirectResponse
    {
        $this->authorize('delete', $tag);

        $tag->delete();

        return redirect()->route('tags.index')
            ->with('success', 'Tag excluída.')
            ->with('undo', route('tags.restore', $tag));
    }

    public function restore(Tag $tag): RedirectResponse
    {
        $this->authorize('delete', $tag);

        $tag->restore();

        return redirect()->route('tags.index')
            ->with('success', 'Tag restaurada.');
    }
}
