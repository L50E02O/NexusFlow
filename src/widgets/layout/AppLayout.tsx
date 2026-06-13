import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';
import { Footer } from './Footer';
import { Icon } from '@/shared/ui/Icon';
import { AiChatWidget } from '@/components/chat/AiChatWidget';
import { AccessibilityPanel } from '@/components/accessibility/AccessibilityPanel';
import { useAccessibility } from '@/shared/context/AccessibilityContext';
import { SkipLink } from '@/shared/ui/SkipLink';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs';
type AppLayoutProps = {
  showFooter?: boolean;
  showFab?: boolean;
};

export function AppLayout({ showFooter = true, showFab = true }: AppLayoutProps) {
  const { openPanel } = useAccessibility();

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col antialiased">
      <SkipLink />
      <TopNav />
      <Breadcrumbs />
      {/* WCAG 2.2 — 1.3.1 ✓ Landmark semántico main con id para skip link */}
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      {showFooter && <Footer />}
      <AccessibilityPanel />
      <button
        type="button"
        onClick={openPanel}
        aria-label="Abrir menú de accesibilidad"
        className="fixed bottom-8 left-8 z-[55] flex items-center justify-center min-w-14 min-h-14 w-14 h-14 rounded-full bg-primary text-on-primary shadow-lg hover:scale-110 active:scale-95 transition-all focus-ring"
      >
        <span className="text-[1.75rem]" aria-hidden="true">
          ♿
        </span>
      </button>
      {showFab && <AiChatWidget />}
    </div>
  );
}
