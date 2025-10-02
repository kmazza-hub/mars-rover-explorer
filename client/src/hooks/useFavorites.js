import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';


export function useFavorites() {
const qc = useQueryClient();
const list = useQuery({ queryKey: ['favorites'], queryFn: async () => (await api.get('/favorites')).data });


const add = useMutation({
mutationFn: async (photo) => (await api.post('/favorites', photo)).data,
onSuccess: () => qc.invalidateQueries({ queryKey: ['favorites'] }),
});


const remove = useMutation({
mutationFn: async (nasa_id) => (await api.delete(`/favorites/${nasa_id}`)).data,
onSuccess: () => qc.invalidateQueries({ queryKey: ['favorites'] }),
});


return { list, add, remove };
}