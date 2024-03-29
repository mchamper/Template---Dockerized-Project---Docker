<?php

use App\Core\Response\Response;
use App\Enums\PermissionEnum;
use Illuminate\Support\Facades\Route;

Route::get('/', function () { return Response::jsonHello(); });

Route::post('/app-client/login', 'AuthAppClientController@login');

Route::middleware(['auth:app_client'])->group(function () {
    Route::post('/app-client/logout', 'AuthAppClientController@logout');
    Route::post('/app-client/me', 'AuthAppClientController@me');
    /* -------------------- */
    Route::post('/system-user/register', 'AuthSystemUserController@register')->middleware(['throttle:6,1']);
    Route::post('/system-user/login', 'AuthSystemUserController@login');
    Route::post('/system-user/login/google', 'AuthSystemUserController@loginGoogle');
    Route::post('/system-user/password-reset/request', 'AuthSystemUserPasswordResetController@request')->middleware(['throttle:3,1']);
    Route::patch('/system-user/password-reset/update', 'AuthSystemUserPasswordResetController@update');
});

Route::middleware(['auth:system_user'])->group(function () {
    Route::post('/system-user/login-as', 'AuthSystemUserController@loginAs')->can(PermissionEnum::SystemUserLoginAs->name);
    Route::post('/system-user/logout', 'AuthSystemUserController@logout');
    Route::post('/system-user/me', 'AuthSystemUserController@me');
    Route::put('/system-user/update', 'AuthSystemUserController@update');
    Route::post('/system-user/verification/request', 'AuthSystemUserVerificationController@request')->middleware(['throttle:3,1']);
    Route::patch('/system-user/verification/verify', 'AuthSystemUserVerificationController@verify');
});
