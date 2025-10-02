import { useEffect, useRef, useState } from 'react';
import { usePhotos } from '../hooks/usePhotos';
import PhotoCard from './PhotoCard';
import RateLimitBanner from './RateLimitBanner';

export default function PhotoGrid({ rover, state, onChange }) {
  const { data, isLoading, isFetching, error, refetch } = usePhotos({ rover, ...state });
  const photos = data?.photos || [];

  const [show429, setShow429] = useState(false);

  // Show banner when we hit rate limit; hide once we successfully fetch again
  useEffect(() => {
    const status = error?.response?.status;
    if (status === 429) setShow429(true);
    if (!isFetching && !error) setShow429(false);
  }, [error, isFetching]);

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
      {show429 && (
        <RateLimitBanner
          onRetry={() => refetch()}
          onDismiss={() => setShow429(false)}
        />
      )}

      {isLoading && state.page === 1 && <div>Loading photos…</div>}
      {error && error?.response?.status !== 429 && (
        <div className="error">Failed to load photos.</div>
      )}
      {photos.length === 0 && !isLoading && !isFetching && !error && (
        <div>No photos for this selection.</div>
      )}

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
