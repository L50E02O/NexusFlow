import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { SharedHeader } from './shared-header';

interface RouteAccessibilityContextValue {
  announce: (message: string) => void;
}

const RouteAccessibilityContext = createContext<RouteAccessibilityContextValue | null>(null);

export function useRouteAnnouncements() {
  const context = useContext(RouteAccessibilityContext);

  if (!context) {
    throw new Error('useRouteAnnouncements must be used within RouteAccessibilityShell');
  }

  return context;
}

function getRouteLabel() {
  const announced = document.querySelector<HTMLElement>('[data-route-announcement]')?.dataset.routeAnnouncement;

  if (announced) {
    return announced;
  }

  const focusTarget = document.querySelector<HTMLElement>('[data-route-focus]') ?? document.querySelector<HTMLElement>('main h1') ?? document.querySelector<HTMLElement>('main');

  return focusTarget?.textContent?.trim() || 'Nueva pantalla cargada';
}

function focusRouteTarget() {
  const focusTarget = document.querySelector<HTMLElement>('[data-route-focus]') ?? document.querySelector<HTMLElement>('main h1') ?? document.querySelector<HTMLElement>('main');

  focusTarget?.focus({ preventScroll: true });
}

interface RouteAccessibilityShellProps {
  children: ReactNode;
}

export function RouteAccessibilityShell({ children }: RouteAccessibilityShellProps) {
  const location = useLocation();
  const [announcement, setAnnouncement] = useState('');

  const announce = useCallback((message: string) => {
    setAnnouncement(message);
  }, []);

  const contextValue = useMemo(() => ({ announce }), [announce]);
  const isStitchShell = location.pathname === '/' || location.pathname.startsWith('/s/');

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      focusRouteTarget();
      announce(getRouteLabel());
    });

    return () => window.cancelAnimationFrame(frame);
  }, [announce, location.key]);

  return (
    <RouteAccessibilityContext.Provider value={contextValue}>
      <a className="skip-link" href="#main-content">
        Saltar al contenido principal
      </a>
      {isStitchShell ? null : <SharedHeader />}
      <div className="sr-only" aria-live="polite" aria-atomic="true" role="status">
        {announcement}
      </div>
      {children}
    </RouteAccessibilityContext.Provider>
  );
}