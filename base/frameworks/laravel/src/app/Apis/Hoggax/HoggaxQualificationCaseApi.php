<?php

namespace App\Apis\Hoggax;

class HoggaxQualificationCaseApi extends HoggaxApi
{
    public function __construct()
    {
        parent::__construct();
    }

    /* -------------------- */

    public function approve(string $bailNumber, ?string $comments = null): mixed
    {
        $res = $this->_try(function () use ($bailNumber, $comments) {
            $input = [
                'idHoggax' => $bailNumber,
                'comentarios' => $comments,
            ];

            return $this->_send('post', '/back/individuo/aprobar-revisado', [
                'json' => $input,
            ]);
        });

        return $res;
    }

    public function reject(string $bailNumber, ?string $comments = null): mixed
    {
        $res = $this->_try(function () use ($bailNumber, $comments) {
            $input = [
                'idHoggax' => $bailNumber,
                'comentarios' => $comments,
            ];

            return $this->_send('post', '/back/individuo/rechazar-revisado', [
                'json' => $input,
            ]);
        });

        return $res;
    }

    public function requestCoApplicant(string $bailNumber, ?string $comments = null): mixed
    {
        $res = $this->_try(function () use ($bailNumber, $comments) {
            $input = [
                'idHoggax' => $bailNumber,
                'comentarios' => $comments,
            ];

            return $this->_send('post', '/back/individuo/solicitar-cogarante-revisado', [
                'json' => $input,
            ]);
        });

        return $res;
    }

    public function requestReview(string $bailNumber, ?string $comments = null): mixed
    {
        $res = $this->_try(function () use ($bailNumber, $comments) {
            $input = [
                'idHoggax' => $bailNumber,
                'comentarios' => $comments,
            ];

            return $this->_send('post', '/back/individuo/solicitar-revision', [
                'json' => $input,
            ]);
        });

        return $res;
    }
}
