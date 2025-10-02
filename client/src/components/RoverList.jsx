import { NavLink, useLocation } from 'react-router-dom';
import { useRovers } from '../hooks/useRovers';

export default function RoverList({ active }) {
  const { data, isLoading, isError } = useRovers();
  const rovers = data?.rovers || [];
  const { search } = useLocation();

  if (isLoading) return <aside>Loading rovers…</aside>;
  if (isError) return <aside className="error">Failed to load rovers.</aside>;

  return (
    <nav aria-label="Rovers">
      <ul className="rover-list">
        {rovers.map((r) => {
          const isActive = active === r.name.toLowerCase();
          return (
            <li key={r.id} className={isActive ? 'active' : ''}>
              <NavLink to={`/${r.name.toLowerCase()}${search}`} className="rover-link">
                {r.name}
              </NavLink>
              <dl className="rover-meta">
                <div><dt>Launch</dt><dd>{r.launch_date}</dd></div>
                <div><dt>Landing</dt><dd>{r.landing_date}</dd></div>
                <div><dt>Status</dt><dd style={{ textTransform: 'capitalize' }}>{r.status}</dd></div>
                <div><dt>Total photos</dt><dd>{(r.total_photos ?? '').toLocaleString?.() || r.total_photos}</dd></div>
                <div><dt>Cameras</dt><dd>{(r.cameras || []).map(c => c.name).join(', ')}</dd></div>
              </dl>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}