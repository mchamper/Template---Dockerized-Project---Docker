<?php

namespace App\Policies;

use App\Enums\RolesAndPermissions\SystemUser_RoleEnum;
use App\Models\SystemUser;
use Illuminate\Auth\Access\Response;

class SystemUserPolicy
{
    /**
     * Determine whether the user can create models.
     */
    public function create(SystemUser $authSystemUser): Response
    {
        if ($authSystemUser->hasRole(SystemUser_RoleEnum::Root->name)) {
            return Response::allow();
        }

        return $authSystemUser->hasRole(SystemUser_RoleEnum::Admin->name)
            ? Response::allow()
            : Response::deny('No puedes crear usuarios.');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(SystemUser $authSystemUser, SystemUser $systemUser): Response
    {
        if ($authSystemUser->hasRole(SystemUser_RoleEnum::Root->name)) {
            return Response::allow();
        }

        if ($authSystemUser->hasRole(SystemUser_RoleEnum::Admin->name)) {
            return !$systemUser->hasRole(SystemUser_RoleEnum::Admin->name) || $authSystemUser->id === $systemUser->id
                ? Response::allow()
                : Response::deny('No puedes modificar un usuario administrador que no sea el tuyo.');
        }

        return $authSystemUser->id === $systemUser->id
            ? Response::allow()
            : Response::deny('No puedes modificar un usuario que no sea el tuyo.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(SystemUser $authSystemUser, SystemUser $systemUser): Response
    {
        if ($authSystemUser->hasRole(SystemUser_RoleEnum::Root->name)) {
            return Response::allow();
        }

        if ($authSystemUser->hasRole(SystemUser_RoleEnum::Admin->name)) {
            return !$systemUser->hasRole(SystemUser_RoleEnum::Admin->name)
                ? Response::allow()
                : Response::deny('No puedes eliminar un usuario administrador ni a ti mismo.');
        }

        return Response::allow();
    }
}
