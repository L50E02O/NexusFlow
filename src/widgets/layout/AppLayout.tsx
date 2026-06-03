import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';
import { Footer } from './Footer';
import { Icon } from '@/shared/ui/Icon';
import { AiChatWidget } from '@/components/chat/AiChatWidget';
import { AccessibilityPanel } from '@/components/accessibility/AccessibilityPanel';
import { useAccessibility } from '@/shared/context/AccessibilityContext';

type AppLayoutProps = {
  showFooter?: boolean;
  showFab?: boolean;
};

export function AppLayout({ showFooter = true, showFab = true }: AppLayoutProps) {
  const { openPanel } = useAccessibility();

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col antialiased">
      <TopNav />
      <main className="flex-1">
        <Outlet />
      </main>
      {showFooter && <Footer />}
      <AccessibilityPanel />
      <button
        type="button"
        onClick={openPanel}
        aria-label="Opciones de accesibilidad"
        className="fixed bottom-8 left-8 z-[55] flex items-center justify-center w-14 h-14 rounded-full bg-primary text-on-primary shadow-lg hover:scale-110 active:scale-95 transition-all focus-ring"
      >
        <Icon name="accessibility_new" className="text-[28px]" />
      </button>
      {showFab && <AiChatWidget />}
    </div>
  );
}
