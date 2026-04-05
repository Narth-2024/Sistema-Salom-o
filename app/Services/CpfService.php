<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class CpfService
{
    /**
     * Consulta o CPF na API gov.br (Cadastro Base do Cidadão)
     * Retorna dados públicos: nome e situação do CPF.
     */
    public function consultar(string $cpf): ?array
    {
        $cpfNumerico = preg_replace('/\D/', '', $cpf);

        if (strlen($cpfNumerico) !== 11) {
            return null;
        }

        $token = config('services.cpf_api.access_token');

        if (!$token) {
            return null;
        }

        $response = Http::withToken($token)
            ->get('https://api.cadastro-base-do-cidadao.cbc.cpf.gov.br/v1/cpf/' . $cpfNumerico);

        if ($response->successful()) {
            return $response->json();
        }

        return null;
    }
}
