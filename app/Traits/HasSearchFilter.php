<?php

namespace App\Traits;

use App\Helpers\SearchFilter;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

trait HasSearchFilter
{
    /**
     * Apply search, filters, sort, and pagination.
     *
     * @param Request $request
     * @param Builder|null $query
     * @param array|null $filters
     * @param array|null $searchableOverride
     * @param callable|null $searchCallback
     * @return LengthAwarePaginator
     */
    public static function applyFilters(
        Request $request,
        ?Builder $query = null,
        ?array $filters = null,
        ?array $searchableOverride = null,
        ?callable $searchCallback = null
    ): LengthAwarePaginator {

        $model = new static;

        $query = $query ?? $model->newQuery();

        // Auto eager load model $with
        if (property_exists($model, 'with') && is_array($model->with)) {
            $query->with($model->with);
        }

        $filterData = $filters ?? $request->all();

        $searchFilter = SearchFilter::for($query);

        // Optional override searchable
        if ($searchableOverride) {
            $searchFilter->searchable($searchableOverride);
        }

        // Optional custom search logic
        if ($searchCallback) {
            $searchFilter->searchUsing($searchCallback);
        }

        return $searchFilter
            ->search($request->query('search'))
            ->filters($filterData)
            ->sort(
                $request->query('sort_field', 'created_at'),
                $request->query('sort_order', 'desc')
            )
            ->paginate((int) $request->query('per_page', 10));
    }
}
