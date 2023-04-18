<?php

namespace App\Commons\Response;

use App\Enums\BaseEnum;
use Illuminate\Support\Facades\Lang;

enum ErrorEnum
{
    use BaseEnum;

    case INVALID_CREDENTIALS_ERROR;
    case INACTIVE_APP_CLIENT_ERROR;
    case INACTIVE_USER_ERROR;
    case PATH_NOT_ALLOWED_ERROR;
    case ORIGIN_NOT_ALLOWED_ERROR;
    case NO_USER_EMAIL_ERROR;
    case NOT_USER_FOUND_WITH_EMAIL_ERROR;
    case NOT_USER_FOUND_IN_HASH;
    case EXPIRED_HASH_ERROR;
    case INVALID_HASH_TOKEN_ERROR;
    case ALREADY_VERIFIED_EMAIL_ADDRESS_ERROR;

    /* -------------------- */

    public function throw()
    {
        throw new ErrorEnumException($this);
    }

    /* -------------------- */

    public function value(array $args): array
    {
        return match($this) {
            self::INVALID_CREDENTIALS_ERROR => [
                'code' => 1,
                'status' => 401,
                'message' => match(Lang::getLocale()) {
                    'es' => 'Las credenciales provistas son incorrectas.',
                    'en' => 'The provided credentials are incorrect.',
                }
            ],
            self::INACTIVE_APP_CLIENT_ERROR => [
                'code' => 2,
                'status' => 401,
                'message' => match(Lang::getLocale()) {
                    'es' => 'El cliente provisto no se encuentra activo.',
                    'en' => 'The provided client is not active.',
                }
            ],
            self::INACTIVE_USER_ERROR => [
                'code' => 3,
                'status' => 401,
                'message' => match(Lang::getLocale()) {
                    'es' => 'El usuario provisto no se encuentra activo.',
                    'en' => 'The provided user is not active.',
                }
            ],
            self::PATH_NOT_ALLOWED_ERROR => [
                'code' => 4,
                'status' => 403,
                'message' => match(Lang::getLocale()) {
                    'es' => 'El endpoint solicitado no está permitido.',
                    'en' => 'The requested endpoint is not allowed.',
                }
            ],
            self::ORIGIN_NOT_ALLOWED_ERROR => [
                'code' => 5,
                'status' => 403,
                'message' => match(Lang::getLocale()) {
                    'es' => 'El origen de la petición no está permitido.',
                    'en' => 'The origin of the request is not allowed.',
                }
            ],
            self::NO_USER_EMAIL_ERROR => [
                'code' => 6,
                'status' => 400,
                'message' => match(Lang::getLocale()) {
                    'es' => 'Este usuario no tiene una dirección de correo para enviar.',
                    'en' => 'This user does not have an email address to send.',
                }
            ],
            self::NOT_USER_FOUND_WITH_EMAIL_ERROR => [
                'code' => 7,
                'status' => 404,
                'message' => match(Lang::getLocale()) {
                    'es' => 'No se ha encontrado ningún usuario con esta dirección de correo.',
                    'en' => 'No user with this email address was found.',
                }
            ],
            self::NOT_USER_FOUND_IN_HASH => [
                'code' => 8,
                'status' => 404,
                'message' => match(Lang::getLocale()) {
                    'es' => 'No se ha encontrado ningún usuario correspondiente a este hash.',
                    'en' => 'No user found corresponding to this hash.',
                }
            ],
            self::EXPIRED_HASH_ERROR => [
                'code' => 9,
                'status' => 400,
                'message' => match(Lang::getLocale()) {
                    'es' => 'Este hash ha expirado.',
                    'en' => 'This hash has expired.',
                }
            ],
            self::INVALID_HASH_TOKEN_ERROR => [
                'code' => 10,
                'status' => 400,
                'message' => match(Lang::getLocale()) {
                    'es' => 'El token del hash es incorrecto o ha caducado.',
                    'en' => 'The hash token is incorrect or has expired.',
                }
            ],
            self::ALREADY_VERIFIED_EMAIL_ADDRESS_ERROR => [
                'code' => 11,
                'status' => 400,
                'message' => match(Lang::getLocale()) {
                    'es' => 'Esta dirección de correo ya ha sido verificada.',
                    'en' => 'This email address has already been verified.',
                }
            ],
        };
    }
}
