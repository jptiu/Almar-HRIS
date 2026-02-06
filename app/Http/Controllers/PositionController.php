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
            'level' => $request->level,
        ]);

        $position->load('department');

        return $this->created(['position' => $position], 'Position created successfully.');
    }

    /**
     * Display a listing of positions.
     */
    public function index(): JsonResponse
    {
        $positions = Position::with('department')->get();
        return $this->success(['positions' => $positions], 'Positions retrieved successfully.');
    }

    /**
     * Display the specified position.
     */
    public function show($id): JsonResponse
    {
        $position = Position::findOrFail($id);
        $position->load('department');
        return $this->success(['position' => $position], 'Position retrieved successfully.');
    }

    /**
     * Update the specified position.
     */
    public function update(PositionRequest $request, $id): JsonResponse
    {
        $position = Position::findOrFail($id);
        $position->update([
            'department_id' => $request->department_id,
            'title' => $request->title,
            'level' => $request->level,
        ]);

        $position->load('department');

        return $this->success(['position' => $position], 'Position updated successfully.');
    }

    /**
     * Remove the specified position.
     */
    public function destroy($id): JsonResponse
    {
        $position = Position::findOrFail($id);
        $position->delete();
        return $this->success(null, 'Position deleted successfully.');
    }
}

