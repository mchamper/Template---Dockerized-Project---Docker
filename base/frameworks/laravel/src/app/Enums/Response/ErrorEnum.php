<?php

namespace App\Enums\Response;

use App\Core\Bases\BaseEnum;
use App\Core\Response\ErrorEnumException;
use Illuminate\Support\Facades\Lang;

enum ErrorEnum
{
    use BaseEnum;

    case InvalidCredentials;
    case InactiveUser;
    case PathNotAllowed;
    case OriginNotAllowed;
    case NoUserEmail;
    case NotUserFoundWithEmail;
    case NotUserFoundInHash;
    case ExpiredHash;
    case InvalidHashToken;
    case AlreadyVerifiedEmailAddress;
    case InvalidRequestConcept;

    /* -------------------- */

    public function throw()
    {
        throw new ErrorEnumException($this);
    }

    public function data(array $args = []): array
    {
        return match($this) {
            self::InvalidCredentials => [
                'code' => 1,
                'status' => 422,
                'message' => match(Lang::getLocale()) {
                    'es' => 'Las credenciales provistas son incorrectas.',
                    'en' => 'The provided credentials are incorrect.',
                }
            ],
            self::InactiveUser => [
                'code' => 2,
                'status' => 403,
                'message' => match(Lang::getLocale()) {
                    'es' => 'El usuario provisto no se encuentra activo.',
                    'en' => 'The provided user is not active.',
                }
            ],
            self::PathNotAllowed => [
                'code' => 3,
                'status' => 403,
                'message' => match(Lang::getLocale()) {
                    'es' => 'El endpoint solicitado no está permitido.',
                    'en' => 'The requested endpoint is not allowed.',
                }
            ],
            self::OriginNotAllowed => [
                'code' => 4,
                'status' => 403,
                'message' => match(Lang::getLocale()) {
                    'es' => 'El origen de la petición no está permitido.',
                    'en' => 'The origin of the request is not allowed.',
                }
            ],
            self::NoUserEmail => [
                'code' => 5,
                'status' => 400,
                'message' => match(Lang::getLocale()) {
                    'es' => 'Este usuario no tiene una dirección de correo para enviar.',
                    'en' => 'This user does not have an email address to send.',
                }
            ],
            self::NotUserFoundWithEmail => [
                'code' => 6,
                'status' => 404,
                'message' => match(Lang::getLocale()) {
                    'es' => 'No se ha encontrado ningún usuario con esta dirección de correo.',
                    'en' => 'No user with this email address was found.',
                }
            ],
            self::NotUserFoundInHash => [
                'code' => 7,
                'status' => 404,
                'message' => match(Lang::getLocale()) {
                    'es' => 'No se ha encontrado ningún usuario correspondiente a este hash.',
                    'en' => 'No user found corresponding to this hash.',
                }
            ],
            self::ExpiredHash => [
                'code' => 8,
                'status' => 400,
                'message' => match(Lang::getLocale()) {
                    'es' => 'Este hash ha expirado.',
                    'en' => 'This hash has expired.',
                }
            ],
            self::InvalidHashToken => [
                'code' => 9,
                'status' => 400,
                'message' => match(Lang::getLocale()) {
                    'es' => 'El token del hash es incorrecto o ha caducado.',
                    'en' => 'The hash token is incorrect or has expired.',
                }
            ],
            self::AlreadyVerifiedEmailAddress => [
                'code' => 10,
                'status' => 400,
                'message' => match(Lang::getLocale()) {
                    'es' => 'Esta dirección de correo ya ha sido verificada.',
                    'en' => 'This email address has already been verified.',
                }
            ],
            self::InvalidRequestConcept => [
                'code' => 11,
                'status' => 400,
                'message' => match(Lang::getLocale()) {
                    'es' => 'Concepto de petición inválido.',
                    'en' => 'Invalid request concept.',
                }
            ],
        };
    }
}
