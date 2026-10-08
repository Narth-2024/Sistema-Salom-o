<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'onboarding' => fn () => $this->onboardingPayload($request),
        ];
    }

    protected function onboardingPayload(Request $request): ?array
    {
        if (! $request->user()) {
            return null;
        }

        $onboarding = $request->user()->onboarding();

        return [
            'inProgress' => $onboarding->inProgress(),
            'finished' => $onboarding->finished(),
            'percentage' => (int) round($onboarding->percentageCompleted()),
            'steps' => $onboarding->steps()
                ->filter(fn ($step) => $step->notExcluded())
                ->map(fn ($step) => [
                    'title' => $step->title,
                    'description' => $step->description,
                    'link' => $step->link,
                    'cta' => $step->cta,
                    'complete' => $step->complete(),
                ])
                ->values()
                ->all(),
        ];
    }
}
