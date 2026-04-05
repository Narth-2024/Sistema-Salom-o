<?php

namespace App\Services;

use Supabase\Supabase;

class SupabaseService
{
    protected $client;

    public function __construct()
    {
        $this->client = Supabase::initialize(
            url: config('services.supabase.url'),
            key: config('services.supabase.key')
        );
    }

    public function client()
    {
        return $this->client;
    }

    public function auth()
    {
        return $this->client->auth();
    }

    public function from(string $table)
    {
        return $this->client->from($table);
    }

    public function storage()
    {
        return $this->client->storage();
    }

    public function rpc(string $function)
    {
        return $this->client->rpc($function);
    }
}
