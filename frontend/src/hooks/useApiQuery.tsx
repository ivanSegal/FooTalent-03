import { AxiosError } from "axios";
import { api } from "../utils/axiosInstance";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export const useApiQuery = <T,>(
  key: string,
  url: string,
  enabled = true,
): UseQueryResult<T, AxiosError> => {
  return useQuery<T, AxiosError>({
    queryKey: [key],
    queryFn: async () => {
      const { data } = await api.get<T>(url);
      return data;
    },
    enabled,
  });
};
