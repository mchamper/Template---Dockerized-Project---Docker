<?php

use App\Commons\Response\Response;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:app_client'])->group(function () {
    Route::get('/', function () { return Response::jsonHello(); });
    /* -------------------- */
    Route::get('/combos', 'CombosController@get');
    Route::get('/validate', 'ValidateController@validate');
});

Route::middleware(['auth:system_user', 'verified'])->group(function () {
    Route::get('/system-users', 'SystemUserController@index');
    Route::get('/system-users/{systemUserId}', 'SystemUserController@show');
    Route::post('/system-users', 'SystemUserController@create');
    Route::put('/system-users/{systemUserId}', 'SystemUserController@update');
    Route::delete('/system-users/{systemUserId}', 'SystemUserController@delete');
});
