import { useMemo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getEmployeeDocuments } from "../api";
import { useDebounce } from "@/hooks";

const MIN_SEARCH_LENGTH = 2;
const DEBOUNCE_DELAY = 400;
const STALE_TIME = 1000 * 60 * 10; // 10 minutes

export const useFetchEmployeeDocumentsQuery = (
  page = 1,
  perPage = 10,
  filters = {},
) => {
  const { search, ...restFilters } = filters;

  const debouncedSearch = useDebounce(search ?? "", DEBOUNCE_DELAY);

  const effectiveSearch =
    debouncedSearch.trim().length >= MIN_SEARCH_LENGTH
      ? debouncedSearch.trim()
      : undefined;

  const stableFilters = useMemo(
    () => ({
      ...(effectiveSearch && { search: effectiveSearch }),
      ...(restFilters.company_id && {
        company_id: restFilters.company_id,
      }),
      ...(restFilters.branch_id && {
        branch_id: restFilters.branch_id,
      }),
    }),
    [effectiveSearch, restFilters.company_id, restFilters.branch_id],
  );

  return useQuery({
    queryKey: ["employeeDocuments", page, perPage, stableFilters],

    queryFn: ({ signal }) =>
      getEmployeeDocuments(page, perPage, stableFilters, signal),

    staleTime: STALE_TIME,

    placeholderData: keepPreviousData,
  });
};
