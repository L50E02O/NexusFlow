import { Link } from 'react-router-dom';
import { Icon } from '@/shared/ui/Icon';
import { useCategorias } from '@/shared/hooks/useCategorias';

export function CategoriesPage() {
  const { categories, loading, error } = useCategorias();

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto px-lg py-xl text-center text-on-surface-variant">
        Cargando categorías...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-container-max mx-auto px-lg py-xl text-center text-error">
        No se pudieron cargar las categorías.
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-lg py-xl">
      <header className="mb-xl">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-md">Categorías</h1>
        <p className="text-on-surface-variant font-body-md max-w-2xl">
          Explora nuestro catálogo organizado por categorías. Selecciona una para ver productos
          relacionados en la tienda.
        </p>
      </header>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-lg">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={cat.id === 'mas' ? '/tienda' : `/tienda?cat=${cat.id}`}
            className="group text-center space-y-md focus-ring rounded-xl"
          >
            <div className="aspect-square bg-surface-container flex items-center justify-center rounded-xl transition-all group-hover:bg-primary-container group-hover:text-on-primary-fixed shadow-sm">
              <Icon
                name={cat.icon}
                className="text-[40px] sm:text-[48px] transition-transform group-hover:scale-110"
              />
            </div>
            <p className="font-label-md text-label-md text-on-surface">{cat.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
