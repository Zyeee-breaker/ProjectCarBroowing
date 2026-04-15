<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;
use App\Http\Middleware\RoleMiddleware;

class Kernel extends HttpKernel
{
    protected $middleware = [
        // kosong dulu
    ];

    protected $middlewareGroups = [
        'web' => [],
        'api' => ['throttle:api'],
    ];

    protected $routeMiddleware = [
        'auth:sanctum' => \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    ];
}
