import { layerCards } from '../shared/lib/site-data';

export function LayerStack() {
  return (
    <section className="section" id="capas" aria-labelledby="layer-stack-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Arquitectura por capas</p>
          <h2 id="layer-stack-title">Cada nivel con una responsabilidad clara.</h2>
        </div>
        <p>
          Esta versión deja la plantilla organizada para que la UI, el dominio y las utilidades no
          se mezclen en un solo bloque difícil de mantener.
        </p>
      </div>

      <div className="layer-grid">
        {layerCards.map((layer, index) => (
          <article className="layer-card" key={layer.name}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{layer.name}</h3>
            <p>
              <strong>{layer.title}.</strong> {layer.description}
            </p>

            <ul className="layer-tags" aria-label={`Funciones de ${layer.name}`}>
              {layer.tags.map(tag => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}