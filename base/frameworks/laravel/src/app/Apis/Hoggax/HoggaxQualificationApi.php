<?php

namespace App\Apis\Hoggax;

class HoggaxQualificationApi extends HoggaxApi
{
    public function __construct()
    {
        parent::__construct();
    }

    /* -------------------- */

    public function qualify(array $input): mixed
    {
        $res = $this->_try(function () use ($input) {
            return $this->_send('post', '/cotizador/individuo/calificar', [
                'json' => $input,
            ]);
        });

        return $res;
    }
}
