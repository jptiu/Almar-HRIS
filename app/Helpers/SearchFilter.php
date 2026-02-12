<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class SearchFilter
{
    protected Builder $query;

    /**
     * Initialize with a query builder
     */
    public function __construct(Builder $query)
    {
        $this->query = $query;
    }

    /**
     * Static constructor for fluent syntax
     */
    public static function for(Builder $query): self
    {
        return new self($query);
    }

    /**
     * Global keyword search
     * Supports direct and related columns (dot notation)
     * If no columns passed, will use $searchable property in model if defined
     */
    public function search(?string $term, array $columns = []): self
    {
        if (!$term) return $this;

        // Use default searchable columns from model if none passed
        if (empty($columns) && property_exists($this->query->getModel(), 'searchable')) {
            $columns = $this->query->getModel()->searchable;
        }

        if (empty($columns)) return $this; // Nothing to search

        $this->query->where(function ($q) use ($term, $columns) {
            foreach ($columns as $column) {
                if (str_contains($column, '.')) {
                    // Related field: relation.column
                    [$relation, $relColumn] = explode('.', $column);
                    $q->orWhereHas($relation, fn($rq) => $rq->where($relColumn, 'like', "%{$term}%"));
                } else {
                    // Direct column
                    $q->orWhere($column, 'like', "%{$term}%");
                }
            }
        });

        return $this;
    }

    /**
     * Apply exact-match filters from flat query params
     * Example: ['status' => 'approved', 'employee_id' => 1]
     */
    public function filters(array $filters)
    {
        foreach ($filters as $column => $value) {
            if (empty($value)) continue;

            if (str_contains($column, '.')) {
                // Relation filter
                [$relation, $relationColumn] = explode('.', $column);
                $this->query->whereHas($relation, function ($q) use ($relationColumn, $value) {
                    $q->where($relationColumn, $value);
                });
            } else {
                // Normal column filter
                $this->query->where($column, $value);
            }
        }

        return $this;
    }

    /**
     * Apply sorting
     */
    public function sort(string $field = 'created_at', string $order = 'desc'): self
    {
        $this->query->orderBy($field, $order);
        return $this;
    }

    /**
     * Paginate results
     */
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return $this->query->paginate($perPage);
    }

    /**
     * Get collection without pagination
     */
    public function get()
    {
        return $this->query->get();
    }

    /**
     * Access the raw query builder if needed
     */
    public function query(): Builder
    {
        return $this->query;
    }
}
