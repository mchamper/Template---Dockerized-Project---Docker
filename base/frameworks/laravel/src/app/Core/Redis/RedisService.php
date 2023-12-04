<?php

namespace App\Core\Redis;

class RedisService
{
    private static $_redis = [];

    public static function add(RedisModel $redis, int $modelId)
    {
        self::$_redis[class_basename($redis) . ':' . $modelId] = $redis;
    }

    public static function run()
    {
        foreach (self::$_redis as $redisKey => $redis) {
            $modelId = explode(':', $redisKey)[1];
            $redis->run($modelId);
        }
    }

    public static function clear()
    {
        self::$_redis = [];
    }
}

