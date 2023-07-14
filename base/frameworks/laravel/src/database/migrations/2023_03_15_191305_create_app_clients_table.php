<?php

use App\Enums\AppClientStatusEnum;
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
        Schema::create('app_clients', function (Blueprint $table) {
            $table->id()->startingValue(100);
            $table->string('name')->nullable();
            $table->string('key')->unique();
            $table->string('secret')->unique();
            $table->json('scopes');
            $table->json('hosts');
            $table->enum('status', AppClientStatusEnum::names())->default(AppClientStatusEnum::Active->name);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('app_clients');
    }
};
