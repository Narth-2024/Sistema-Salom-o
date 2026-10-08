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
            ->attributes([
                'description' => 'Categorias agrupam suas receitas e despesas (alimentação, transporte, moradia...) e são o que alimenta o gráfico de rosca do Dashboard.',
            ])
            ->link('/categories/create')
            ->cta('Criar categoria')
            ->completeIf(fn (User $model) => $model->categories()->exists());

        Onboard::addStep('Registre sua primeira transação')
            ->attributes([
                'description' => 'Registre cada entrada ou saída com valor, data e categoria. Tudo o que aparece nos gráficos vem das suas transações.',
            ])
            ->link('/transactions/create')
            ->cta('Nova transação')
            ->completeIf(fn (User $model) => $model->transactions()->exists());

        Onboard::addStep('Organize suas finanças com tags')
            ->attributes([
                'description' => 'Tags são rótulos livres (ex: assinatura, imposto, viagem) para cruzar informações de formas diferentes das categorias.',
            ])
            ->link('/tags')
            ->cta('Criar tags')
            ->completeIf(fn (User $model) => $model->tags()->exists());

        Onboard::addStep('Explore seus gráficos no Analytics')
            ->attributes([
                'description' => 'Com dados registrados, veja evolução mensal, saldo acumulado e compare períodos antes de tomar decisões.',
            ])
            ->link('/analytics')
            ->cta('Ver analytics')
            ->completeIf(fn (User $model) => $model->viewed_analytics_at !== null);
    }
}
