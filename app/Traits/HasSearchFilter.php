<?php

namespace App\Traits;

use App\Helpers\SearchFilter;
use Illuminate\Http\Request;

trait HasSearchFilter
{
    /**
     * Apply search, filters, sort, and pagination.
     * Automatically uses $searchable, $allowedFilters, $allowedSorts from the model.
     *
     * @param Request $request
     * @param \Illuminate\Database\Eloquent\Builder|null $query
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public static function applyFilters(Request $request, $query = null)
    {
        $model = new static;

        // Use provided query or create a new one
        $query = $query ?? $model->newQuery();

        // Automatically include relationships if $with exists
        if (property_exists($model, 'with') && is_array($model->with)) {
            $query->with($model->with);
        }

        return SearchFilter::for($query)
            ->search($request->query('search'))
            ->filters($request->all())
            ->sort(
                $request->query('sort_field', 'created_at'),
                $request->query('sort_order', 'desc')
            )
            ->paginate($request->query('per_page', 10));
    }
}
