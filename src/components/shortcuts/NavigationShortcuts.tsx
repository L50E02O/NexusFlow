import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const routeShortcuts: Record<string, (navigate: ReturnType<typeof useNavigate>) => void> = {
  'Alt+1': (navigate) => navigate('/'),
  'Alt+2': (navigate) => navigate('/tienda'),
  'Alt+3': (navigate) => navigate('/categorias'),
  'Alt+4': (navigate) => navigate('/sostenibilidad'),
  'Alt+5': (navigate) => navigate('/soporte'),
  'Alt+H': (navigate) => navigate('/historial'),
  'Alt+0': (navigate) => navigate('/carrito'),
  'Alt+U': (navigate) => navigate('/perfil'),
};

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select' ||
    target.isContentEditable
  );
}

export function NavigationShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (isEditableTarget(event.target)) return;

      const key = event.key.toUpperCase();
      const combo = `Alt+${key}`;
      if (routeShortcuts[combo]) {
        event.preventDefault();
        routeShortcuts[combo](navigate);
      } else if (combo === 'Alt+B') {
        event.preventDefault();
        navigate(-1);
      } else if (combo === 'Alt+S') {
        event.preventDefault();
        const searchInput = document.getElementById('main-search') as HTMLInputElement | null;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [navigate]);

  return null;
}
