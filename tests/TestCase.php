<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function setUp(): void
    {
        parent::setUp();

        // Os testes de backend não devem depender do build de assets (Vite).
        // O build do frontend é validado pelo deploy da Vercel a cada push.
        $this->withoutVite();
    }
}
