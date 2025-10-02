import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';

export function useFavorites() {
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ['favorites'],
    queryFn: async ({ signal }) => (await api.get('/favorites', { signal })).data,
    staleTime: 10 * 1000,
    refetchOnWindowFocus: false,
  });

  const add = useMutation({
    mutationFn: async (photo) => {
      const payload = {
        id: photo.id,
        img_src: photo.img_src,
        earth_date: photo.earth_date,
        sol: photo.sol,
        rover: photo.rover?.name || photo.rover || '',
        camera: photo.camera?.name || photo.camera || '',
      };
      return (await api.post('/favorites', payload)).data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['favorites'] }),
  });

  const remove = useMutation({
    mutationFn: async (nasaId) => (await api.delete(`/favorites/${nasaId}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['favorites'] }),
  });

  return {
    ...list,
    add,
    remove,
  };
}
