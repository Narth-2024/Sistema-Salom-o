<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TagController extends Controller
{
    public function index(): Response
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $tags = $user->tags()->withCount('transactions')->paginate(20);

        return Inertia::render('Tags/Index', [
            'tags' => $tags,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:50',
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
            'name' => 'required|string|max:50',
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
            ->with('success', 'Tag excluída com sucesso.');
    }
}
