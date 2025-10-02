import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

const isValidDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s));
const isValidSol = (s) => /^\d+$/.test(String(s));

export function usePhotos({ rover, type, date, camera, page }) {
  return useQuery({
    queryKey: ['photos', rover, type, date, camera, page],
    // Only fetch when rover exists and the input is valid for the chosen type
    enabled: Boolean(rover) && (type === 'earth' ? isValidDate(date) : isValidSol(date)),
    // React Query v5 passes an AbortSignal; wire it to axios so edits cancel prior requests
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams();
      params.set('rover', rover);
      if (type === 'earth') params.set('earth_date', date);
      else params.set('sol', Number(date)); // ensure integer
      if (camera) params.set('camera', camera);
      if (page) params.set('page', String(page));

      const res = await api.get(`/photos?${params.toString()}`, { signal });
      return res.data;
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // back off a bit on 429 rate limits
      const status = error?.response?.status;
      if (status === 429 && failureCount < 1) return true; // one retry
      return failureCount < 2;
    },
    retryDelay: 1000,
  });
}
