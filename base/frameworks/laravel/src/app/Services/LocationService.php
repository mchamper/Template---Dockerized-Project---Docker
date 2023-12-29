<?php

namespace App\Services;
use App\Models\Country;
use App\Models\Locality;
use App\Models\Province;

class LocationService
{
    public static function search(string $search)
    {
        return collect([
                Country::where('name', 'like', "%$search%")
                    ->take(100)
                    ->get()
                    ,

                Province::where('name', 'like', "%$search%")
                    // ->orWhereRelation('country', 'name', 'like', "%$search%")
                    ->take(100)
                    ->get()
                    ,

                Locality::where('name', 'like', "%$search%")
                    // ->orWhereRelation('province', 'name', 'like', "%$search%")
                    // ->orWhereRelation('province.country', 'name', 'like', "%$search%")
                    ->take(100)
                    ->get()
                    ,
            ])
            ->flatten(1)
            ->map(function ($item) {
                $item['location_type'] = $item::class;
                $item['location_id'] = $item->id;
                $item['location_ref'] = "{$item['location_type']}:{$item['location_id']}";

                $item->append('full_name');

                return $item;
            })
            ->sortBy('full_name')
            ->values()
            ;
    }
}
