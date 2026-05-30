import { FormEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export function SharedHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [value, setValue] = useState(params.get('q') ?? '');

  useEffect(() => {
    setValue(new URLSearchParams(location.search).get('q') ?? '');
  }, [location.search]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next = new URLSearchParams(location.search);
    if (value.trim()) next.set('q', value.trim());
    else next.delete('q');

    const search = next.toString();
    const nextSearch = search ? `?${search}` : '';

    // Preserve domain if present only when already on /ui; otherwise navigate to home with q
    if (location.pathname.startsWith('/ui')) {
      navigate(`${location.pathname}${nextSearch}`);
    } else {
      navigate(`/${nextSearch}${location.hash || ''}`);
    }
  }

  return (
    <header className="shared-header" role="banner">
      <div className="shared-header-inner page">
        <div className="brand-row">
          <Link className="brand" to="/" aria-label="Ir al inicio de NexusFlow">
            <span className="brand-mark" aria-hidden="true">NF</span>
            <span>NexusFlow</span>
          </Link>

          <nav className="main-nav" aria-label="Navegación principal">
            <Link className="nav-link" to="/">Inicio</Link>
            <Link className="nav-link" to="/comercio">Comercio</Link>
            <Link className="nav-link" to="/ui">Hub UI</Link>
          </nav>
        </div>

        <form className="shared-search" onSubmit={handleSubmit} role="search">
          <label className="sr-only" htmlFor="global-search">Buscar productos y UIs</label>
          <input
            id="global-search"
            className="shared-search-input"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Buscar productos o vistas Stitch"
            aria-label="Buscar productos o vistas Stitch"
          />
          <button className="button button-primary" type="submit">Buscar</button>
        </form>
      </div>
    </header>
  );
}

export default SharedHeader;
