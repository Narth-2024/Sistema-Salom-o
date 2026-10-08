<?php

return [

    /*
    | Catálogo de instrumentos de investimento seguros (renda fixa).
    | annual_rate: taxa anual equivalente usada como referência (fração, ex.: 0.105 = 10,5% a.a.).
    | ir: tributação de imposto de renda regressivo sobre o lucro (false = isento).
    | ipca_linked: rendimento = IPCA estimado + rate.
    | min_months: carência mínima em meses (0 = liquidez diária).
    */

    'instruments' => [
        [
            'key' => 'poupanca',
            'name' => 'Poupança',
            'description' => 'Liquidez diária e isenta de IR. Rendimento atrelado à taxa Selic.',
            'annual_rate' => 0.0617,
            'ir' => false,
            'ipca_linked' => false,
            'min_months' => 0,
            'color' => '#f59e0b',
        ],
        [
            'key' => 'cdb',
            'name' => 'CDB liquidez diária',
            'description' => '100% do CDI, resgate a qualquer momento. IR regressivo sobre o lucro.',
            'annual_rate' => 0.1050,
            'ir' => true,
            'ipca_linked' => false,
            'min_months' => 0,
            'color' => '#22c55e',
        ],
        [
            'key' => 'tesouro_selic',
            'name' => 'Tesouro Selic',
            'description' => 'Título público atrelado à taxa Selic, baixo risco e liquidez D+1.',
            'annual_rate' => 0.1030,
            'ir' => true,
            'ipca_linked' => false,
            'min_months' => 0,
            'color' => '#6366f1',
        ],
        [
            'key' => 'tesouro_ipca',
            'name' => 'Tesouro IPCA+',
            'description' => 'Proteção contra inflação + juro fixo. IR só sobre a parcela acima do IPCA.',
            'annual_rate' => 0.0600,
            'ir' => true,
            'ipca_linked' => true,
            'min_months' => 0,
            'color' => '#14b8a6',
        ],
        [
            'key' => 'lci',
            'name' => 'LCI',
            'description' => 'Letra de crédito imobiliário, isenta de IR. Carência comum de 90 dias.',
            'annual_rate' => 0.0960,
            'ir' => false,
            'ipca_linked' => false,
            'min_months' => 3,
            'color' => '#ec4899',
        ],
        [
            'key' => 'lca',
            'name' => 'LCA',
            'description' => 'Letra de crédito do agronegócio, isenta de IR. Carência comum de 90 dias.',
            'annual_rate' => 0.0940,
            'ir' => false,
            'ipca_linked' => false,
            'min_months' => 3,
            'color' => '#a855f7',
        ],
    ],

    // Taxas de referência usadas quando a API do Banco Central não responde
    'fallback_rates' => [
        'cdi' => 10.50,
        'selic' => 10.75,
        'ipca' => 4.00,
    ],

];
