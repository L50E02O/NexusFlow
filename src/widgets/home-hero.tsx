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
          <p className="eyebrow">Plantilla adaptada al proyecto actual</p>
          <h1 className="hero-title" id="hero-title">
            Ecommerce modular, limpio y listo para crecer.
          </h1>
          <p className="hero-copy">
            La base de la plantilla se trasladó a una estructura Vite real, con capas claras y
            una estética de alto contraste para priorizar legibilidad, jerarquía y foco visual.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#capas">
              Ver capas
            </a>
            <a className="button button-secondary" href="#flujo">
              Ver flujo
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
          <span className="panel-kicker">Adaptación segura</span>
          <div className="panel-list">
            <article className="panel-item">
              <strong>Lo que se conservó</strong>
              <p>
                La intención visual de la plantilla: negro, blanco, tipografía contundente y
                bloques amplios con aire.
              </p>
            </article>
            <article className="panel-item">
              <strong>Lo que se retiró</strong>
              <p>
                Dependencias y archivos ligados a Next que no pertenecen al runtime actual del
                proyecto.
              </p>
            </article>
            <article className="panel-item">
              <strong>Lo que queda listo</strong>
              <p>
                Una base visual modular sobre la que luego puedes conectar Supabase, catálogo y
                autenticación.
              </p>
            </article>
          </div>
        </aside>
      </section>
    </>
  );
}