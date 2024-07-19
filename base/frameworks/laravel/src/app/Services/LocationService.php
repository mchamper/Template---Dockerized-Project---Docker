<?php

namespace App\Services;

use App\Models\LocationCountry;
use App\Models\LocationLevelA;
use App\Models\LocationLevelB;

class LocationService
{
    public static function search(string $query)
    {
        return collect([
            LocationCountry::where('name', 'like', "%$query%")
                ->take(100)
                ->get(),

            LocationLevelA::where('name', 'like', "%$query%")
                // ->orWhereRelation('parent', 'name', 'like', "%$query%")
                ->take(100)
                ->get(),

            LocationLevelB::where('name', 'like', "%$query%")
                // ->orWhereRelation('parent', 'name', 'like', "%$query%")
                // ->orWhereRelation('parent.parent', 'name', 'like', "%$query%")
                ->take(100)
                ->get()
                ,
        ])
        ->flatten(1)
        ->map(function ($item) {
            $item['location_class'] = $item::class;
            $item['location_id'] = $item->id;
            $item['location_ref'] = "{$item['location_class']}:{$item['location_id']}";

            $item->append('full_name');

            return $item;
        })
        ->sortBy('full_name')
        ->values()
        ;
    }
}
