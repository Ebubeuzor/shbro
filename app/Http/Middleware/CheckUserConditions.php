<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckUserConditions
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle($request, Closure $next)
    {
        $user = Auth::user();
        $errors = [];

        // Check if the user is authenticated
        if (!$user) {
            return response()->json(['error' => 'User is not authenticated.'], 451);
        }

        // Check if the user is banned
        if ($user->banned !== null) {
            $errors[] = 'User is banned.';
        }

        // Check if the user is suspended
        if ($user->suspend !== null) {
            $errors[] = 'User is suspended.';
        }

        // Check if the user is not active
        if (!$user->is_active) {
            $errors[] = 'User is not active.';
        }

        // If there are any errors, return them
        if (!empty($errors)) {
            return response()->json(['error' => implode(' ', $errors)], 451);
        }

        return $next($request);
    }

}
