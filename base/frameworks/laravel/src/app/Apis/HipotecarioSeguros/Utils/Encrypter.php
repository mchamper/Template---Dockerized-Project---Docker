<?php

namespace App\Apis\HipotecarioSeguros\Utils;

class Encrypter
{
    private $_cipher;
    private $_key;
    private $_iv;

    public function __construct()
    {
        $this->_cipher = 'aes-256-cbc';
        $this->_key = config('services.hipotecario_seguros_api.encrypt_key');
        $this->_iv = config('services.hipotecario_seguros_api.encrypt_vector');
    }

    /* -------------------- */

    public function encrypt(string $value)
    {
        return base64_encode(
            openssl_encrypt(
                $value,
                $this->_cipher,
                $this->_key,
                OPENSSL_RAW_DATA,
                $this->_iv
            )
        );
    }

    public function decrypt(string $hash)
    {
        return openssl_decrypt(
            base64_decode($hash),
            $this->_cipher,
            $this->_key,
            OPENSSL_RAW_DATA,
            $this->_iv
        );
    }
}
