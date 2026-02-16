<?php

namespace App\Http\Controllers;

use App\Models\PositionLevel;
use Illuminate\Http\JsonResponse;

class PositionLevelController extends Controller
{
    /**
     * Display a listing of position levels.
     */
    public function index(): JsonResponse
    {
        $levels = PositionLevel::orderBy('level_rank')->get();

        return $this->success(['position_levels' => $levels], 'Position levels retrieved successfully.');
    }

    /**
     * Display the specified position level.
     */
    public function show(PositionLevel $positionLevel): JsonResponse
    {
        // Automatically resolved by Laravel's route model binding
        return $this->success(['position_level' => $positionLevel], 'Position level retrieved successfully.');
    }
}