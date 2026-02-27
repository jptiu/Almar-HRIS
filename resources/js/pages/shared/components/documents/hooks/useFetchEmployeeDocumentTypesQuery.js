import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEmployeeDocumentTypes } from "../api";

const STALE_TIME = 1000 * 60 * 10; // 10 minutes

export const useFetchEmployeeDocumentTypesQuery = (employeeId) => {
  const stableEmployeeId = useMemo(
    () => (employeeId ? String(employeeId) : ""),
    [employeeId],
  );

  return useQuery({
    queryKey: ["employeeDocumentTypes", stableEmployeeId],
    queryFn: ({ signal }) => getEmployeeDocumentTypes(stableEmployeeId, signal),
    enabled: Boolean(stableEmployeeId),
    staleTime: STALE_TIME,
  });
};
