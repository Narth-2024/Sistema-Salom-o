<?php

namespace App\Facades;

use App\Services\SupabaseService;
use Illuminate\Support\Facades\Facade;

/**
 * @method static mixed from(string $table)
 * @method static mixed auth()
 * @method static mixed storage()
 * @method static mixed rpc(string $function)
 * @method static mixed client()
 *
 * @see \App\Services\SupabaseService
 */
class Supabase extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return SupabaseService::class;
    }
}
