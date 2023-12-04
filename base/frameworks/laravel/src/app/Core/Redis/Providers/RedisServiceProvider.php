<?php

namespace App\Core\Redis\Providers;

use App\Core\Redis\Middleware\RunRedis;
use App\Core\Redis\RedisService;
use Illuminate\Contracts\Http\Kernel;
use Illuminate\Support\ServiceProvider;

class RedisServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(Kernel $kernel): void
    {
        $kernel->pushMiddleware(RunRedis::class);

        $finder = new \Symfony\Component\Finder\Finder();
        $finder->files()->name('*Redis.php')->in(base_path() . '/app/Redis');

        $namespace = 'App\\Redis';

        foreach ($finder as $file) {
            if ($relativePath = $file->getRelativePath()) {
                $namespace .= '\\' . strtr($relativePath, '/', '\\');
            }

            $class = $namespace . '\\' . $file->getBasename('.php');
            $reflectionClass = new \ReflectionClass($class);

            if (!$reflectionClass->isAbstract()) {
                $redis = $reflectionClass->newInstance();

                foreach ($redis->config as $modelClass => $events) {
                    foreach ($events as $event) {
                        $modelClass::$event(function ($model) use ($redis) {
                            RedisService::add($redis, $model->id);
                        });
                    }
                }
            }
        }
    }
}
