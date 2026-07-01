import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Icon } from '@/shared/ui/Icon';
import { merchantNav } from '@/shared/data/merchantMock';

type MerchantSidebarProps = {
  variant: 'desktop' | 'mobile';
  onNavigate?: () => void;
};

const navLinkClass = (isActive: boolean, variant: 'desktop' | 'mobile') => {
  if (variant === 'desktop') {
    return `flex items-center gap-md px-md py-sm mx-sm my-xs rounded-lg transition-all duration-200 min-h-11 w-[calc(100%-1rem)] ${
      isActive
        ? 'bg-secondary-fixed-dim text-on-secondary-fixed'
        : 'text-primary-fixed-dim hover:text-on-primary hover:bg-on-primary-fixed-variant/30'
    }`;
  }
  return `flex items-center gap-md px-md py-sm rounded-lg min-h-11 font-label-md w-full ${
    isActive
      ? 'bg-primary-container text-on-primary font-bold'
      : 'text-on-surface-variant hover:bg-surface-container'
  }`;
};

export function MerchantSidebar({ variant, onNavigate }: MerchantSidebarProps) {
  const navigate = useNavigate();
  const isDesktop = variant === 'desktop';

  const goToProducts = () => {
    navigate('/merchant/productos');
    onNavigate?.();
  };

  if (isDesktop) {
    return (
      <aside
        aria-label="Navegación del portal comerciante"
        className="fixed left-0 top-0 z-50 hidden h-screen w-[280px] flex-col bg-primary shadow-xl lg:flex"
      >
        <div className="flex h-[88px] shrink-0 items-center gap-md border-b border-on-primary-fixed-variant/20 px-lg py-md">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-on-primary">
            <Icon name="storefront" className="text-primary" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-headline-md text-headline-md text-on-primary leading-tight">
              Portal del Comerciante
            </p>
            <p className="truncate text-label-md text-primary-fixed-dim opacity-80">Nivel Empresarial</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-sm py-md">
          {merchantNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={'end' in item && item.end}
              className={({ isActive }) => navLinkClass(isActive, 'desktop')}
            >
              <Icon name={item.icon} className="shrink-0 text-[22px]" />
              <span className="truncate font-label-md text-label-md">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="shrink-0 border-t border-on-primary-fixed-variant/20 px-sm pb-lg pt-md">
          <Link
            to="/"
            className="mx-sm flex min-h-11 items-center gap-md rounded-lg px-md py-sm text-primary-fixed-dim transition-all hover:text-on-primary"
          >
            <Icon name="storefront" className="shrink-0" />
            <span className="truncate font-label-md text-label-md">Tienda pública</span>
          </Link>
          <button
            type="button"
            onClick={goToProducts}
            className="mt-md flex min-h-11 w-full items-center justify-center gap-sm rounded-xl bg-on-primary py-sm font-button text-primary shadow-lg transition-colors hover:bg-surface"
          >
            <Icon name="add" />
            Añadir Producto
          </button>
        </div>
      </aside>
    );
  }

  return (
    <nav
      aria-label="Navegación móvil del comerciante"
      className="flex flex-col gap-xs px-lg py-md"
    >
      {merchantNav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={'end' in item && item.end}
          onClick={onNavigate}
          className={({ isActive }) => navLinkClass(isActive, 'mobile')}
        >
          <Icon name={item.icon} className="shrink-0 text-[22px]" />
          <span className="truncate">{item.label}</span>
        </NavLink>
      ))}
      <Link
        to="/"
        onClick={onNavigate}
        className="flex min-h-11 w-full items-center gap-md rounded-lg px-md py-sm text-on-surface-variant hover:bg-surface-container"
      >
        <Icon name="storefront" className="shrink-0" />
        <span className="truncate">Tienda pública</span>
      </Link>
      <button
        type="button"
        onClick={goToProducts}
        className="mt-sm flex min-h-11 w-full items-center justify-center gap-sm rounded-xl bg-primary py-sm font-button text-on-primary"
      >
        <Icon name="add" />
        Añadir Producto
      </button>
    </nav>
  );
}
