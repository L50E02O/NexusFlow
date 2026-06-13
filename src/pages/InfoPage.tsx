import { Link } from 'react-router-dom';

type InfoSection = {
  title: string;
  paragraphs: string[];
};

type InfoPageProps = {
  title: string;
  subtitle?: string;
  sections: InfoSection[];
};

export function InfoPage({ title, subtitle, sections }: InfoPageProps) {
  return (
    <div className="max-w-container-max mx-auto px-lg py-xl">
      <header className="mb-xl max-w-3xl">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-md">{title}</h1>
        {subtitle && <p className="text-on-surface-variant font-body-md">{subtitle}</p>}
      </header>
      <div className="space-y-xl max-w-3xl">
        {sections.map((section) => (
          <section
            key={section.title}
            className="bg-surface-container-lowest rounded-xl p-xl shadow-sm border border-outline-variant/30"
          >
            <h2 className="font-headline-md text-headline-md text-primary mb-md">{section.title}</h2>
            <div className="space-y-md text-on-surface-variant font-body-md">
              {section.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
      <div className="mt-xl flex flex-wrap gap-md">
        <Link to="/soporte" className="text-primary font-label-md hover:underline focus-ring">
          Contactar soporte
        </Link>
        <Link to="/" className="text-on-surface-variant font-label-md hover:text-primary focus-ring">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
