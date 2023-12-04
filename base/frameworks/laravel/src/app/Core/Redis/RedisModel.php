<?php

namespace App\Core\Redis;

abstract class RedisModel
{
    protected $_models = [];
    public $config = [];

    public function __construct()
    {
        foreach ($this->_models as $model) {
            $this->config[$model] = [
                'saved',
                'deleted',
            ];
        }
    }

    /* -------------------- */

    abstract public function run(int $modelId);
}

