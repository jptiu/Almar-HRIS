<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\PositionRequest;
use App\Models\Position;
use Illuminate\Http\JsonResponse;

class PositionController extends Controller
{
    /**
     * Store a newly created position.
     */
    public function store(PositionRequest $request): JsonResponse
    {
        $position = Position::create([
            'department_id' => $request->department_id,
            'title' => $request->title,
            'position_level_id' => $request->position_level_id,
            'created_by' => $request->user()?->id,
        ]);

        $position->load('department', 'positionLevel', 'creator');

        return $this->created(['position' => $position], 'Position created successfully.');
    }

    /**
     * Display a listing of positions.
     */
    public function index(): JsonResponse
    {
        $positions = Position::with('department', 'positionLevel', 'creator')->get();
        return $this->success(['positions' => $positions], 'Positions retrieved successfully.');
    }

    /**
     * Display the specified position.
     */
    public function show($position): JsonResponse
    {
        $position = Position::findOrFail($position);
        $position->load('department', 'positionLevel', 'creator');
        return $this->success(['position' => $position], 'Position retrieved successfully.');
    }

    /**
     * Update the specified position.
     */
    public function update(PositionRequest $request, $position): JsonResponse
    {
        $position = Position::findOrFail($position);
        $position->update([
            'department_id' => $request->department_id,
            'title' => $request->title,
            'position_level_id' => $request->position_level_id,
        ]);

        $position->load('department', 'positionLevel', 'creator');

        return $this->success(['position' => $position], 'Position updated successfully.');
    }

    /**
     * Remove the specified position.
     */
    public function destroy($position): JsonResponse
    {
        $position = Position::findOrFail($position);
        $position->delete();
        return $this->success(null, 'Position deleted successfully.');
    }
}

