<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CacheMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // Generate a unique cache key based on the request URL
        $cacheKey = 'route_' . str_replace('/', '_', $request->path());

        if (Cache::has($cacheKey)) {
            // If the response is cached, return it directly
            return response(Cache::get($cacheKey));
        }

        // Proceed with the request and get the response
        $response = $next($request);

        // Cache the response for a certain duration (e.g., 1 hour)
        Cache::put($cacheKey, $response->getContent(), 60);

        return $response;
    }
}