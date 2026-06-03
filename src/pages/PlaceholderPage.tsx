import { Link } from 'react-router-dom';

type PlaceholderPageProps = {
  title: string;
  description?: string;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <main className="max-w-container-max mx-auto px-lg py-xxl text-center">
      <h1 className="font-headline-lg text-headline-lg text-primary mb-md">{title}</h1>
      <p className="text-on-surface-variant font-body-md mb-xl max-w-lg mx-auto">
        {description ?? 'Esta sección está en desarrollo. Explora el catálogo y el inicio mientras añadimos más funcionalidad.'}
      </p>
      <div className="flex flex-wrap justify-center gap-md">
        <Link to="/" className="bg-primary text-on-primary px-lg py-md rounded-xl font-button hover:opacity-90">
          Ir al inicio
        </Link>
        <Link to="/tienda" className="border-2 border-primary text-primary px-lg py-md rounded-xl font-button hover:bg-primary/5">
          Ver tienda
        </Link>
      </div>
    </main>
  );
}
