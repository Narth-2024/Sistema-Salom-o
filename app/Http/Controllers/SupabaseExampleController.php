<?php

namespace App\Http\Controllers;

use App\Services\SupabaseService;
use Illuminate\Http\Request;

class SupabaseExampleController extends Controller
{
    protected SupabaseService $supabase;

    public function __construct(SupabaseService $supabase)
    {
        $this->supabase = $supabase;
    }

    /**
     * Exemplo: Buscar dados de uma tabela
     */
    public function index()
    {
        // Buscar todos os registros de uma tabela
        $response = $this->supabase->from('sua_tabela')
            ->select('*')
            ->execute();

        return response()->json($response->data);
    }

    /**
     * Exemplo: Inserir dados
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'nome' => 'required|string',
            'email' => 'required|email',
        ]);

        $response = $this->supabase->from('sua_tabela')
            ->insert($data)
            ->execute();

        return response()->json($response->data);
    }

    /**
     * Exemplo: Autenticar usuário
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $response = $this->supabase->auth()
            ->signInWithPassword($credentials['email'], $credentials['password']);

        return response()->json($response->user);
    }

    /**
     * Exemplo: Upload de arquivo para Storage
     */
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB
        ]);

        $file = $request->file('file');
        $contents = file_get_contents($file->getRealPath());

        $bucket = 'seu-bucket';
        $path = 'uploads/' . $file->hashName();

        $response = $this->supabase->storage()
            ->from($bucket)
            ->upload($path, $contents);

        return response()->json([
            'success' => true,
            'path' => $path,
        ]);
    }
}
