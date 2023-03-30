<?php

namespace App\Http\Middleware;

use App\Commons\Response\ErrorEnum;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class PipedriveWebhookLog
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        $responseContent = json_decode($response->getContent(), true);

        Log::channel('pipedrive_webhook')->debug('/' . request()->path(), [
            'get' => request()->query(),
            'post' => request()->post(),
            'response' => $responseContent,
        ]);

        if (app()->environment() !== 'local') {
            if ($responseContent['status'] !== 200) {
                $error = ErrorEnum::tryFromName($responseContent['name']);

                if (!in_array($error, [
                    ErrorEnum::PIPEDRIVE_WEBHOOK_DATA_SOURCE_CHECK_ERROR
                ])) {
                    $responseContent['message'] = str_replace('`', '\'', $responseContent['message']);
                    $responseContent['trace'] = null;

                    Log::channel('pipedrive_webhook_discord')->error('('. app()->environment() . ') /' . request()->path(), [
                        'response' => $responseContent,
                    ]);
                }
            }
        }

        return $response;
    }
}
