import { useEffect, useRef, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';

export default function Header() {
  const { data } = useFavorites();
  const count = Array.isArray(data) ? data.length : 0;

  // bump animation when count changes
  const [bump, setBump] = useState(false);
  const prev = useRef(count);

  useEffect(() => {
    if (prev.current === count) return;
    prev.current = count;
    setBump(true);
    const t = setTimeout(() => setBump(false), 400);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <header className="header">
      <Link to="/" className="brand">Mars Rover Explorer</Link>
      <nav className="nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          Explore
        </NavLink>
        <NavLink to="/favorites" className={({ isActive }) => isActive ? 'active fav-link' : 'fav-link'}>
          Favorites
          <span
            className={`badge ${bump ? 'bump' : ''}`}
            aria-label={`${count} favorites`}
            aria-live="polite"
          >
            {count}
          </span>
        </NavLink>
      </nav>
    </header>
  );
}
