<?php

namespace App\Apis\Google;

use Google;

class GoogleDriveApi extends GoogleApi
{
    public function __construct(?string $subject = null)
    {
        parent::__construct($subject);

        $this->_client->addScope([
            Google\Service\Drive::DRIVE,
        ]);

        $this->_service = new Google\Service\Drive($this->_client);
    }

    /* -------------------- */

    public function test()
    {
        //
    }
}
