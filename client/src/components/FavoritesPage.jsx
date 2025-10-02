// client/src/components/FavoritesPage.jsx
import { useMemo } from 'react';
import { useFavorites } from '../hooks/useFavorites';

export default function FavoritesPage() {
  const { data, isLoading, isError, remove } = useFavorites();
  const favorites = useMemo(() => data || [], [data]);

  if (isLoading) return <div>Loading favorites…</div>;
  if (isError) return <div className="error">Failed to load favorites.</div>;

  if (!favorites.length) {
    return (
      <section>
        <h2 className="page-title">Favorites</h2>
        <p>No favorites yet. Click ★ on any photo to save it here.</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="page-title">Favorites</h2>

      <div className="grid" role="list">
        {favorites.map((f) => (
          <article
            key={f.nasa_id}
            className="card"
            role="listitem"
            aria-label={`Favorite photo ${f.nasa_id}`}
          >
            <div className="thumb-wrap">
              <img
                src={f.img_src}
                alt={`${f.rover} ${f.camera || ''} on ${f.earth_date || `sol ${f.sol}`}`.trim()}
                loading="lazy"
              />
              <button
                className="fav-btn active"
                aria-label="Remove from favorites"
                onClick={() => remove.mutate(f.nasa_id)}
                title="Remove favorite"
              >
                ★
              </button>
            </div>
            <div className="meta">
              <div className="title">
                {f.rover} {f.camera ? `• ${f.camera}` : ''}
              </div>
              <div className="sub">
                {f.earth_date ? `Earth: ${f.earth_date}` : `Sol: ${f.sol}`}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
