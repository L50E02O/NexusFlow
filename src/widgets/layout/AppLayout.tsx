import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';
import { Footer } from './Footer';
import { AiChatWidget } from '@/components/chat/AiChatWidget';
import { AccessibilityMenu } from '@/components/accessibility/AccessibilityMenu';
import { SkipLink } from '@/shared/ui/SkipLink';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs';
import { useShortcuts } from '@/shared/context/ShortcutsContext';

type AppLayoutProps = {
  showFooter?: boolean;
  showFab?: boolean;
};

export function AppLayout({ showFooter = true, showFab = true }: AppLayoutProps) {
  const { openShortcuts } = useShortcuts();
  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col antialiased">
      <SkipLink />
      <TopNav />
      <Breadcrumbs />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      {showFooter && <Footer />}
      <button
        type="button"
        onClick={openShortcuts}
        aria-label="Atajos de teclado"
        className="fixed bottom-28 right-6 z-40 flex min-h-12 min-w-12 items-center justify-center rounded-full bg-primary text-on-primary shadow-xl hover:opacity-90 focus-ring"
      >
        <span className="material-symbols-outlined">keyboard</span>
      </button>
      <AccessibilityMenu />
      {showFab && <AiChatWidget />}
    </div>
  );
}
