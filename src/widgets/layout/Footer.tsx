import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/shared/ui/Icon';
import { useI18n } from '@/shared/i18n/I18nContext';

const footerLinks = [
  { to: '/soporte', label: 'Centro de soporte y accesibilidad' },
  { to: '/privacidad', label: 'Privacidad' },
  { to: '/terminos', label: 'Términos de uso' },
  { to: '/politicas-devoluciones', label: 'Política de devoluciones' },
  { to: '/metodos-pago', label: 'Métodos de pago' },
];

const companyLinks = [
  { to: '/sobre-nosotros', label: 'Sobre nosotros' },
  { to: '/sostenibilidad', label: 'Sostenibilidad' },
  { to: '/carreras', label: 'Carreras' },
];

// WCAG 2.2 — 3.2.6 ✓ Ayuda consistente en todas las páginas vía footer compartido
export function Footer() {
  const { locale, setLocale } = useI18n();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState<string | null>(null);

  const handleNewsletter = (e: FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterMsg('¡Gracias! Te hemos suscrito al boletín de NexusFlow.');
    setNewsletterEmail('');
    setTimeout(() => setNewsletterMsg(null), 4000);
  };

  const toggleLocale = () => {
    setLocale(locale === 'es' ? 'en' : 'es');
  };

  return (
    <footer className="border-t border-outline-variant bg-surface-container-low">
      <div className="mx-auto max-w-container-max px-lg py-xl">
        <div className="grid grid-cols-1 gap-xl sm:grid-cols-2 xl:grid-cols-12 xl:gap-12">
          <div className="space-y-md sm:col-span-2 xl:col-span-4">
            <span className="text-headline-md font-headline-md font-bold text-primary">NexusFlow</span>
            <p className="max-w-sm text-on-surface-variant font-body-md leading-relaxed">
              La próxima generación de comercio de lujo personalizado, impulsado por inteligencia
              inteligente.
            </p>
            <div className="flex flex-wrap gap-md">
              <a
                href="https://nexusflow.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visitar sitio web de NexusFlow"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-outline text-primary transition-all hover:bg-primary hover:text-on-primary focus-ring"
              >
                <Icon name="public" />
              </a>
              <a
                href="mailto:soporte@nexusflow.com"
                aria-label="Contactar por correo electrónico"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-outline text-primary transition-all hover:bg-primary hover:text-on-primary focus-ring"
              >
                <Icon name="alternate_email" />
              </a>
              <button
                type="button"
                aria-label="Compartir NexusFlow"
                onClick={() => {
                  if (navigator.share) {
                    void navigator.share({
                      title: 'NexusFlow',
                      text: 'Descubre NexusFlow — comercio de lujo personalizado',
                      url: window.location.origin,
                    });
                  }
                }}
                className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-outline text-primary transition-all hover:bg-primary hover:text-on-primary focus-ring"
              >
                <Icon name="share" />
              </button>
            </div>
          </div>

          <div className="min-w-0 space-y-sm xl:col-span-2">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Empresa</p>
            <ul className="space-y-sm">
              {companyLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="block break-words py-0.5 text-on-surface-variant leading-snug transition-all hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 space-y-sm xl:col-span-3">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Soporte</p>
            <ul className="space-y-sm">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="block break-words py-0.5 text-on-surface-variant leading-snug transition-all hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 space-y-sm sm:col-span-2 xl:col-span-3">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Boletín</p>
            <form onSubmit={handleNewsletter} className="flex flex-col gap-sm sm:flex-row sm:items-stretch">
              <label htmlFor="newsletter-email" className="sr-only">
                Correo electrónico para el boletín
              </label>
              <input
                id="newsletter-email"
                type="email"
                autoComplete="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Correo electrónico"
                className="min-h-11 min-w-0 flex-1 rounded-lg border border-outline-variant bg-surface px-md py-sm focus:ring-1 focus:ring-primary sm:rounded-r-none"
              />
              <button
                type="submit"
                className="min-h-11 shrink-0 rounded-lg bg-primary px-md text-on-primary hover:opacity-90 focus-ring sm:rounded-l-none sm:whitespace-nowrap"
              >
                Unirse al boletín
              </button>
            </form>
            {newsletterMsg && (
              <p className="text-label-md text-secondary" role="status">
                {newsletterMsg}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-outline-variant">
        <div className="mx-auto flex max-w-container-max flex-col items-center justify-between gap-md px-lg py-md md:flex-row">
          <p className="text-center font-label-md text-label-md text-on-surface-variant md:text-left">
            © 2026 NexusFlow. Cifrado SSL seguro certificado.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-md">
            <button
              type="button"
              onClick={toggleLocale}
              aria-label={`Cambiar idioma. Actual: ${locale === 'es' ? 'Español' : 'Inglés'}`}
              className="flex min-h-11 items-center gap-xs text-xs text-on-surface-variant hover:text-primary focus-ring"
            >
              <Icon name="translate" className="text-lg" />
              <span lang={locale}>{locale === 'es' ? 'Español (ES)' : 'Inglés (EN)'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
