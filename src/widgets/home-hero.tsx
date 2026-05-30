import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { stitchRepository } from '../entities/stitch/api/stitch.repository';
import { heroMetrics, navigationItems } from '../shared/lib/site-data';
import { stitchDomains } from '../shared/lib/stitch-domains';

export function HomeHero() {
  const featuredScreens = stitchRepository.listScreens().slice(0, 3);

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-copy-panel">
        <p className="eyebrow">Landing de comercio y navegación Stitch</p>
        <h1 className="hero-title" id="hero-title" tabIndex={-1} data-route-focus>
          Comprá, explorá y bajá a cada UI Stitch sin perder el hilo.
        </h1>
        <p className="hero-copy">
          NexusFlow arranca como una portada tipo marketplace, con catálogo, accesos rápidos y las vistas Stitch
          ya conectadas para que el producto se recorra como una experiencia real.
        </p>

        <div className="market-categories" aria-label="Categorías destacadas">
          {stitchDomains.map(domain => (
            <Link key={domain.anchor} className="market-chip" to={`/ui/domain/${domain.anchor}`}>
              {domain.title}
            </Link>
          ))}
        </div>

        <div className="hero-actions">
          <Link className="button button-primary" to="/ui">
            Abrir hub UI
          </Link>
          <a className="button button-secondary" href="#ui">
            Ver UIs Stitch
          </a>
          <a className="button button-secondary" href="#datos">
            Ver preparación de datos
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

      <aside className="hero-panel" aria-label="Vistas destacadas de Stitch">
        <span className="panel-kicker">Vistas listas para usar</span>
        <div className="panel-list">
          {featuredScreens.map(screen => (
            <article className="panel-item hero-screen-item" key={screen.screenId}>
              <div className="hero-screen-topline">
                <strong>{screen.title}</strong>
                <span>{stitchRepository.getStage(screen.screenId)?.title ?? 'Vista independiente'}</span>
              </div>
              <p>{screen.summary}</p>
              <Link className="button button-secondary" to={`/ui/${screen.screenId}`}>
                Abrir vista
              </Link>
            </article>
          ))}
        </div>
      </aside>
    </section>
  );
}