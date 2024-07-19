<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private $_levels = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    private $_levelsToCreate = 2;

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('location_countries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('country_code')->nullable();
            $table->string('phone_area_code')->nullable();
        });

        foreach (Arr::take($this->_levels, $this->_levelsToCreate) as $levelKey => $level) {
            Schema::create("location_level_{$level}", function (Blueprint $table) use ($levelKey) {
                $table->id();
                $table->string('name');
                $table->string('type');

                if ($levelKey === 0) {
                    $table->foreignId('parent_id')
                        ->constrained('location_countries')
                        ->cascadeOnUpdate()
                        ->restrictOnDelete();
                } else {
                    $table->foreignId('parent_id')
                        ->constrained("location_level_{$this->_levels[$levelKey - 1]}")
                        ->cascadeOnUpdate()
                        ->restrictOnDelete();
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        foreach (Arr::sortDesc($this->_levels) as $level) {
            Schema::dropIfExists("location_level_{$level}");
        }

        Schema::dropIfExists('location_countries');
    }
};
