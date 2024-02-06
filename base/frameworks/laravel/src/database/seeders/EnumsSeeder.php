<?php

namespace Database\Seeders;

use App\Enums\InstitutionTypeEnum;
use App\Enums\ProtectedRightEnum;
use App\Models\InstitutionType;
use App\Models\ProtectedRight;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

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
            $namesForDelete = $model::getDbBuilder()->whereNotIn('name', $enum::names())->pluck('name');

            collect($enum::names())->map(function ($item, $key) {
                return [
                    'id' => $key + 1,
                    'name' => $item,
                ];
            })->each(fn ($item) => $model::updateOrCreate(['id' => $item['id']], $item));

            $model::whereIn('name', $namesForDelete)->delete();
        }
    }
}
