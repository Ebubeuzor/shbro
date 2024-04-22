<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        // Cache only GET requests
        if ($request->isMethod('GET')) {
            $cacheKey = $this->generateCacheKey($request);

            if (Cache::has($cacheKey)) {
                // If the response is cached, return it directly
                return response(Cache::get($cacheKey));
            }
        }

        // Proceed with the request and get the response
        $response = $next($request);

        // Cache the response for a certain duration for GET requests
        if ($request->isMethod('GET')) {
            $cacheKey = $this->generateCacheKey($request);
            Cache::put($cacheKey, $response->getContent(), 360); // Cache for 1 week
        }

        return $response;
    }

    /**
     * Generate the cache key based on the request and user's authentication status.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string
     */
    private function generateCacheKey(Request $request)
    {
        if (Auth::check()) {
            // If user is authenticated, include user's ID in cache key
            $userId = Auth::id();
            return 'user_' . $userId . '_route_' . str_replace('/', '_', $request->path());
        } else {
            // If user is not authenticated, generate cache key without user's ID
            return 'unauthenticated_route_' . str_replace('/', '_', $request->path());
        }
    }
}
