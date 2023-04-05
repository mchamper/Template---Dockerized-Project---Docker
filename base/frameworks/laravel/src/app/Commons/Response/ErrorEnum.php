<?php

namespace App\Commons\Response;

use App\Enums\BaseEnumTrait;

enum ErrorEnum: string
{
    use BaseEnumTrait;

    case INVALID_CREDENTIALS_ERROR = '1|401';
    case INACTIVE_APP_CLIENT_ERROR = '2|401';
    case INACTIVE_USER_ERROR = '3|401';
    case UNAUTHORIZED_SCOPE_ERROR = '4|401';
    case NO_USER_EMAIL_ERROR = '5|400';
    case NOT_USER_FOUND_WITH_EMAIL_ERROR = '6|404';
    case NOT_USER_FOUND_IN_HASH = '7|404';
    case EXPIRED_HASH_ERROR = '8|403';
    case INVALID_HASH_TOKEN_ERROR = '9|400';
    case ALREADY_VERIFIED_EMAIL_ADDRESS_ERROR = '10|400';

    /* -------------------- */

    public function throw()
    {
        throw new ErrorEnumException($this);
    }

    /* -------------------- */

    private function _getMessageEs(array $args): string
    {
        return match($this) {
            self::INACTIVE_APP_CLIENT_ERROR => 'El cliente provisto no se encuentra activo.',
            self::INACTIVE_USER_ERROR => 'El usuario provisto no se encuentra activo.',
            self::UNAUTHORIZED_SCOPE_ERROR => 'El token provisto no puede acceder al endpoint solicitado.',
            self::NO_USER_EMAIL_ERROR => 'Este usuario no tiene una dirección de correo para enviar.',
            self::NOT_USER_FOUND_WITH_EMAIL_ERROR => 'No se ha encontrado ningún usuario con esta dirección de correo.',
            self::NOT_USER_FOUND_IN_HASH => 'No se ha encontrado ningún usuario correspondiente a este hash.',
            self::EXPIRED_HASH_ERROR => 'Este hash ha expirado.',
            self::INVALID_HASH_TOKEN_ERROR => 'El token del hash es incorrecto o ha caducado.',
            self::ALREADY_VERIFIED_EMAIL_ADDRESS_ERROR => 'Esta dirección de correo ya ha sido verificada.',
        };
    }

    private function _getMessageEn(array $args): string
    {
        return match($this) {
            self::INVALID_CREDENTIALS_ERROR => 'The provided credentials are incorrect.',
            self::INACTIVE_APP_CLIENT_ERROR => 'The provided client is not active.',
            self::INACTIVE_USER_ERROR => 'The provided user is not active.',
            self::UNAUTHORIZED_SCOPE_ERROR => 'The provided token cannot access the requested endpoint.',
            self::NO_USER_EMAIL_ERROR => 'This user does not have an email address to send.',
            self::NOT_USER_FOUND_WITH_EMAIL_ERROR => 'No user with this email address was found.',
            self::NOT_USER_FOUND_IN_HASH => 'No user found corresponding to this hash.',
            self::EXPIRED_HASH_ERROR => 'This hash has expired.',
            self::INVALID_HASH_TOKEN_ERROR => 'The hash token is incorrect or has expired.',
            self::ALREADY_VERIFIED_EMAIL_ADDRESS_ERROR => 'This email address has already been verified.',
        };
    }
}
