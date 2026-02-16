<?php

namespace App\Http\Controllers;

use App\Http\Requests\DepartmentRequest;
use App\Models\Department;
use Illuminate\Http\JsonResponse;

class DepartmentController extends Controller
{
    /**
     * Display a listing of departments.
     */
    public function index(): JsonResponse
    {
        $departments = Department::with(['positions', 'creator', 'company'])->get();

        return $this->success([
            'departments' => $departments
        ], 'Departments retrieved successfully.');
    }

    /**
     * Store a newly created department.
     */
    public function store(DepartmentRequest $request): JsonResponse
    {
        $department = Department::create([
            'name'       => $request->name,
            'description'=> $request->description,
            'company_id' => $request->company_id,
            'created_by' => $request->user()->id,
        ]);

        $department->load('company');

        return $this->created([
            'department' => $department
        ], 'Department created successfully.');
    }

    /**
     * Display the specified department.
     */
    public function show(Department $department): JsonResponse
    {
        $department->load(['positions', 'creator', 'company']);

        return $this->success([
            'department' => $department
        ], 'Department retrieved successfully.');
    }

    /**
     * Update the specified department.
     */
    public function update(DepartmentRequest $request, Department $department): JsonResponse
    {
        $department->update([
            'name'       => $request->name,
            'description'=> $request->description,
            'company_id' => $request->company_id,
        ]);

        return $this->success([
            'department' => $department
        ], 'Department updated successfully.');
    }

    /**
     * Remove the specified department.
     */
    public function destroy(Department $department): JsonResponse
    {
        $department->delete();

        return $this->success(null, 'Department deleted successfully.');
    }
}