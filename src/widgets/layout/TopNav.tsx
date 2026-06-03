import { Link, NavLink } from 'react-router-dom';
import { Icon } from '@/shared/ui/Icon';
import { useCart } from '@/shared/context/CartContext';
import { useAccessibility } from '@/shared/context/AccessibilityContext';
import { navLinks } from '@/shared/data/mock';

type TopNavProps = {
  showSearch?: boolean;
  searchPlaceholder?: string;
};

export function TopNav({
  showSearch = true,
  searchPlaceholder = "Búsqueda por IA: 'Atuendo de oficina para el verano'...",
}: TopNavProps) {
  const { itemCount: cartCount } = useCart();
  const { openPanel } = useAccessibility();

  return (
    <header className="bg-surface sticky top-0 z-50 shadow-sm">
      <nav className="flex justify-between items-center w-full px-lg max-w-container-max mx-auto py-sm gap-md">
        <div className="flex items-center gap-xl">
          <Link to="/" className="text-headline-md font-headline-md font-bold text-primary">
            NexusFlow
          </Link>
          <div className="hidden md:flex items-center gap-lg">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `font-body-md text-body-md transition-colors duration-200 ${
                    isActive
                      ? 'text-primary border-b-2 border-primary pb-1 font-bold'
                      : 'text-on-surface-variant hover:text-primary'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>

        {showSearch && (
          <div className="flex-1 max-w-md mx-xl hidden lg:block">
            <div className="relative group">
              <Icon
                name="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
              />
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="w-full h-12 pl-11 pr-24 bg-surface-container border border-outline-variant rounded-full text-body-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              />
              <div className="absolute inset-y-0 right-0 pr-sm flex items-center">
                <button
                  type="button"
                  aria-label="Búsqueda por voz"
                  className="p-xs text-primary hover:bg-surface-container-high rounded-full min-w-11 min-h-11 flex items-center justify-center focus-ring"
                >
                  <Icon name="mic" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-md">
          <button
            type="button"
            aria-label="Accesibilidad"
            onClick={openPanel}
            className="hidden sm:flex min-w-11 min-h-11 items-center justify-center text-on-surface-variant hover:text-primary focus-ring rounded-full"
          >
            <Icon name="accessibility_new" />
          </button>
          <Link
            to="/notificaciones"
            aria-label="Notificaciones"
            className="relative flex min-w-11 min-h-11 items-center justify-center text-on-surface-variant hover:text-primary focus-ring rounded-full"
          >
            <Icon name="notifications" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
          </Link>
          <button
            type="button"
            aria-label="Asistente"
            className="flex min-w-11 min-h-11 items-center justify-center text-on-surface-variant hover:text-primary focus-ring rounded-full"
          >
            <Icon name="smart_toy" />
          </button>
          <Link
            to="/carrito"
            aria-label="Carrito"
            className="relative flex min-w-11 min-h-11 items-center justify-center text-on-surface-variant hover:text-primary focus-ring rounded-full"
          >
            <Icon name="shopping_cart" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-error text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            to="/perfil"
            aria-label="Perfil"
            className="flex min-w-11 min-h-11 items-center justify-center text-on-surface-variant hover:text-primary focus-ring rounded-full"
          >
            <Icon name="account_circle" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
