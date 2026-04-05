<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\SupabaseService;

class SupabaseServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(SupabaseService::class, function ($app) {
            return new SupabaseService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
