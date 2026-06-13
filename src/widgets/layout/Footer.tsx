import { Link } from 'react-router-dom';
import { Icon } from '@/shared/ui/Icon';
import { useAccessibility } from '@/shared/context/AccessibilityContext';

const footerLinks = [
  { to: '/soporte', label: 'Centro de soporte y accesibilidad' },
  { to: '/configuracion', label: 'Privacidad' },
  { to: '#', label: 'Términos de uso' },
  { to: '#', label: 'Política de devoluciones' },
  { to: '#', label: 'Métodos de pago' },
];

// WCAG 2.2 — 3.2.6 ✓ Ayuda consistente en todas las páginas vía footer compartido
export function Footer() {
  const { openPanel } = useAccessibility();

  return (
    <footer className="bg-surface-container-low border-t border-outline-variant">
      <div className="max-w-container-max mx-auto px-lg py-xl flex flex-col md:flex-row justify-between items-start gap-xl">
        <div className="space-y-md max-w-sm">
          <span className="text-headline-md font-headline-md font-bold text-primary">NexusFlow</span>
          <p className="text-on-surface-variant font-body-md">
            La próxima generación de comercio de lujo personalizado, impulsado por inteligencia
            inteligente.
          </p>
          <div className="flex gap-md">
            <button
              type="button"
              aria-label="Visitar sitio web de NexusFlow"
              className="min-w-11 min-h-11 rounded-full border border-outline flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all focus-ring"
            >
              <Icon name="public" />
            </button>
            <button
              type="button"
              aria-label="Contactar por correo electrónico"
              className="min-w-11 min-h-11 rounded-full border border-outline flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all focus-ring"
            >
              <Icon name="alternate_email" />
            </button>
            <button
              type="button"
              aria-label="Compartir NexusFlow"
              className="min-w-11 min-h-11 rounded-full border border-outline flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all focus-ring"
            >
              <Icon name="share" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-xl w-full md:w-auto">
          <div className="space-y-sm">
            <p className="font-bold text-primary uppercase text-xs tracking-widest">Empresa</p>
            <ul className="space-y-xs">
              <li>
                <Link to="#" className="text-on-surface-variant hover:text-primary transition-all">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link to="/sostenibilidad" className="text-on-surface-variant hover:text-primary transition-all">
                  Sostenibilidad
                </Link>
              </li>
              <li>
                <Link to="#" className="text-on-surface-variant hover:text-primary transition-all">
                  Carreras
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-sm">
            <p className="font-bold text-primary uppercase text-xs tracking-widest">Soporte</p>
            <ul className="space-y-xs">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-on-surface-variant hover:text-primary transition-all">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-sm hidden md:block col-span-1">
            <p className="font-bold text-primary uppercase text-xs tracking-widest">Boletín</p>
            <div className="flex">
              <label htmlFor="newsletter-email" className="sr-only">
                Correo electrónico para el boletín
              </label>
              <input
                id="newsletter-email"
                type="email"
                autoComplete="email"
                placeholder="Correo electrónico"
                className="bg-surface border border-outline-variant rounded-l-lg px-md py-sm w-full focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                className="bg-primary text-on-primary px-md rounded-r-lg hover:opacity-90 focus-ring min-h-11"
              >
                Unirse al boletín
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-outline-variant">
        <div className="max-w-container-max mx-auto px-lg py-md flex flex-col md:flex-row justify-between items-center gap-md">
          <p className="font-label-md text-label-md text-on-surface-variant">
            © 2024 NexusFlow. Cifrado SSL seguro certificado.
          </p>
          <div className="flex items-center gap-md">
            <button
              type="button"
              onClick={openPanel}
              className="flex items-center gap-xs text-xs text-on-surface-variant hover:text-primary focus-ring min-h-11"
            >
              <Icon name="accessibility_new" className="text-lg" /> Menú de accesibilidad
            </button>
            <span className="w-px h-4 bg-outline-variant" aria-hidden="true" />
            <button type="button" className="flex items-center gap-xs text-xs text-on-surface-variant hover:text-primary focus-ring min-h-11">
              <Icon name="translate" className="text-lg" /> <span lang="es">Español (ES)</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
