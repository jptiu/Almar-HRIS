<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class SearchFilter
{
    protected Builder $query;
    protected string $table;

    protected array $allowedFilters = [];
    protected array $allowedSorts = [];
    protected array $modelSearchable = [];

    protected array $customSearchable = [];
    protected $customSearchCallback = null;

    protected array $joinedRelations = [];

    public function __construct(Builder $query)
    {
        $this->query = $query;

        $model = $query->getModel();

        $this->table           = $model->getTable();
        $this->allowedFilters  = $model->allowedFilters ?? [];
        $this->allowedSorts    = $model->allowedSorts ?? [];
        $this->modelSearchable = $model->searchable ?? [];
    }

    public static function for(Builder $query): self
    {
        return new self($query);
    }

    /*
    |--------------------------------------------------------------------------
    | SEARCH CONFIG
    |--------------------------------------------------------------------------
    */

    public function searchable(array $columns): self
    {
        $this->customSearchable = $columns;
        return $this;
    }

    public function searchUsing(callable $callback): self
    {
        $this->customSearchCallback = $callback;
        return $this;
    }

    /*
    |--------------------------------------------------------------------------
    | SEARCH
    |--------------------------------------------------------------------------
    */

    public function search(?string $term): self
    {
        if (!$term) {
            return $this;
        }

        // 1️⃣ Highest priority: custom callback
        if ($this->customSearchCallback) {
            call_user_func($this->customSearchCallback, $this->query, $term);
            return $this;
        }

        // 2️⃣ Determine searchable columns
        $columns = !empty($this->customSearchable)
            ? $this->customSearchable
            : $this->modelSearchable;

        if (empty($columns)) {
            return $this;
        }

        $this->query->where(function ($q) use ($term, $columns) {

            foreach ($columns as $column) {

                if (str_contains($column, '.')) {
                    [$relation, $relColumn] = explode('.', $column);

                    $q->orWhereHas($relation, function ($rq) use ($relColumn, $term) {
                        $rq->where($relColumn, 'like', "%{$term}%");
                    });

                } else {
                    $q->orWhere(
                        "{$this->table}.{$column}",
                        'like',
                        "%{$term}%"
                    );
                }
            }
        });

        return $this;
    }

    /*
    |--------------------------------------------------------------------------
    | FILTERS
    |--------------------------------------------------------------------------
    */

    public function filters(array $filters): self
    {
        foreach ($filters as $column => $value) {

            if ($value === null || $value === '') {
                continue;
            }

            $baseColumn = $this->normalizeColumn($column);

            if (!in_array($baseColumn, $this->allowedFilters)) {
                continue;
            }

            $this->applyFilter($column, $value);
        }

        return $this;
    }

    protected function applyFilter(string $column, $value): void
    {
        // Date range
        if (str_ends_with($column, '_from')) {
            $this->query->whereDate(
                "{$this->table}." . str_replace('_from', '', $column),
                '>=',
                $value
            );
            return;
        }

        if (str_ends_with($column, '_to')) {
            $this->query->whereDate(
                "{$this->table}." . str_replace('_to', '', $column),
                '<=',
                $value
            );
            return;
        }

        // Numeric range
        if (str_ends_with($column, '_min')) {
            $this->query->where(
                "{$this->table}." . str_replace('_min', '', $column),
                '>=',
                $value
            );
            return;
        }

        if (str_ends_with($column, '_max')) {
            $this->query->where(
                "{$this->table}." . str_replace('_max', '', $column),
                '<=',
                $value
            );
            return;
        }

        // Relation filter
        if (str_contains($column, '.')) {
            [$relation, $relationColumn] = explode('.', $column);

            $this->query->whereHas($relation, function ($q) use ($relationColumn, $value) {
                $q->where($relationColumn, $value);
            });

            return;
        }

        // Normal column
        if (is_array($value)) {
            $this->query->whereIn("{$this->table}.{$column}", $value);
        } else {
            $this->query->where("{$this->table}.{$column}", $value);
        }
    }

    protected function normalizeColumn(string $column): string
    {
        return str_replace(['_from', '_to', '_min', '_max'], '', $column);
    }

    /*
    |--------------------------------------------------------------------------
    | SORT
    |--------------------------------------------------------------------------
    */

    public function sort(?string $field, ?string $direction = 'desc'): self
    {
        $field = $field ?? 'created_at';
        $direction = strtolower($direction) === 'asc' ? 'asc' : 'desc';

        if (!in_array($field, $this->allowedSorts)) {
            return $this;
        }

        if (str_contains($field, '.')) {
            [$relation, $relationColumn] = explode('.', $field);

            $this->joinRelationIfNeeded($relation);

            $this->query->orderBy(
                "{$relation}.{$relationColumn}",
                $direction
            );
        } else {
            $this->query->orderBy(
                "{$this->table}.{$field}",
                $direction
            );
        }

        return $this;
    }

    protected function joinRelationIfNeeded(string $relation): void
    {
        if (in_array($relation, $this->joinedRelations)) {
            return;
        }

        $this->query->joinRelation($relation);
        $this->joinedRelations[] = $relation;
    }

    /*
    |--------------------------------------------------------------------------
    | EXECUTION
    |--------------------------------------------------------------------------
    */

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return $this->query->paginate($perPage);
    }

    public function get()
    {
        return $this->query->get();
    }

    public function query(): Builder
    {
        return $this->query;
    }
}