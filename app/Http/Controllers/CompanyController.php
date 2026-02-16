<?php

namespace App\Http\Controllers;

use App\Http\Requests\CompanyRequest;
use App\Models\Company;
use Illuminate\Http\JsonResponse;

class CompanyController extends Controller
{
    /**
     * Display a listing of companies.
     */
    public function index(): JsonResponse
    {
        $companies = Company::with('branches')->get();

        return $this->success([
            'companies' => $companies
        ], 'Companies retrieved successfully.');
    }

    /**
     * Store a newly created company.
     */
    public function store(CompanyRequest $request): JsonResponse
    {
        $company = Company::create([
            'name'  => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
        ]);

        return $this->created([
            'company' => $company
        ], 'Company created successfully.');
    }

    /**
     * Display the specified company.
     */
    public function show(Company $company): JsonResponse
    {
        $company->load('branches');

        return $this->success([
            'company' => $company
        ], 'Company retrieved successfully.');
    }

    /**
     * Update the specified company.
     */
    public function update(CompanyRequest $request, Company $company): JsonResponse
    {
        $company->update([
            'name'  => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
        ]);

        return $this->success([
            'company' => $company->fresh()
        ], 'Company updated successfully.');
    }

    /**
     * Remove the specified company.
     */
    public function destroy(Company $company): JsonResponse
    {
        $company->delete();

        return $this->success(null, 'Company deleted successfully.');
    }
}