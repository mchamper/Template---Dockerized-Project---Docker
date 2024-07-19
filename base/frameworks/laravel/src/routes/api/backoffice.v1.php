<?php

use App\Core\Response\Response;
use App\Enums\PermissionEnum;
use App\Http\Controllers\Api\Backoffice\v1\CombosController;
use App\Http\Controllers\Api\Backoffice\v1\SearchController;
use App\Http\Controllers\Api\Backoffice\v1\SystemUserController;
use App\Http\Controllers\Api\Backoffice\v1\UploadController;
use App\Http\Controllers\Api\Backoffice\v1\ValidateController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => Response::jsonHello());

/* -------------------- */

Route::middleware(['auth:api_system-user', 'verified'])->group(function () {
    Route::get('/combos', [CombosController::class, 'get']);
    Route::get('/search', [SearchController::class, 'search']);
    Route::post('/validate', [ValidateController::class, 'validate']);
    Route::post('/upload', [UploadController::class, 'upload'])->middleware('throttle:upload');

    Route::controller(SystemUserController::class)->group(function () {
        Route::get('/system-users', 'index')->can(PermissionEnum::SystemUserGet->name);
        Route::get('/system-users/{systemUserId}', 'show')->can(PermissionEnum::SystemUserGet->name);
        Route::post('/system-users', 'create')->can(PermissionEnum::SystemUserCreate->name);
        Route::put('/system-users/{systemUserId}', 'update')->can(PermissionEnum::SystemUserUpdate->name);
        Route::delete('/system-users/{systemUserId}', 'delete')->can(PermissionEnum::SystemUserDelete->name);
        Route::patch('/system-users/{systemUserId}/activate', 'activate')->can(PermissionEnum::SystemUserActivate->name);
        Route::patch('/system-users/{systemUserId}/deactivate', 'deactivate')->can(PermissionEnum::SystemUserDeactivate->name);
    });
});
