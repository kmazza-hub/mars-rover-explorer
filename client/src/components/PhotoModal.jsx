// client/src/components/PhotoModal.jsx
import { createPortal } from 'react-dom';
import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useFavorites } from '../hooks/useFavorites';

export default function PhotoModal() {
  // Always call hooks in the same order
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const qc = useQueryClient();
  const { data: favs = [] } = useFavorites();

  const idParam = sp.get('photo');
  const id = idParam ? Number(idParam) : null;

  const selected = useMemo(() => {
    if (!id) return null;

    // 1) from navigation state (PhotoCard passes it)
    const st = location.state;
    if (st?.photo && Number(st.photo?.id) === id) return st.photo;

    // 2) from any cached photos queries
    const results = qc.getQueriesData({ queryKey: ['photos'] });
    for (const [, payload] of results) {
      const arr = payload?.photos || [];
      const found = arr.find((p) => p.id === id);
      if (found) return found;
    }

    // 3) fallback to favorites
    const f = favs.find((x) => x.nasa_id === id);
    if (f) {
      return {
        id: f.nasa_id,
        img_src: f.img_src,
        earth_date: f.earth_date,
        sol: f.sol,
        rover: { name: f.rover },
        camera: { name: f.camera },
      };
    }

    return null;
  }, [id, location.state, qc, favs]);

  const close = () => {
    const next = new URLSearchParams(location.search);
    next.delete('photo');
    navigate(
      { pathname: location.pathname, search: next.toString() },
      { replace: true, state: {} }
    );
  };

  // Close on Escape while open
  useEffect(() => {
    if (!id) return;
    const onKey = (e) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [id]);

  // Lock background scroll while modal is open
  useEffect(() => {
    if (!id) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [id]);

  // If no ?photo= in the URL, don't render
  if (!id) return null;

  const body = (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Photo details"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="modal">
        <button className="modal-close" onClick={close} aria-label="Close">×</button>

        {!selected ? (
          <div style={{ padding: 20 }}>Loading photo…</div>
        ) : (
          <>
            <div className="modal-scroll">
              <img
                src={selected.img_src}
                alt={`Large view of ${selected?.rover?.name || ''} ${selected?.camera?.name || ''} ${selected?.earth_date || (selected?.sol != null ? `sol ${selected.sol}` : '')}`.trim()}
              />
            </div>

            <div className="modal-meta">
              <div><strong>Rover:</strong> {selected?.rover?.name}</div>
              <div><strong>Camera:</strong> {selected?.camera?.name || selected?.camera}</div>
              <div><strong>Date:</strong> {selected?.earth_date ? `Earth ${selected.earth_date}` : `Sol ${selected?.sol}`}</div>
              <div><strong>ID:</strong> {selected?.id}</div>
            </div>

            <div className="modal-actions">
              <a className="btn" href={selected.img_src} target="_blank" rel="noopener noreferrer">
                Open full size
              </a>
              <button className="btn" onClick={close} aria-label="Close">Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(body, document.body);
}
