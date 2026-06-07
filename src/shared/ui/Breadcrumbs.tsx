import { Link, useLocation } from 'react-router-dom';

const routeLabels: Record<string, string> = {
  '': 'Inicio',
  tienda: 'Tienda',
  categorias: 'Categorías',
  sostenibilidad: 'Sostenibilidad',
  soporte: 'Soporte',
  mensajeria: 'Mensajería',
  cupones: 'Cupones',
  notificaciones: 'Notificaciones',
  ofertas: 'Ofertas',
  carrito: 'Carrito',
  favoritos: 'Favoritos',
  perfil: 'Perfil',
  configuracion: 'Configuración',
  checkout: 'Checkout',
  historial: 'Historial de compras',
  'recuperar-carrito': 'Recuperar carrito',
  facturas: 'Facturas',
  login: 'Iniciar sesión',
  merchant: 'Portal comerciante',
};

// WCAG 2.2 — 2.4.5 ✓ Segunda vía de navegación (migas de pan)
export function Breadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, i) => {
    const path = '/' + segments.slice(0, i + 1).join('/');
    const label = routeLabels[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1);
    return { path, label, isLast: i === segments.length - 1 };
  });

  return (
    <nav aria-label="Migas de pan" className="max-w-container-max mx-auto px-lg pt-md">
      <ol className="flex flex-wrap items-center gap-xs text-label-md text-on-surface-variant">
        <li>
          <Link to="/" className="hover:text-primary focus-ring rounded-sm">
            Inicio
          </Link>
        </li>
        {crumbs.map((crumb) => (
          <li key={crumb.path} className="flex items-center gap-xs">
            <span aria-hidden="true">/</span>
            {crumb.isLast ? (
              <span aria-current="page" className="text-primary font-semibold">
                {crumb.label}
              </span>
            ) : (
              <Link to={crumb.path} className="hover:text-primary focus-ring rounded-sm">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
