import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';
import { Footer } from './Footer';
import { Icon } from '@/shared/ui/Icon';
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
      {showFab && (
        <div className="fixed bottom-xl right-xl z-[60] flex flex-col items-end gap-md">
          <div className="bg-surface shadow-xl rounded-xl border border-outline-variant p-md max-w-[280px] hidden md:block">
            <p className="text-body-md text-primary font-medium">
              ¡Hola! Soy tu conserje de IA. ¿Buscas algo específico hoy?
            </p>
          </div>
          <button
            type="button"
            aria-label="Asistente IA"
            className="w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all focus-ring relative"
          >
            <Icon name="smart_toy" className="text-[32px]" filled />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full border-2 border-surface" />
          </button>
        </div>
      )}
    </div>
  );
}
