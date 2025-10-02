import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

export function useRovers() {
  return useQuery({
    queryKey: ['rovers'],
    queryFn: async ({ signal }) => (await api.get('/rovers', { signal })).data,
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      const status = error?.response?.status;
      if (status === 403) return false; // don't hammer on forbidden
      return failureCount < 2;
    },
    retryDelay: 1000,
  });
}
