import { Link } from 'react-router-dom';
import { Icon } from '@/shared/ui/Icon';

const pillars = [
  {
    icon: 'eco',
    title: 'Materiales responsables',
    desc: 'Priorizamos proveedores con certificaciones ambientales y trazabilidad de materias primas.',
  },
  {
    icon: 'recycling',
    title: 'Economía circular',
    desc: 'Programas de reacondicionamiento y reciclaje para extender la vida útil de los productos.',
  },
  {
    icon: 'local_shipping',
    title: 'Logística eficiente',
    desc: 'Rutas optimizadas y empaques reciclables para reducir la huella de carbono en cada envío.',
  },
  {
    icon: 'volunteer_activism',
    title: 'Impacto social',
    desc: 'Colaboramos con iniciativas locales que promueven el comercio justo y el desarrollo comunitario.',
  },
];

export function SustainabilityPage() {
  return (
    <div className="mx-auto max-w-container-max space-y-xxl px-lg py-xl">
      <section className="relative flex min-h-[220px] items-center overflow-hidden rounded-xl bg-primary-container sm:min-h-[300px]">
        <div className="relative z-10 max-w-2xl p-xl text-on-primary-container">
          <h1 className="mb-md font-headline-lg text-headline-lg leading-tight">
            Compromiso con la sostenibilidad
          </h1>
          <p className="font-body-md leading-relaxed opacity-90">
            En NexusFlow integramos criterios ambientales y sociales en cada etapa de la experiencia
            de compra, sin comprometer la calidad ni el diseño.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-lg sm:grid-cols-2">
        {pillars.map((item) => (
          <article
            key={item.title}
            className="flex gap-lg rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-xl shadow-sm"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary-container">
              <Icon name={item.icon} className="text-primary" />
            </div>
            <div className="min-w-0">
              <h2 className="mb-sm font-headline-md leading-snug text-primary">{item.title}</h2>
              <p className="font-body-md leading-relaxed text-on-surface-variant">{item.desc}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-xl bg-surface-container-low px-md py-xl text-center sm:px-xl">
        <p className="mx-auto mb-lg max-w-2xl text-balance font-body-md leading-relaxed text-on-surface-variant">
          ¿Quieres saber más sobre nuestras prácticas? Consulta nuestras políticas o contacta al
          equipo de soporte.
        </p>
        <div className="mx-auto flex max-w-lg flex-col items-stretch justify-center gap-md sm:flex-row sm:items-center">
          <Link
            to="/privacidad"
            className="font-label-md text-primary hover:underline focus-ring"
          >
            Ver políticas
          </Link>
          <Link
            to="/soporte"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-lg py-md font-button text-on-primary hover:opacity-90 focus-ring"
          >
            Centro de soporte
          </Link>
          <Link
            to="/tienda"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border-2 border-primary px-lg py-md font-button text-primary hover:bg-primary/5 focus-ring"
          >
            Explorar productos sostenibles
          </Link>
        </div>
      </section>
    </div>
  );
}
