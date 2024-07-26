<?php

use App\Core\Response\Response;
use App\Enums\RolesAndPermissions\SystemUser_PermissionEnum;
use App\Http\Controllers\Api\Backoffice\v1\CombosController;
use App\Http\Controllers\Api\Backoffice\v1\RoleController;
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
        Route::get('/system-users', 'index')->can(SystemUser_PermissionEnum::SystemUserGet->name);
        Route::get('/system-users/{systemUserId}', 'show')->can(SystemUser_PermissionEnum::SystemUserGet->name);
        Route::post('/system-users', 'create')->can(SystemUser_PermissionEnum::SystemUserCreate->name);
        Route::put('/system-users/{systemUserId}', 'update')->can(SystemUser_PermissionEnum::SystemUserUpdate->name);
        Route::delete('/system-users/{systemUserId}', 'delete')->can(SystemUser_PermissionEnum::SystemUserDelete->name);
        Route::patch('/system-users/{systemUserId}/activate', 'activate')->can(SystemUser_PermissionEnum::SystemUserActivate->name);
        Route::patch('/system-users/{systemUserId}/deactivate', 'deactivate')->can(SystemUser_PermissionEnum::SystemUserDeactivate->name);
    });

    Route::controller(RoleController::class)->group(function () {
        Route::get('/roles', 'index')->can(SystemUser_PermissionEnum::RoleGet->name);
        Route::get('/roles/{roleId}', 'show')->can(SystemUser_PermissionEnum::RoleGet->name);
        Route::post('/roles', 'create')->can(SystemUser_PermissionEnum::RoleCreate->name);
        Route::put('/roles/{roleId}', 'update')->can(SystemUser_PermissionEnum::RoleUpdate->name);
        Route::delete('/roles/{roleId}', 'delete')->can(SystemUser_PermissionEnum::RoleDelete->name);
        Route::patch('/roles/{roleId}/sync-permissions', 'syncPermissions')->can(SystemUser_PermissionEnum::RoleSyncPermission->name);
        Route::patch('/roles/{roleId}/sync-users', 'syncUsers')->can(SystemUser_PermissionEnum::RoleSyncUser->name);
    });
});
