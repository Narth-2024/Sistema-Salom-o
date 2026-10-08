<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Spatie\Onboard\Facades\Onboard;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        $this->registerOnboardingSteps();
    }

    protected function registerOnboardingSteps(): void
    {
        Onboard::addStep('Crie sua primeira categoria')
            ->link('/categories/create')
            ->cta('Criar categoria')
            ->completeIf(fn (User $model) => $model->categories()->exists());

        Onboard::addStep('Registre sua primeira transação')
            ->link('/transactions/create')
            ->cta('Nova transação')
            ->completeIf(fn (User $model) => $model->transactions()->exists());

        Onboard::addStep('Organize suas finanças com tags')
            ->link('/tags')
            ->cta('Criar tags')
            ->completeIf(fn (User $model) => $model->tags()->exists());

        Onboard::addStep('Explore seus gráficos no Analytics')
            ->link('/analytics')
            ->cta('Ver analytics')
            ->completeIf(fn (User $model) => $model->viewed_analytics_at !== null);
    }
}
