import { ctaItems, roadmapSteps } from '../shared/lib/site-data';

export function AdoptionRoadmap() {
  return (
    <section className="section" id="flujo" aria-labelledby="roadmap-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Flujo de adaptación</p>
          <h2 id="roadmap-title">Cómo mantener la plantilla sin perder tus avances.</h2>
        </div>
        <p>
          El objetivo no es copiar todo el template, sino conservar la intención y migrarla a una
          base que sí puedas mantener en este repo.
        </p>
      </div>

      <div className="roadmap-grid">
        {roadmapSteps.map(step => (
          <article className="roadmap-card" key={step.title}>
            <span>{step.title.split('.')[0]}</span>
            <h3>{step.title.slice(step.title.indexOf('.') + 2)}</h3>
            <p>{step.description}</p>
            <ul>
              {step.items.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="cta-band" id="ventajas">
        <div>
          <strong>Base lista para iterar sin rehacer el proyecto completo.</strong>
          <p>{ctaItems.join(' ')}</p>
        </div>
        <a className="button button-primary" href="#top">
          Volver arriba
        </a>
      </div>
    </section>
  );
}