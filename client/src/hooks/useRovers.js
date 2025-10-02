import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';


export function useRovers() {
return useQuery({
queryKey: ['rovers'],
queryFn: async () => (await api.get('/rovers')).data,
staleTime: 60 * 60 * 1000,
});
}