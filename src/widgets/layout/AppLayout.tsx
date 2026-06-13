import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';
import { Footer } from './Footer';
import { AiChatWidget } from '@/components/chat/AiChatWidget';
import { AccessibilityPanel } from '@/components/accessibility/AccessibilityPanel';
import { SkipLink } from '@/shared/ui/SkipLink';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs';
type AppLayoutProps = {
  showFooter?: boolean;
  showFab?: boolean;
};

export function AppLayout({ showFooter = true, showFab = true }: AppLayoutProps) {
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
      {showFab && <AiChatWidget />}
    </div>
  );
}
