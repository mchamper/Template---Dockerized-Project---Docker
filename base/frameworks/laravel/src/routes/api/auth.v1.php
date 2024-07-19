<?php

use App\Core\Response\Response;
use App\Enums\PermissionEnum;
use App\Http\Controllers\Api\Auth\v1\AuthController;
use App\Http\Controllers\Api\Auth\v1\AuthVerificationController;
use App\Http\Controllers\Api\Auth\v1\AuthPasswordResetController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => Response::jsonHello());

/* -------------------- */

Route::controller(AuthController::class)->group(function () {
    Route::whereIn('userType', ['user', 'system-user'])->group(function () {
        Route::post('/{userType}/register', 'register')->middleware('throttle:registers');
        Route::post('/{userType}/login', 'login')->middleware('throttle:login');
        Route::post('/{userType}/login/google', 'loginWithGoogle')->middleware('throttle:login');

        Route::middleware('auth:api_user,api_system-user')->group(function () {
            Route::get('/{userType}/me', 'me');
            Route::put('/{userType}/update', 'update');
        });
    });

    Route::whereIn('userType', ['user', 'system-user', 'internal-user', 'external-user'])->group(function () {
        Route::middleware('auth:api_user,api_system-user,api_internal-user,api_external-user')->group(function () {
            Route::get('/{userType}/logout', 'logout');
        });
    });

    Route::middleware('auth:api_system-user')->group(function () {
        Route::post('/system-user/login-as', 'loginAs')->can(PermissionEnum::SystemUserLoginAs->name);
    });
});

Route::controller(AuthPasswordResetController::class)->group(function () {
    Route::whereIn('userType', ['user', 'system-user'])->group(function () {
        Route::post('/{userType}/password-reset/request', 'request')->middleware('throttle:notification');
        Route::patch('/{userType}/password-reset/update', 'update');
    });
});

Route::controller(AuthVerificationController::class)->group(function () {
    Route::whereIn('userType', ['user', 'system-user'])->group(function () {
        Route::middleware('auth:api_user,api_system-user')->group(function () {
            Route::post('/{userType}/verification/request', 'request')->middleware('throttle:notification');
            Route::patch('/{userType}/verification/verify', 'verify');
        });
    });

    Route::middleware('auth:api_external-user')->group(function () {
        Route::get('/external-user/verification/verify', 'verify');
    });
});
