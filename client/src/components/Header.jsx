import { Link, NavLink } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';

export default function Header() {
  const { data: favs = [] } = useFavorites();

  return (
    <header className="header">
      <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* KM logo */}
        <img
          src="/km-wave-icon1.svg"
          alt="KM logo"
          width={28}
          height={28}
          style={{ marginRight: 10 }}
        />
        <Link to="/" className="brand-title">
          Mars Rover Explorer
        </Link>
      </div>

      <nav className="nav" style={{ display: 'flex', gap: 16 }}>
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>
          Explore
        </NavLink>

        <NavLink to="/favorites" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          Favorites
          {favs.length ? (
            <span className="badge" aria-label={`${favs.length} favorites`}> {favs.length}</span>
          ) : null}
        </NavLink>
      </nav>
    </header>
  );
}
