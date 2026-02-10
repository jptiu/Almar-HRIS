<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\BranchRequest;
use App\Models\Branch;
use Illuminate\Http\JsonResponse;

class BranchController extends Controller
{
    /**
     * Store a newly created branch.
     */
    public function store(BranchRequest $request): JsonResponse
    {
        $branch = Branch::create([
            'company_id' => $request->company_id,
            'name' => $request->name,
            'address' => $request->address,
        ]);

        $branch->load('company');

        return $this->created(['branch' => $branch], 'Branch created successfully.');
    }

    /**
     * Display a listing of branches.
     */
    public function index(): JsonResponse
    {
        $branches = Branch::with('company')->get();
        return $this->success(['branches' => $branches], 'Branches retrieved successfully.');
    }

    /**
     * Display the specified branch.
     */
    public function show($id): JsonResponse
    {
        $branch = Branch::findOrFail($id);
        $branch->load('company', 'employees', 'hrManagers');
        return $this->success(['branch' => $branch], 'Branch retrieved successfully.');
    }

    /**
     * Update the specified branch.
     */
    public function update(BranchRequest $request, $id): JsonResponse
    {
        $branch = Branch::findOrFail($id);
        $branch->update([
            'company_id' => $request->company_id,
            'name' => $request->name,
            'address' => $request->address,
        ]);

        $branch->load('company');

        return $this->success(['branch' => $branch], 'Branch updated successfully.');
    }

    /**
     * Remove the specified branch.
     */
    public function destroy($id): JsonResponse
    {
        $branch = Branch::findOrFail($id);
        $branch->delete();
        return $this->success(null, 'Branch deleted successfully.');
    }
}

