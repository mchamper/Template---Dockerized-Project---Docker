<?php

namespace Database\Seeders;

use App\Enums\InstitutionTypeEnum;
use App\Enums\ProtectedRightEnum;
use App\Models\InstitutionType;
use App\Models\ProtectedRight;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EnumsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $configs = [
            // InstitutionTypeEnum::class => InstitutionType::class,
            // ProtectedRightEnum::class => ProtectedRight::class,
        ];

        foreach ($configs as $enum => $model) {
            $model::whereNotIn('name', $enum::names())->delete();

            collect($enum::names())->map(function ($item, $key) {
                return [
                    'id' => $key + 1,
                    'name' => $item,
                ];
            })->each(fn ($item) => $model::updateOrCreate($item));
        }
    }
}
