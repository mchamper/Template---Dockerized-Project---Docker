<?php

namespace App\Http\Controllers\Api\v1\Backoffice;

use App\Commons\Response\Response;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\CategoryGroup;
use App\Models\UserAssetCombo;
use App\Models\UserAssetType;
use App\Models\UserMarketTokenStatus;
use App\Models\UserMarketTokenType;

class CombosController extends Controller
{
    public function get()
    {
        $concepts = explode(',', request()->query('concepts'));
        $combos = [];

        foreach ($concepts as $concept) {
            switch ($concept) {
                case 'user_market_token_statuses': {
                    $combos[$concept] = UserMarketTokenStatus::get();
                    break;
                }

                case 'user_market_token_statuses:without_minted': {
                    $combos[$concept] = UserMarketTokenStatus::where('id', '!=', 1)->get();
                    break;
                }

                case 'user_market_token_types': {
                    $combos[$concept] = UserMarketTokenType::get();
                    break;
                }

                case 'user_asset_types': {
                    $combos[$concept] = UserAssetType::get();
                    break;
                }

                case 'user_asset_combos': {
                    $combos[$concept] = UserAssetCombo::get();
                    break;
                }

                case 'categories': {
                    $combos[$concept] = Category::select('id', 'nombre', 'group_id')->with('group')
                        ->orderBy(
                            CategoryGroup::select('name')
                                ->whereColumn('group_id', 'category_groups.id')
                                ->orderBy('name')
                                ->limit(1),
                        )
                        ->orderBy('nombre')
                        ->get()
                        ;

                    break;
                }
            }
        }

        return Response::json([
            'combos' => $combos,
        ]);
    }
}
