<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class SearchFilter
{
    protected Builder $query;
    protected array $allowedFilters = [];
    protected array $allowedSorts = [];
    protected array $searchable = [];

    public function __construct(Builder $query)
    {
        $this->query = $query;

        $model = $query->getModel();

        $this->allowedFilters = $model->allowedFilters ?? [];
        $this->allowedSorts = $model->allowedSorts ?? [];
        $this->searchable = $model->searchable ?? [];
    }

    public static function for(Builder $query): self
    {
        return new self($query);
    }

    public function search(?string $term): self
    {
        if (!$term || empty($this->searchable)) return $this;

        $this->query->where(function ($q) use ($term) {
            foreach ($this->searchable as $column) {
                if (str_contains($column, '.')) {
                    [$relation, $relColumn] = explode('.', $column);
                    $q->orWhereHas($relation, fn($rq) => $rq->where($relColumn, 'like', "%{$term}%"));
                } else {
                    $q->orWhere($column, 'like', "%{$term}%");
                }
            }
        });

        return $this;
    }

    public function filters(array $filters): self
    {
        foreach ($filters as $column => $value) {
            if (!in_array($column, $this->allowedFilters) || $value === null || $value === '') {
                continue;
            }

            if (is_array($value)) {
                $this->query->whereIn($column, $value);
            } elseif (str_ends_with($column, '_from')) {
                $this->query->whereDate(str_replace('_from', '', $column), '>=', $value);
            } elseif (str_ends_with($column, '_to')) {
                $this->query->whereDate(str_replace('_to', '', $column), '<=', $value);
            } elseif (str_ends_with($column, '_min')) {
                $this->query->where(
                    str_replace('_min', '', $column),
                    '>=',
                    $value
                );
            } elseif (str_ends_with($column, '_max')) {
                $this->query->where(
                    str_replace('_max', '', $column),
                    '<=',
                    $value
                );
            } elseif (str_contains($column, '.')) {
                [$relation, $relationColumn] = explode('.', $column);

                $this->query->whereHas($relation, function ($q) use ($relationColumn, $value) {
                    $q->where($relationColumn, $value);
                });
            } else {
                $this->query->where($column, $value);
            }
        }

        return $this;
    }

    public function sort(?string $field, ?string $direction = 'desc'): self
    {
        $field = $field ?? 'created_at';
        $direction = strtolower($direction) === 'asc' ? 'asc' : 'desc';

        if (!in_array($field, $this->allowedSorts)) return $this;

        if (str_contains($field, '.')) {
            [$relation, $relationColumn] = explode('.', $field);
            $this->query->joinRelation($relation)->orderBy($relation . '.' . $relationColumn, $direction);
        } else {
            $this->query->orderBy($field, $direction);
        }

        return $this;
    }

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
