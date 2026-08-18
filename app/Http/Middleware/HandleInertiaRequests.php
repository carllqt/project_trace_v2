<?php
namespace App\Http\Middleware;
use App\Models\ProcurementRoute;
use Illuminate\Http\Request;
use Inertia\Middleware;
class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';
    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }
    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $incomingPRCount = 0;

        if ($user?->department_id) {
            $incomingPRCount = ProcurementRoute::query()
                ->whereHas('procurement', function ($q) use ($user) {
                    $q->where(
                        'current_department_id',
                        $user->department_id
                    );
                })
                ->where(
                    'to_department_id',
                    $user->department_id
                )
                ->where('action', 'Forwarded')
                ->whereNull('received_by')
                ->count();
        }
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user()?->load('department'),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
             'incomingPRCount' => $incomingPRCount,
        ];
    }
}
