import { useEffect, useRef } from 'react';
import { usePhotos } from '../hooks/usePhotos';
import PhotoCard from './PhotoCard';


export default function PhotoGrid({ rover, state, onChange }) {
const { data, isLoading, error } = usePhotos({ rover, ...state });
const photos = data?.photos || [];


const bottomRef = useRef(null);


// Basic infinite-scroll (optional). Keeps Load More as fallback.
useEffect(() => {
const el = bottomRef.current;
if (!el) return;
const io = new IntersectionObserver((entries) => {
if (entries[0].isIntersecting && photos.length >= 25) {
onChange({ page: state.page + 1 });
}
}, { threshold: 1 });
io.observe(el);
return () => io.disconnect();
}, [photos, state.page]);


return (
<section>
{isLoading && state.page === 1 && <div>Loading photos…</div>}
{error && <div className="error">Failed to load photos.</div>}
{photos.length === 0 && !isLoading && <div>No photos for this selection.</div>}


<div className="grid" role="list">
{photos.map((p) => (
<PhotoCard key={p.id} photo={p} />
))}
</div>


<div className="footer-actions">
<button
className="btn"
onClick={() => onChange({ page: state.page + 1 })}
aria-label="Load more photos"
>
Load More
</button>
<div ref={bottomRef} style={{ height: 1 }} />
</div>
</section>
);
}