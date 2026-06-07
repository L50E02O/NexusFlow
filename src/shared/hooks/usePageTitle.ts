import { useEffect } from 'react';

const SITE_NAME = 'NexusFlow';

// WCAG 2.2 — 2.4.2 ✓ Titulado único y descriptivo por ruta
export function usePageTitle(section: string) {
  useEffect(() => {
    document.title = `${section} — ${SITE_NAME}`;
    return () => {
      document.title = `${SITE_NAME} | Comercio adaptativo`;
    };
  }, [section]);
}
