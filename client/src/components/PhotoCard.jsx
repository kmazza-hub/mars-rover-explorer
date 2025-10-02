import { useFavorites } from '../hooks/useFavorites';


// Simple pub-sub for modal via CustomEvent (avoids global state) for brevity
function openModal(photo) {
window.dispatchEvent(new CustomEvent('open-photo-modal', { detail: photo }));
}


export default function PhotoCard({ photo }) {
const { add, list, remove } = useFavorites();
const isFav = list.data?.some((f) => f.nasa_id === photo.id);


const toggleFav = () => {
if (isFav) remove.mutate(photo.id);
else add.mutate({
id: photo.id,
img_src: photo.img_src,
earth_date: photo.earth_date,
sol: photo.sol,
rover: photo.rover?.name,
camera: photo.camera?.name,
});
};


return (
<article className="card" role="listitem">
<button className="img-wrap" onClick={() => openModal(photo)} aria-label="Open photo details">
<img src={photo.img_src} alt={`Rover ${photo.rover?.name} ${photo.camera?.full_name || photo.camera?.name} on ${photo.earth_date || 'sol ' + photo.sol}`} loading="lazy" />
</button>
<div className="card-meta">
<div>
<strong>{photo.rover?.name}</strong> • {photo.camera?.name} • {photo.earth_date || `Sol ${photo.sol}`}
</div>
<button className={`fav ${isFav ? 'on' : ''}`} onClick={toggleFav} aria-pressed={isFav} aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}>
{isFav ? '★' : '☆'}
</button>
</div>
</article>
);
}