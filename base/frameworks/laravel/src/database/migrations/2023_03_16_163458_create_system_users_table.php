<?php

use App\Enums\SocialDriverEnum;
use App\Enums\SystemUserStatusEnum;
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
        Schema::create('system_users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable();
            $table->string('picture')->nullable();
            $table->string('token_for_email_verification')->unique()->nullable();
            $table->string('token_for_password_reset')->unique()->nullable();
            $table->string('social_id')->nullable();
            $table->enum('social_driver', SocialDriverEnum::names())->nullable();
            $table->string('social_avatar')->nullable();
            $table->enum('status', SystemUserStatusEnum::names())->default(SystemUserStatusEnum::Active->name);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['email', 'social_driver']);
            $table->unique(['social_id', 'social_driver']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_users');
    }
};
