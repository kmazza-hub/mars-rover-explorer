import { useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import Header from './components/Header.jsx';
import RoverList from './components/RoverList.jsx';
import Controls from './components/Controls.jsx';
import PhotoGrid from './components/PhotoGrid.jsx';
import PhotoModal from './components/PhotoModal.jsx';
import FavoritesPage from './components/FavoritesPage.jsx';
import { useRovers } from './hooks/useRovers.js';

function Explorer() {
  const { roverName } = useParams();
  const [sp, setSp] = useSearchParams();
  const navigate = useNavigate();
  const { data: roversData, isLoading, isError } = useRovers();

  const rover = roverName || roversData?.rovers?.[0]?.name?.toLowerCase();

  // Redirect "/" -> "/{first-rover}"
  useEffect(() => {
    if (!roverName && rover) navigate(`/${rover}?${sp.toString()}`, { replace: true });
  }, [roverName, rover]);

  const roverMeta = useMemo(() => {
    return roversData?.rovers?.find((r) => r.name.toLowerCase() === rover);
  }, [roversData, rover]);

  // Defaults: type=earth, date=max_date, page=1
  useEffect(() => {
    if (!roverMeta) return;
    const next = new URLSearchParams(sp);
    if (!next.get('type')) next.set('type', 'earth');
    if (!next.get('page')) next.set('page', '1');
    if (!next.get('date')) next.set('date', roverMeta.max_date);
    // only update if we actually changed something (prevents re-renders)
    if (next.toString() !== sp.toString()) setSp(next, { replace: true });
  }, [roverMeta]);

  if (isError) {
    return (
      <div className="container">
        <Header />
        <main className="single"><div className="error">Failed to load rovers.</div></main>
      </div>
    );
  }

  if (isLoading || !rover || !roverMeta) {
    return (
      <div className="container">
        <Header />
        <main className="single"><div>Loading…</div></main>
      </div>
    );
  }

  const state = {
    rover,
    type: sp.get('type') || 'earth', // 'earth' | 'sol'
    date: sp.get('date') || roverMeta?.max_date,
    camera: sp.get('camera') || '',
    page: Number(sp.get('page') || 1),
  };

  const onChange = (patch) => {
    const next = new URLSearchParams(sp);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === '' || v == null) next.delete(k);
      else next.set(k, String(v));
    });
    if ('date' in patch || 'camera' in patch || 'type' in patch) next.set('page', '1');
    setSp(next);
  };

  return (
    <div className="container">
      <Header />
      <div className="layout">
        <aside>
          <RoverList active={rover} />
        </aside>
        <main>
          <Controls roverMeta={roverMeta} state={state} onChange={onChange} />
          <PhotoGrid rover={rover} state={state} onChange={onChange} />
        </main>
      </div>
      <PhotoModal />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Explorer />} />
      <Route
        path="/favorites"
        element={
          <div className="container">
            <Header />
            <main className="single">
              <FavoritesPage />
            </main>
          </div>
        }
      />
      <Route path="/:roverName" element={<Explorer />} />
    </Routes>
  );
}
