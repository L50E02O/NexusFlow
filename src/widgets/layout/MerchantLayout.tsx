import { NavLink, Outlet, Link } from 'react-router-dom';
import { Icon } from '@/shared/ui/Icon';
import { merchantNav } from '@/shared/data/merchantMock';
import { AccessibilityPanel } from '@/components/accessibility/AccessibilityPanel';
import { useAccessibility } from '@/shared/context/AccessibilityContext';

export function MerchantLayout() {
  const { openPanel } = useAccessibility();

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <aside className="fixed left-0 top-0 h-full w-[280px] hidden lg:flex flex-col z-50 bg-primary shadow-xl">
        <div className="p-lg flex items-center gap-md">
          <div className="w-10 h-10 bg-on-primary rounded-lg flex items-center justify-center">
            <Icon name="storefront" className="text-primary" />
          </div>
          <div>
            <h1 className="text-headline-md font-headline-md text-on-primary">Portal del Comerciante</h1>
            <p className="text-label-md text-primary-fixed-dim opacity-80">Nivel Empresarial</p>
          </div>
        </div>
        <nav className="flex-1 mt-md px-sm overflow-y-auto">
          {merchantNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={'end' in item && item.end}
              className={({ isActive }) =>
                `flex items-center gap-md px-md py-sm mx-sm my-xs rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-secondary-fixed-dim text-on-secondary-fixed'
                    : 'text-primary-fixed-dim hover:text-on-primary hover:bg-on-primary-fixed-variant/30'
                }`
              }
            >
              <Icon name={item.icon} />
              <span className="font-label-md text-label-md">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto px-sm pb-lg border-t border-on-primary-fixed-variant/20 pt-md">
          <Link
            to="/"
            className="text-primary-fixed-dim hover:text-on-primary px-md py-sm flex items-center gap-md mx-sm rounded-lg transition-all"
          >
            <Icon name="storefront" />
            <span className="font-label-md text-label-md">Tienda pública</span>
          </Link>
          <button
            type="button"
            className="w-full mt-md bg-on-primary text-primary font-button py-sm rounded-xl flex items-center justify-center gap-sm shadow-lg hover:bg-surface transition-colors"
          >
            <Icon name="add" />
            Añadir Producto
          </button>
        </div>
      </aside>

      <header className="fixed top-0 right-0 left-0 lg:left-[280px] z-40 flex items-center justify-between px-lg h-16 bg-surface shadow-sm border-b border-outline-variant">
        <div className="flex items-center gap-md flex-1">
          <Link to="/merchant" className="lg:hidden font-headline-md font-bold text-primary">
            NexusFlow
          </Link>
          <div className="hidden md:flex relative ml-0 lg:ml-0 flex-1 max-w-md">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input
              type="search"
              placeholder="Buscar analíticas o productos..."
              className="pl-10 pr-md py-2 bg-surface-container rounded-full border-none focus:ring-2 focus:ring-primary w-full text-sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-md">
          <button
            type="button"
            aria-label="Accesibilidad"
            onClick={openPanel}
            className="p-sm rounded-full hover:bg-surface-container-highest transition-colors focus-ring"
          >
            <Icon name="accessibility_new" />
          </button>
          <button
            type="button"
            aria-label="Notificaciones"
            className="p-sm rounded-full hover:bg-surface-container-highest relative"
          >
            <Icon name="notifications" className="text-on-surface-variant" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error border-2 border-surface rounded-full" />
          </button>
          <img
            alt="Perfil comerciante"
            className="w-8 h-8 rounded-full border-2 border-surface-container-high"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6sgxKPrHA3TDu3E35iN48U1t-h91lOMm68ojtkZK41ZUS_Rv_bWZE_cfcGssXzL1tBykUOO6yVFmGht6Yt9yF8H6DEFuCkl_oOQs_SuJstfju1QAks7SkS4P7yXd2EDAE6FY_WX-vq3jzEB8PwTGT4nuJFq20XRMmNmhciy81UTUcI4nuSoLhdz908xXuT9v0l2DZ8itmeAWgqvjUtW8CqRqvnX13jxN6sjdVx2dUoBuvVXwGwNpVcZk99Zjp_it6MASSEKWBw7c"
          />
        </div>
      </header>

      <main className="pt-16 lg:ml-[280px] min-h-screen">
        <Outlet />
      </main>

      <AccessibilityPanel />

      <button
        type="button"
        onClick={openPanel}
        aria-label="Accesibilidad"
        className="fixed bottom-8 left-8 z-[55] flex items-center justify-center w-14 h-14 rounded-full bg-primary text-on-primary shadow-lg hover:scale-110 transition-all focus-ring lg:left-[300px]"
      >
        <Icon name="accessibility_new" className="text-[28px]" />
      </button>
    </div>
  );
}
