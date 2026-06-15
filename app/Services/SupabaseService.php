<?php

namespace App\Services;

use Supabase\CreateClient;

class SupabaseService
{
    protected CreateClient $client;

    public function __construct()
    {
        $url = config('services.supabase.url');
        $key = config('services.supabase.key');

        $referenceId = parse_url($url, PHP_URL_HOST);
        $referenceId = explode('.', $referenceId)[0];

        $this->client = new CreateClient(
            api_key: $key,
            reference_id: $referenceId,
        );
    }

    public function client(): CreateClient
    {
        return $this->client;
    }

    public function auth()
    {
        return $this->client->auth;
    }

    public function from(string $table)
    {
        return $this->client->from($table);
    }

    public function storage()
    {
        return $this->client->storage;
    }

    public function rpc(string $function)
    {
        return $this->client->rpc($function);
    }
}
