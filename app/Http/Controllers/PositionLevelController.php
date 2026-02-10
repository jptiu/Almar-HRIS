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
    public function show($id): JsonResponse
    {
        $level = PositionLevel::findOrFail($id);

        return $this->success(['position_level' => $level], 'Position level retrieved successfully.');
    }
}

