<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\DepartmentRequest;
use App\Models\Department;
use Illuminate\Http\JsonResponse;

class DepartmentController extends Controller
{
    /**
     * Store a newly created department.
     */
    public function store(DepartmentRequest $request): JsonResponse
    {
        $department = Department::create([
            'name' => $request->name,
            'description' => $request->description,
            'created_by' => $request->user()->id,
        ]);

        return $this->created(['department' => $department], 'Department created successfully.');
    }

    /**
     * Display a listing of departments.
     */
    public function index(): JsonResponse
    {
        $departments = Department::with(['positions', 'creator'])->get();
        return $this->success(['departments' => $departments], 'Departments retrieved successfully.');
    }

    /**
     * Display the specified department.
     */
    public function show($id): JsonResponse
    {
        $department = Department::findOrFail($id);
        $department->load(['positions', 'creator']);
        return $this->success(['department' => $department], 'Department retrieved successfully.');
    }

    /**
     * Update the specified department.
     */
    public function update(DepartmentRequest $request, $id): JsonResponse
    {
        $department = Department::findOrFail($id);
        $department->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return $this->success(['department' => $department], 'Department updated successfully.');
    }

    /**
     * Remove the specified department.
     */
    public function destroy($id): JsonResponse
    {
        $department = Department::findOrFail($id);
        $department->delete();
        return $this->success(null, 'Department deleted successfully.');
    }
}

