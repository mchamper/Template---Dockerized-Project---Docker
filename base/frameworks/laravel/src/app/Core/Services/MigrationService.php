<?php

namespace App\Core\Services;

use Illuminate\Database\Schema\Blueprint;

class MigrationService
{
    public static function addCreatedByColumns(Blueprint $table, string $constrained = 'system_users')
    {
        $table->foreignId('created_by_id')->nullable()
            ->constrained($constrained)
            ->cascadeOnUpdate()
            ->restrictOnDelete();

        $table->foreignId('updated_by_id')->nullable()
            ->constrained($constrained)
            ->cascadeOnUpdate()
            ->restrictOnDelete();
    }

    public static function addAuthColumns(Blueprint $table, bool $withPassword = true, bool $withSocialDriver = false)
    {
        $table->string('first_name');
        $table->string('last_name');
        $table->string('email');
        $table->timestamp('email_verified_at')->nullable();

        if ($withPassword) {
            $table->string('password')->nullable(!$withSocialDriver);
        }
        // $table->rememberToken();
        $table->string('token_for_email_verification')->unique()->nullable();

        if ($withPassword) {
            $table->string('token_for_password_reset')->unique()->nullable();
        }

        if ($withSocialDriver) {
            $table->string('social_id')->nullable();
            $table->foreignId('social_driver_id')->nullable()
                ->constrained('auth_social_drivers')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->string('social_avatar')->nullable();
        }

        $table->foreignId('status_id')
            ->constrained('auth_statuses')
            ->cascadeOnUpdate()
            ->restrictOnDelete();

        $table->timestamps();
        $table->softDeletes();

        if ($withSocialDriver) {
            $table->unique(['email', 'social_driver_id']);
            $table->unique(['social_id', 'social_driver_id']);
        } else {
            $table->unique('email');
        }
    }
}
