import { useMemo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getMyDocuments } from "../api";
import { useDebounce } from "@/hooks";

const MIN_SEARCH_LENGTH = 2;
const DEBOUNCE_DELAY = 400;
const STALE_TIME = 1000 * 60 * 10; // 10 minutes

export const useFetchMyDocumentsQuery = (
  page = 1,
  perPage = 10,
  filters = {},
) => {
  const { search, ...restFilters } = filters;

  const debouncedSearch = useDebounce(search ?? "", DEBOUNCE_DELAY);

  // Only send the search param when it meets the minimum length.
  const effectiveSearch =
    debouncedSearch.trim().length >= MIN_SEARCH_LENGTH
      ? debouncedSearch.trim()
      : undefined;

  const stableFilters = useMemo(
    () => ({
      ...(effectiveSearch && { search: effectiveSearch }),
      ...(restFilters.document_type_id && {
        document_type_id: restFilters.document_type_id,
      }),
    }),
    [effectiveSearch, restFilters.document_type_id],
  );

  return useQuery({
    queryKey: ["myDocuments", page, perPage, stableFilters],

    queryFn: ({ signal }) =>
      getMyDocuments(page, perPage, stableFilters, signal),

    staleTime: STALE_TIME,

    placeholderData: keepPreviousData,
  });
};
