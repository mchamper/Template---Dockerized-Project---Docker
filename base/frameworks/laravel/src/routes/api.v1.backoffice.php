<?php

use App\Commons\Response\Response;
use Illuminate\Support\Facades\Route;

Route::group([], function () {
    Route::get('/', function () { return Response::json(null, 'Hello API v1 --- Backoffice!'); });
    /* -------------------- */
    Route::get('/combos', 'CombosController@get');
    Route::get('/validate', 'ValidateController@validate');
    /* -------------------- */
    Route::post('/auth/system-user/register', 'Auth\AuthSystemUserController@register')->middleware(['throttle:6,1']);
    Route::post('/auth/system-user/login', 'Auth\AuthSystemUserController@login');
    /* -------------------- */
    Route::post('/auth/system-user/password-reset/request', 'Auth\AuthSystemUserPasswordResetController@request')->middleware(['throttle:3,1']);
    Route::patch('/auth/system-user/password-reset/update', 'Auth\AuthSystemUserPasswordResetController@update');
});

Route::middleware(['auth:api_system_user'])->group(function () {
    Route::get('/auth/system-user/me', 'Auth\AuthSystemUserController@me');
    /* -------------------- */
    Route::post('/auth/system-user/verification/request', 'Auth\AuthSystemUserVerificationController@request')->middleware(['throttle:3,1']);
    Route::patch('/auth/system-user/verification/verify', 'Auth\AuthSystemUserVerificationController@verify');
    /* -------------------- */
});

Route::middleware(['auth:api_system_user', 'verified'])->group(function () {
    Route::get('/system-users', 'SystemUserController@index');
    Route::get('/system-users/{systemUserId}', 'SystemUserController@show');
    Route::post('/system-users', 'SystemUserController@create');
    Route::put('/system-users/{systemUserId}', 'SystemUserController@update');
    Route::delete('/system-users/{systemUserId}', 'SystemUserController@delete');
});
