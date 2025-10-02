import { NavLink, Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';

export default function Header() {
  const { data } = useFavorites();
  const count = Array.isArray(data) ? data.length : 0;

  return (
    <header className="header">
      <Link to="/" className="brand">Mars Rover Explorer</Link>
      <nav className="nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Explore</NavLink>
        <NavLink to="/favorites" className={({ isActive }) => isActive ? 'active fav-link' : 'fav-link'}>
          Favorites
          <span className="badge" aria-label={`${count} favorites`}>{count}</span>
        </NavLink>
      </nav>
    </header>
  );
}
