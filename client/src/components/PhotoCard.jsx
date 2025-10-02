// client/src/components/PhotoCard.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';

export default function PhotoCard({ photo }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Defensive: hook fields can be undefined briefly
  const fav = useFavorites() || {};
  const favorites = fav.data || [];
  const isFav = !!favorites?.some((f) => f.nasa_id === photo.id);

  const openModal = () => {
    // Put the photo id into the URL and pass the photo via state
    const sp = new URLSearchParams(location.search);
    sp.set('photo', String(photo.id));
    navigate(
      { pathname: location.pathname, search: sp.toString() },
      { state: { photo } }
    );
  };

  const toggleFav = (e) => {
    e.stopPropagation();
    if (isFav) {
      fav.remove?.mutate?.(photo.id);
    } else {
      fav.add?.mutate?.(photo);
    }
  };

  const roverName = photo?.rover?.name || '';
  const cameraName = photo?.camera?.name || photo?.camera || '';
  const when = photo?.earth_date
    ? `Earth: ${photo.earth_date}`
    : (photo?.sol != null ? `Sol: ${photo.sol}` : '');

  return (
    <article
      className="card"
      role="listitem"
      aria-label={`Photo ${photo?.id || ''}`}
      onClick={openModal}
      style={{ cursor: 'pointer' }}
    >
      <div className="thumb-wrap">
        <img
          src={photo?.img_src}
          alt={`${roverName} ${cameraName ? '• ' + cameraName : ''}${when ? ' • ' + when : ''}`.trim()}
          loading="lazy"
        />
        <button
          className={`fav-btn ${isFav ? 'active' : ''}`}
          aria-pressed={isFav}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          title={isFav ? 'Remove favorite' : 'Add favorite'}
          onClick={toggleFav}
        >
          ★
        </button>
      </div>
      <div className="meta">
        <div className="title">
          {roverName} {cameraName ? `• ${cameraName}` : ''}
        </div>
        <div className="sub">{when}</div>
      </div>
    </article>
  );
}
