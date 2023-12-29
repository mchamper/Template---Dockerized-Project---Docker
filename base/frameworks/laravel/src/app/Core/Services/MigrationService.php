<?php

namespace App\Core\Services;

use Illuminate\Database\Schema\Blueprint;

class MigrationService
{
    public static function addCreatedByColumns(Blueprint $table)
    {
        $table->foreignId('created_by_id')->nullable()
            ->constrained('system_users')
            ->cascadeOnUpdate()
            ->restrictOnDelete()
            ;

        $table->foreignId('updated_by_id')->nullable()
            ->constrained('system_users')
            ->cascadeOnUpdate()
            ->restrictOnDelete()
            ;
    }
}
