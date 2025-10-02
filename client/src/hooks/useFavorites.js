// client/src/hooks/useFavorites.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';

function normalizeFav(photo) {
  return {
    nasa_id: photo.id,
    img_src: photo.img_src,
    earth_date: photo.earth_date ?? null,
    sol: photo.sol ?? null,
    rover: photo.rover?.name || photo.rover || '',
    camera: photo.camera?.name || photo.camera || '',
  };
}

export function useFavorites() {
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ['favorites'],
    queryFn: async ({ signal }) => (await api.get('/favorites', { signal })).data,
    staleTime: 60_000,
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
    onMutate: async (photo) => {
      await qc.cancelQueries({ queryKey: ['favorites'] });
      const prev = qc.getQueryData(['favorites']);
      const optimistic = normalizeFav(photo);

      qc.setQueryData(['favorites'], (old = []) => {
        if (old.some((f) => f.nasa_id === optimistic.nasa_id)) return old;
        return [...old, optimistic];
      });

      return { prev };
    },
    onError: (_err, _photo, ctx) => {
      if (ctx?.prev) qc.setQueryData(['favorites'], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const remove = useMutation({
    mutationFn: async (nasaId) => (await api.delete(`/favorites/${nasaId}`)).data,
    onMutate: async (nasaId) => {
      await qc.cancelQueries({ queryKey: ['favorites'] });
      const prev = qc.getQueryData(['favorites']);

      qc.setQueryData(['favorites'], (old = []) => old.filter((f) => f.nasa_id !== nasaId));

      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(['favorites'], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  return { ...list, add, remove };
}
