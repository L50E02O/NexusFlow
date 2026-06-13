import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Icon } from '@/shared/ui/Icon';
import { MerchantSidebar } from './MerchantSidebar';
import { AccessibilityPanel } from '@/components/accessibility/AccessibilityPanel';
import { useAccessibility } from '@/shared/context/AccessibilityContext';
import { SkipLink } from '@/shared/ui/SkipLink';

export function MerchantLayout() {
  const { openPanel } = useAccessibility();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface">
      <SkipLink />
      <MerchantSidebar variant="desktop" />

      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-outline-variant bg-surface px-lg shadow-sm lg:left-[280px]">
        <div className="flex min-w-0 flex-1 items-center gap-md">
          <button
            type="button"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-on-surface-variant hover:text-primary focus-ring lg:hidden"
            aria-label={mobileNavOpen ? 'Cerrar menú' : 'Abrir menú del portal'}
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen((o) => !o)}
          >
            <Icon name={mobileNavOpen ? 'close' : 'menu'} />
          </button>
          <Link to="/merchant" className="truncate font-headline-md font-bold text-primary lg:hidden">
            NexusFlow
          </Link>
          <div className="relative ml-0 hidden max-w-md flex-1 md:flex">
            <label htmlFor="merchant-search" className="sr-only">
              Buscar analíticas o productos
            </label>
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input
              id="merchant-search"
              type="search"
              placeholder="Buscar analíticas o productos..."
              className="h-10 w-full rounded-full border-none bg-surface-container py-2 pl-10 pr-md text-sm focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-sm sm:gap-md">
          <button
            type="button"
            aria-label="Abrir menú de accesibilidad"
            onClick={openPanel}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full transition-colors hover:bg-surface-container-highest focus-ring"
          >
            <Icon name="accessibility_new" />
          </button>
          <button
            type="button"
            aria-label="Notificaciones"
            className="relative flex min-h-11 min-w-11 items-center justify-center rounded-full hover:bg-surface-container-highest"
          >
            <Icon name="notifications" className="text-on-surface-variant" />
            <span
              className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-surface bg-error"
              aria-hidden="true"
            />
          </button>
          <img
            alt="Foto de perfil del comerciante"
            className="h-8 w-8 shrink-0 rounded-full border-2 border-surface-container-high"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6sgxKPrHA3TDu3E35iN48U1t-h91lOMm68ojtkZK41ZUS_Rv_bWZE_cfcGssXzL1tBykUOO6yVFmGht6Yt9yF8H6DEFuCkl_oOQs_SuJstfju1QAks7SkS4P7yXd2EDAE6FY_WX-vq3jzEB8PwTGT4nuJFq20XRMmNmhciy81UTUcI4nuSoLhdz908xXuT9v0l2DZ8itmeAWgqvjUtW8CqRqvnX13jxN6sjdVx2dUoBuvVXwGwNpVcZk99Zjp_it6MASSEKWBw7c"
          />
        </div>
      </header>

      {mobileNavOpen && (
        <div className="fixed left-0 right-0 top-16 z-30 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-outline-variant bg-surface shadow-md lg:hidden">
          <MerchantSidebar variant="mobile" onNavigate={() => setMobileNavOpen(false)} />
        </div>
      )}

      <main id="main-content" className="min-h-screen pt-16 lg:ml-[280px]" tabIndex={-1}>
        <Outlet />
      </main>

      <AccessibilityPanel />
    </div>
  );
}
