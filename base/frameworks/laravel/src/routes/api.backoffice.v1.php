<?php

use App\Core\Response\Response;
use App\Enums\PermissionEnum;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:app_client'])->group(function () {
    Route::get('/', function () { return Response::jsonHello(); });
});

Route::middleware(['auth:app_client,system_user'])->group(function () {
    Route::get('/combos', 'CombosController@get');
    Route::get('/validate', 'ValidateController@validate');
});

Route::middleware(['auth:system_user', 'verified'])->group(function () {
    Route::post('/upload', 'UploadController@upload');
    /* -------------------- */
    Route::get('/system-users', 'SystemUserController@index')->can(PermissionEnum::SystemUserGet->name);
    Route::get('/system-users/{systemUserId}', 'SystemUserController@show')->can(PermissionEnum::SystemUserGet->name);
    Route::post('/system-users', 'SystemUserController@create')->can(PermissionEnum::SystemUserCreate->name);
    Route::put('/system-users/{systemUserId}', 'SystemUserController@update')->can(PermissionEnum::SystemUserUpdate->name);
    Route::delete('/system-users/{systemUserId}', 'SystemUserController@delete')->can(PermissionEnum::SystemUserDelete->name);
    Route::patch('/system-users/{systemUserId}/activate', 'SystemUserController@activate')->can(PermissionEnum::SystemUserActivate->name);
    Route::patch('/system-users/{systemUserId}/deactivate', 'SystemUserController@deactivate')->can(PermissionEnum::SystemUserDeactivate->name);
});
