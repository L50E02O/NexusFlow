import { Link } from 'react-router-dom';

import { heroMetrics, navigationItems } from '../shared/lib/site-data';

export function HomeHero() {
  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Ir al inicio de NexusFlow">
          <span className="brand-mark" aria-hidden="true">
            NF
          </span>
          <span>NexusFlow</span>
        </a>

        <nav className="top-nav" aria-label="Secciones principales">
          {navigationItems.map(item => (
            <a key={item.href} className="nav-link" href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div>
          <p className="eyebrow">Home de entrada y flujo operativo</p>
          <h1 className="hero-title" id="hero-title">
            Home primero, flujo Stitch después.
          </h1>
          <p className="hero-copy">
            La aplicación arranca en una portada clara, baja al flujo de pantallas Stitch y deja
            la base preparada para conectar datos reales sin perder la arquitectura por capas.
          </p>

          <div className="hero-actions">
            <Link className="button button-primary" to="/ui">
              Ver rutas UI
            </Link>
            <a className="button button-secondary" href="#datos">
              Ver datos
            </a>
          </div>

          <div className="hero-metrics" aria-label="Resumen de la base">
            {heroMetrics.map(metric => (
              <article className="metric" key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </article>
            ))}
          </div>
        </div>

        <aside className="hero-panel" aria-label="Resumen de adaptación">
          <span className="panel-kicker">Recorrido preparado</span>
          <div className="panel-list">
            <article className="panel-item">
              <strong>Home como puerta de entrada</strong>
              <p>
                Una portada limpia, accesible y pensada para llevar al usuario hacia la experiencia
                principal.
              </p>
            </article>
            <article className="panel-item">
              <strong>Flujo Stitch conectado</strong>
              <p>
                Las pantallas exportadas ahora se organizan como etapas del producto, no como una
                galería aislada.
              </p>
            </article>
            <article className="panel-item">
              <strong>Datos listos para enchufar</strong>
              <p>
                Supabase y los repositorios de entidades ya dejan el camino trazado para hacer la
                app funcional con datos reales.
              </p>
            </article>
          </div>
        </aside>
      </section>
    </>
  );
}