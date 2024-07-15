<?php

use App\Core\Services\MigrationService;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('auth_social_drivers', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
        });

        Schema::create('auth_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
        });

        /* -------------------- */

        Schema::create('users', function (Blueprint $table) {
            $table->id();

            MigrationService::addAuthColumns($table,
                withPassword: true,
                withSocialDriver: false
            );
        });

        Schema::create('system_users', function (Blueprint $table) {
            $table->id();

            MigrationService::addAuthColumns($table,
                withPassword: true,
                withSocialDriver: true
            );
        });

        Schema::create('external_users', function (Blueprint $table) {
            $table->id();
            $table->string('company');

            MigrationService::addAuthColumns($table,
                withPassword: false,
                withSocialDriver: false
            );
        });

        /* -------------------- */

        Schema::create('internal_users', function (Blueprint $table) {
            $table->id();
            $table->string('name');

            $table->foreignId('status_id')
                ->constrained('auth_statuses')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->timestamps();
            $table->softDeletes();
        });

        /* -------------------- */

        // Schema::create('password_reset_tokens', function (Blueprint $table) {
        //     $table->string('email')->primary();
        //     $table->string('token');
        //     $table->timestamp('created_at')->nullable();
        // });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('external_users');
        Schema::dropIfExists('internal_users');
        Schema::dropIfExists('system_users');
        Schema::dropIfExists('users');
        Schema::dropIfExists('auth_statuses');
        Schema::dropIfExists('auth_social_drivers');
    }
};
