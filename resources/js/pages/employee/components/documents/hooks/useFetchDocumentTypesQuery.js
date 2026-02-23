import { useQuery } from "@tanstack/react-query";
import { getDocumentTypes } from "../api";

export const useFetchDocumentTypesQuery = () => {
  return useQuery({
    queryKey: ["documentTypes"],
    queryFn: getDocumentTypes,
    staleTime: 1000 * 60 * 30,
  });
};
