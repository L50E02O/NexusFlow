import { Link } from 'react-router-dom';
import { Icon } from '@/shared/ui/Icon';

const footerLinks = [
  { to: '/soporte', label: 'Accesibilidad' },
  { to: '/configuracion', label: 'Privacidad' },
  { to: '#', label: 'Términos' },
  { to: '#', label: 'Devoluciones' },
  { to: '#', label: 'Métodos de Pago' },
];

export function Footer() {
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
              className="w-10 h-10 rounded-full border border-outline flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all focus-ring"
            >
              <Icon name="public" />
            </button>
            <button
              type="button"
              className="w-10 h-10 rounded-full border border-outline flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all focus-ring"
            >
              <Icon name="alternate_email" />
            </button>
            <button
              type="button"
              className="w-10 h-10 rounded-full border border-outline flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all focus-ring"
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
                  Sobre Nosotros
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
              <input
                type="email"
                placeholder="Correo electrónico"
                className="bg-surface border border-outline-variant rounded-l-lg px-md py-sm w-full focus:ring-1 focus:ring-primary outline-none"
              />
              <button
                type="button"
                className="bg-primary text-on-primary px-md rounded-r-lg hover:opacity-90 focus-ring"
              >
                Unirse
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
            <button type="button" className="flex items-center gap-xs text-xs text-on-surface-variant hover:text-primary focus-ring">
              <Icon name="text_fields" className="text-lg" /> Tamaño de fuente
            </button>
            <span className="w-px h-4 bg-outline-variant" />
            <button type="button" className="flex items-center gap-xs text-xs text-on-surface-variant hover:text-primary focus-ring">
              <Icon name="translate" className="text-lg" /> Español (ES)
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
