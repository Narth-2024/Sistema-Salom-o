<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * Converte vírgula decimal para ponto em campos numéricos.
     * Aceita "12,50", "1.234,56" e "12.50" -> "12.50", "1234.56", "12.50".
     */
    protected function normalizeDecimal(mixed $value): mixed
    {
        if (! is_string($value)) {
            return $value;
        }

        $s = trim($value);
        if ($s === '') {
            return $value;
        }

        // Remove espaços e símbolo de moeda
        $s = preg_replace('/\s|R\$/i', '', $s);

        $hasComma = str_contains($s, ',');
        $hasDot = str_contains($s, '.');

        if ($hasComma && $hasDot) {
            // Formato BR: 1.234,56 -> remove pontos, vírgula vira ponto
            $s = str_replace('.', '', $s);
            $s = str_replace(',', '.', $s);
        } elseif ($hasComma) {
            // Só vírgula -> decimal
            $s = str_replace(',', '.', $s);
        }

        // Mantém apenas dígitos e um ponto decimal
        $s = preg_replace('/[^0-9.]/', '', $s);
        $parts = explode('.', $s);
        if (count($parts) > 2) {
            $s = $parts[0] . '.' . implode('', array_slice($parts, 1));
        }

        return $s;
    }

    /**
     * Normaliza uma lista de campos numéricos direto no Request (in-place).
     */
    protected function normalizeDecimals(Request $request, array $fields): void
    {
        foreach ($fields as $field) {
            if ($request->exists($field)) {
                $request->merge([
                    $field => $this->normalizeDecimal($request->input($field)),
                ]);
            }
        }
    }
}
