<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; // Import Log facade
use Illuminate\Support\Str;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $allowedOrigins = ['http://localhost:5173', 'https://shbro.onrender.com', 'http://127.0.0.1:5500'];
        $origin = $request->header('Origin');

        // Log the origin for debugging
        Log::info("Request Origin: $origin");

        // Check if the request is for a JavaScript file in the public directory
        if ($this->isJavaScriptFileRequest($request->getRequestUri()) && $origin && in_array($origin, $allowedOrigins)) {
            // Log that CORS headers are being set
            Log::info("Setting CORS headers for JavaScript file request from $origin");

            return $this->setCorsHeaders($next($request), $origin);
        }

        // Fallback: If origin is not allowed or request is not for a JavaScript file, pass through
        return $next($request);
    }

    protected function isJavaScriptFileRequest($requestUri)
    {
        // Adjust this condition according to the structure of your JavaScript file URLs
        $isJavaScriptFile = Str::endsWith($requestUri, '.js') && strpos($requestUri, '/build/assets/') !== false;

        // Log whether the request is for a JavaScript file
        Log::info("Is JavaScript file request: " . ($isJavaScriptFile ? 'Yes' : 'No'));

        return $isJavaScriptFile;
    }

    protected function setCorsHeaders($response, $origin)
    {
        return $response->header('Access-Control-Allow-Origin', $origin)
                        ->header('Access-Control-Allow-Methods', 'GET')
                        ->header('Access-Control-Allow-Headers', 'Content-Type');
    }
}
