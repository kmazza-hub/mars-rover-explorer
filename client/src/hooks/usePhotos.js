import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';


export function usePhotos({ rover, type, date, camera, page }) {
return useQuery({
queryKey: ['photos', rover, type, date, camera, page],
queryFn: async () => {
const params = new URLSearchParams();
params.set('rover', rover);
if (type === 'earth') params.set('earth_date', date);
else params.set('sol', date);
if (camera) params.set('camera', camera);
if (page) params.set('page', String(page));
return (await api.get(`/photos?${params.toString()}`)).data;
},
keepPreviousData: true,
});
}