import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@/shared/ui/Icon';
import { useCart } from '@/shared/context/CartContext';
import { useAccessibility } from '@/shared/context/AccessibilityContext';
import { useChat } from '@/shared/context/ChatContext';
import { useAuth } from '@/shared/context/AuthContext';
import { useI18n } from '@/shared/i18n/I18nContext';
import { navLinks } from '@/shared/data/mock';
import { useFocusTrap } from '@/shared/hooks/useFocusTrap';

type TopNavProps = {
  showSearch?: boolean;
  searchPlaceholder?: string;
};

const accountLinks = [
  { to: '/perfil', label: 'Mi perfil', icon: 'account_circle' },
  { to: '/favoritos', label: 'Favoritos', icon: 'favorite' },
  { to: '/historial', label: 'Historial', icon: 'history' },
  { to: '/cupones', label: 'Cupones', icon: 'local_offer' },
  { to: '/facturas', label: 'Facturas', icon: 'receipt_long' },
  { to: '/configuracion', label: 'Configuración', icon: 'settings' },
] as const;

const extraNavLinks = [
  { to: '/ofertas', label: 'Ofertas' },
  { to: '/mensajeria', label: 'Mensajería' },
] as const;

// WCAG 2.2 — 3.2.3 ✓ Navegación coherente compartida en todas las páginas
export function TopNav({
  showSearch = true,
  searchPlaceholder = 'Búsqueda por IA: escribe tu consulta y pulsa Enter',
}: TopNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount: cartCount } = useCart();
  const { openPanel } = useAccessibility();
  const { open: openChat } = useChat();
  const { session, signOut } = useAuth();
  const { locale } = useI18n();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useFocusTrap(mobileNavRef, mobileNavOpen, () => setMobileNavOpen(false));
  useFocusTrap(accountRef, accountOpen, () => setAccountOpen(false));

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') ?? '';
    if (location.pathname === '/tienda') {
      setSearchQuery(q);
    }
  }, [location.pathname, location.search]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/tienda?q=${encodeURIComponent(q)}`);
    } else {
      navigate('/tienda');
    }
    setMobileNavOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setAccountOpen(false);
    navigate('/');
  };

  const navItemClass = (isActive: boolean) =>
    `flex min-h-11 items-center whitespace-nowrap font-body-md text-body-md transition-colors duration-200 ${
      isActive
        ? 'border-b-2 border-primary pb-1 font-bold text-primary'
        : 'text-on-surface-variant hover:text-primary'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant/40 bg-surface shadow-sm">
      <div className="mx-auto h-16 max-w-container-max px-lg">
        <nav
          aria-label="Navegación principal"
          className="grid h-full grid-cols-[auto_1fr_auto] items-center gap-md lg:gap-lg"
        >
          <div className="flex min-w-0 items-center gap-sm md:gap-md">
            <button
              type="button"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-on-surface-variant hover:text-primary focus-ring md:hidden"
              aria-label={mobileNavOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((o) => !o)}
            >
              <Icon name={mobileNavOpen ? 'close' : 'menu'} />
            </button>
            <Link to="/" className="truncate font-headline-md font-bold text-primary">
              NexusFlow
            </Link>
            <div className="hidden items-center gap-lg md:flex">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} className={({ isActive }) => navItemClass(isActive)}>
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          {showSearch ? (
            <form onSubmit={handleSearch} className="hidden min-w-0 justify-center px-md lg:flex">
              <div className="relative w-full max-w-md">
                <label htmlFor="main-search" className="sr-only">
                  Buscar productos y categorías
                </label>
                <Icon
                  name="search"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                />
                <input
                  id="main-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-11 w-full rounded-full border border-outline-variant bg-surface-container pl-11 pr-[3.75rem] text-body-md transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                  <span className="mx-1 h-6 w-px bg-outline-variant" aria-hidden="true" />
                  <button
                    type="button"
                    aria-label="Búsqueda por voz — abre el asistente de IA"
                    onClick={() => openChat()}
                    className="flex min-h-9 min-w-9 items-center justify-center rounded-full text-primary hover:bg-surface-container-high focus-ring"
                  >
                    <Icon name="mic" />
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div aria-hidden="true" className="hidden lg:block" />
          )}

          <div className="flex shrink-0 items-center justify-end gap-xs sm:gap-sm">
            <button
              type="button"
              aria-label="Abrir menú de accesibilidad"
              onClick={openPanel}
              className="hidden min-h-11 min-w-11 items-center justify-center rounded-full text-on-surface-variant hover:text-primary focus-ring sm:flex"
            >
              <Icon name="accessibility_new" />
            </button>
            <Link
              to="/notificaciones"
              aria-label="Notificaciones"
              className="relative flex min-h-11 min-w-11 items-center justify-center rounded-full text-on-surface-variant hover:text-primary focus-ring"
            >
              <Icon name="notifications" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error" aria-hidden="true" />
            </Link>
            <button
              type="button"
              aria-label="Abrir asistente de IA"
              onClick={() => openChat()}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-on-surface-variant hover:text-primary focus-ring"
            >
              <Icon name="smart_toy" />
            </button>
            <Link
              to="/carrito"
              aria-label={`Carrito de compras${cartCount > 0 ? `, ${cartCount} artículos` : ''}`}
              className="relative flex min-h-11 min-w-11 items-center justify-center rounded-full text-on-surface-variant hover:text-primary focus-ring"
            >
              <Icon name="shopping_cart" />
              {cartCount > 0 && (
                <span
                  className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-label-md font-bold text-white"
                  aria-hidden="true"
                >
                  {cartCount}
                </span>
              )}
            </Link>
            <div className="relative">
              <button
                type="button"
                aria-label="Menú de cuenta"
                aria-expanded={accountOpen}
                aria-haspopup="true"
                onClick={() => setAccountOpen((o) => !o)}
                className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-on-surface-variant hover:text-primary focus-ring"
              >
                <Icon name="account_circle" />
              </button>
              {accountOpen && (
                <div
                  ref={accountRef}
                  role="menu"
                  aria-label="Opciones de cuenta"
                  className="absolute right-0 top-full z-50 mt-xs max-h-[min(24rem,calc(100vh-6rem))] w-56 overflow-y-auto rounded-xl border border-outline-variant bg-surface py-sm shadow-xl"
                >
                  {session ? (
                    <>
                      {accountLinks.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          role="menuitem"
                          onClick={() => setAccountOpen(false)}
                          className="flex min-h-11 items-center gap-sm px-md py-sm text-body-md text-on-surface-variant hover:bg-surface-container hover:text-primary"
                        >
                          <Icon name={link.icon} className="shrink-0 text-lg" />
                          {link.label}
                        </Link>
                      ))}
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleSignOut}
                        className="flex min-h-11 w-full items-center gap-sm px-md py-sm text-left text-body-md text-error hover:bg-error-container/20"
                      >
                        <Icon name="logout" className="shrink-0 text-lg" />
                        Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      role="menuitem"
                      onClick={() => setAccountOpen(false)}
                      className="flex min-h-11 items-center gap-sm px-md py-sm text-body-md text-primary hover:bg-surface-container"
                    >
                      <Icon name="login" className="shrink-0 text-lg" />
                      Iniciar sesión
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>

      {mobileNavOpen && (
        <div
          ref={mobileNavRef}
          className="border-t border-outline-variant bg-surface px-lg py-md md:hidden"
          role="dialog"
          aria-label="Menú de navegación móvil"
        >
          <form onSubmit={handleSearch} className="mb-md">
            <label htmlFor="mobile-search" className="sr-only">
              Buscar productos
            </label>
            <div className="relative">
              <Icon
                name="search"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline"
              />
              <input
                id="mobile-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar en la tienda..."
                className="h-11 w-full rounded-full border border-outline-variant bg-surface-container pl-11 pr-md text-body-md"
              />
            </div>
          </form>
          <ul className="flex flex-col gap-xs">
            {[...navLinks, ...extraNavLinks].map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={() => setMobileNavOpen(false)}
                  className={({ isActive }) =>
                    `flex min-h-11 items-center rounded-lg px-md py-sm font-body-md ${
                      isActive
                        ? 'bg-primary-container font-bold text-on-primary'
                        : 'text-on-surface-variant hover:bg-surface-container'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              openPanel();
              setMobileNavOpen(false);
            }}
            className="mt-md flex min-h-11 w-full items-center gap-sm px-md py-sm text-on-surface-variant hover:text-primary"
          >
            <Icon name="accessibility_new" />
            Accesibilidad
          </button>
          <p className="px-md pt-sm text-label-md text-on-surface-variant" lang={locale}>
            Idioma: {locale === 'es' ? 'Español' : 'Inglés'}
          </p>
        </div>
      )}
    </header>
  );
}
