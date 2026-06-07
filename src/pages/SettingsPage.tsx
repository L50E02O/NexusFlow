import { useState } from 'react';
import { Icon } from '@/shared/ui/Icon';
import { userProfile } from '@/shared/data/mock';
import { useWcagCriterios } from '@/shared/hooks/useWcagCriterios';
import { DataStatus } from '@/shared/ui/DataStatus';
import type { WcagEstado } from '@/shared/types/database/wcag-criterios';

const estadoLabels: Record<WcagEstado, { label: string; className: string }> = {
  P: { label: 'Pendiente', className: 'bg-error-container text-error' },
  C: { label: 'Cumplido', className: 'bg-secondary-container text-on-secondary-container' },
  En: { label: 'En progreso', className: 'bg-tertiary-fixed text-on-tertiary-fixed' },
};

const settingsNav = [
  { id: 'cuenta', label: 'Cuenta', icon: 'manage_accounts' },
  { id: 'privacidad', label: 'Privacidad', icon: 'security' },
  { id: 'notificaciones', label: 'Notificaciones', icon: 'notifications' },
  { id: 'preferencias', label: 'Preferencias', icon: 'settings_suggest' },
  { id: 'accesibilidad', label: 'Accesibilidad', icon: 'accessible' },
] as const;

type SettingsSection = (typeof settingsNav)[number]['id'];

export function SettingsPage() {
  const [active, setActive] = useState<SettingsSection>('cuenta');
  const [darkMode, setDarkMode] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifPromo, setNotifPromo] = useState(false);
  const [notifOrders, setNotifOrders] = useState(true);
  const { groupedByPrincipio, loading: wcagLoading, error: wcagError } = useWcagCriterios();

  const scrollTo = (id: SettingsSection) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="pb-xxl max-w-container-max mx-auto px-gutter w-full py-xl">
      <div className="flex flex-col md:flex-row gap-lg">
        <aside className="md:w-64 shrink-0">
          <div className="sticky top-24 bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant/30">
            <h2 className="font-label-md text-outline mb-md uppercase tracking-wider px-sm">Ajustes</h2>
            <nav className="flex flex-col gap-xs">
              {settingsNav.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className={`flex items-center gap-sm px-sm py-md rounded-lg font-button transition-all text-left ${
                    active === item.id
                      ? 'bg-primary-container text-on-primary'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <Icon name={item.icon} filled={active === item.id} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <div className="flex-grow space-y-lg">
          <section className="bg-surface-container-lowest rounded-xl p-xl shadow-md border border-outline-variant/20 flex flex-col md:flex-row items-center gap-lg">
            <img
              src={userProfile.avatar}
              alt=""
              className="w-24 h-24 rounded-full object-cover border-4 border-secondary-container"
            />
            <div className="text-center md:text-left">
              <h1 className="font-headline-md text-headline-md text-primary">Configuración de NexusFlow</h1>
              <p className="text-on-surface-variant">Gestiona tu identidad, seguridad y experiencia en el ecosistema.</p>
            </div>
          </section>

          <section id="cuenta" className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/20 overflow-hidden scroll-mt-28">
            <div className="p-lg border-b border-outline-variant/20 bg-surface-container-low/50">
              <h2 className="font-headline-md text-headline-md flex items-center gap-sm">
                <Icon name="person" />
                Gestión de Cuenta
              </h2>
            </div>
            <div className="p-lg space-y-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <Field label="Nombre Completo" value={name} onChange={setName} />
                <Field label="Correo Electrónico" value={email} onChange={setEmail} type="email" />
              </div>
              <div className="flex flex-wrap gap-md">
                <button type="button" className="bg-primary text-on-primary px-lg py-md rounded-xl font-button min-h-11 hover:shadow-lg">
                  Guardar cambios
                </button>
                <button type="button" className="border-2 border-primary text-primary px-lg py-md rounded-xl font-button min-h-11 hover:bg-primary/5">
                  Cambiar contraseña
                </button>
              </div>
            </div>
          </section>

          <section id="privacidad" className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/20 scroll-mt-28">
            <div className="p-lg border-b border-outline-variant/20 bg-surface-container-low/50">
              <h2 className="font-headline-md text-headline-md flex items-center gap-sm">
                <Icon name="security" />
                Privacidad y Datos
              </h2>
            </div>
            <div className="p-lg space-y-md">
              {[
                { title: 'Permisos de datos', desc: 'Controla qué datos compartes con nosotros.', icon: 'data_usage' },
                { title: 'Historial de actividad', desc: 'Revisa tus últimas acciones en la plataforma.', icon: 'history' },
                { title: 'Visibilidad del perfil', desc: 'Elige quién puede ver tu actividad pública.', icon: 'visibility' },
              ].map((row) => (
                <button
                  key={row.title}
                  type="button"
                  className="w-full flex items-center justify-between p-md border border-outline-variant/20 rounded-xl hover:bg-surface-container transition-all text-left"
                >
                  <div className="flex items-center gap-md">
                    <span className="material-symbols-outlined text-primary bg-secondary-container p-sm rounded-full">
                      {row.icon}
                    </span>
                    <div>
                      <h4 className="font-bold">{row.title}</h4>
                      <p className="text-on-surface-variant text-label-md">{row.desc}</p>
                    </div>
                  </div>
                  <Icon name="chevron_right" className="text-outline" />
                </button>
              ))}
            </div>
          </section>

          <section id="notificaciones" className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/20 scroll-mt-28">
            <div className="p-lg border-b border-outline-variant/20 bg-surface-container-low/50">
              <h2 className="font-headline-md text-headline-md flex items-center gap-sm">
                <Icon name="notifications_active" />
                Centro de Notificaciones
              </h2>
            </div>
            <div className="p-lg divide-y divide-outline-variant/20">
              <NotifToggle title="Correos electrónicos" desc="Resúmenes semanales y novedades." on={notifEmail} onChange={setNotifEmail} />
              <NotifToggle title="Alertas Push" desc="Notificaciones directas en tu navegador o móvil." on={notifPush} onChange={setNotifPush} />
              <NotifToggle title="Mensajes promocionales" desc="Ofertas exclusivas y cupones de descuento." on={notifPromo} onChange={setNotifPromo} />
              <NotifToggle title="Actualizaciones de pedidos" desc="Estado de tus compras en tiempo real." on={notifOrders} onChange={setNotifOrders} />
            </div>
          </section>

          <section id="preferencias" className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/20 scroll-mt-28">
            <div className="p-lg border-b border-outline-variant/20 bg-surface-container-low/50">
              <h2 className="font-headline-md text-headline-md flex items-center gap-sm">
                <Icon name="settings_suggest" />
                Preferencias de Visualización
              </h2>
            </div>
            <div className="p-lg space-y-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div>
                  <label className="font-label-md text-on-surface-variant">Idioma</label>
                  <select className="w-full h-12 px-md rounded-xl border-2 border-outline-variant/50 mt-xs bg-white">
                    <option>Español</option>
                    <option>Inglés</option>
                  </select>
                </div>
                <div>
                  <label className="font-label-md text-on-surface-variant">Moneda</label>
                  <select className="w-full h-12 px-md rounded-xl border-2 border-outline-variant/50 mt-xs bg-white">
                    <option>MXN - Peso Mexicano</option>
                    <option>USD - Dólar Estadounidense</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-between p-md bg-primary-container text-on-primary rounded-xl">
                <div className="flex items-center gap-md">
                  <Icon name="dark_mode" />
                  <div>
                    <h4 className="font-bold">Modo Oscuro</h4>
                    <p className="text-on-primary-container text-label-md">Activa una interfaz más descansada para tus ojos.</p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={darkMode}
                  onClick={() => {
                    setDarkMode(!darkMode);
                    document.documentElement.classList.toggle('dark', !darkMode);
                  }}
                  className={`w-14 h-7 rounded-full relative ${darkMode ? 'bg-secondary-container' : 'bg-white/20'}`}
                >
                  <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-all ${darkMode ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </section>

          <section id="accesibilidad" className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/20 scroll-mt-28">
            <div className="p-lg border-b border-outline-variant/20 bg-surface-container-low/50">
              <h2 className="font-headline-md text-headline-md flex items-center gap-sm">
                <Icon name="accessible" />
                Accesibilidad
              </h2>
            </div>
            <div className="p-lg space-y-xl">
              <div>
                <div className="flex justify-between items-center mb-sm">
                  <label className="font-bold">Tamaño de texto</label>
                  <span className="text-primary font-bold">16px (Normal)</span>
                </div>
                <input type="range" min={12} max={24} defaultValue={16} className="w-full accent-primary" />
              </div>
              <label className="flex items-center justify-between p-md border border-outline-variant/20 rounded-xl cursor-pointer">
                <div>
                  <h4 className="font-bold">Navegación Teclado</h4>
                  <p className="text-on-surface-variant text-label-md">Optimiza focos visuales.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-6 h-6 rounded-md text-primary" />
              </label>

              <div className="space-y-lg pt-md border-t border-outline-variant/20">
                <h3 className="font-headline-md text-headline-md text-primary">Checklist WCAG 2.2 (A + AA)</h3>
                <DataStatus
                  loading={wcagLoading}
                  error={wcagError}
                  isEmpty={Object.keys(groupedByPrincipio).length === 0}
                  emptyMessage="No hay criterios WCAG disponibles."
                >
                  <div className="space-y-xl">
                    {Object.entries(groupedByPrincipio).map(([principio, criterios]) => (
                      <div key={principio} className="space-y-md">
                        <h4 className="font-label-md text-primary uppercase tracking-wider border-b border-outline-variant/20 pb-sm">
                          {principio}
                        </h4>
                        <div className="space-y-sm">
                          {criterios.map((item) => {
                            const estado = estadoLabels[item.estado as WcagEstado] ?? estadoLabels.P;
                            return (
                              <article
                                key={item.id}
                                className="p-md border border-outline-variant/20 rounded-xl space-y-xs"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-sm">
                                  <div className="flex items-center gap-sm">
                                    <span className="font-bold text-primary">{item.criterio}</span>
                                    <span className="font-label-md">{item.nombre}</span>
                                    <span className="text-[10px] font-bold uppercase px-sm py-xs rounded-full bg-surface-container-high text-on-surface-variant">
                                      Nivel {item.nivel}
                                    </span>
                                  </div>
                                  <span className={`text-[10px] font-bold uppercase px-sm py-xs rounded-full ${estado.className}`}>
                                    {estado.label}
                                  </span>
                                </div>
                                <p className="text-on-surface-variant text-label-md">
                                  <strong>Qué verificar:</strong> {item.que_verificar}
                                </p>
                                <p className="text-on-surface-variant text-label-md">
                                  <strong>Cómo implementarlo:</strong> {item.como_implementarlo}
                                </p>
                              </article>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </DataStatus>
              </div>
            </div>
          </section>

          <section className="bg-error-container/10 border-2 border-dashed border-error/30 rounded-xl p-lg">
            <h2 className="font-headline-md text-error flex items-center gap-sm mb-md">
              <Icon name="warning" />
              Zona de Peligro
            </h2>
            <div className="flex flex-col md:flex-row justify-between items-center gap-md">
              <p className="text-on-surface-variant">
                Eliminar tu cuenta borrará todos tus datos de forma permanente. Esta acción no se puede deshacer.
              </p>
              <button type="button" className="bg-error text-on-error px-lg py-md rounded-xl font-button min-h-11 whitespace-nowrap hover:bg-error/90">
                Eliminar mi cuenta
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-xs">
      <label className="font-label-md text-on-surface-variant">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 px-md rounded-xl border-2 border-outline-variant/50 focus:border-primary transition-all outline-none"
      />
    </div>
  );
}

function NotifToggle({
  title,
  desc,
  on,
  onChange,
}: {
  title: string;
  desc: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="py-md flex justify-between items-center first:pt-0">
      <div>
        <h4 className="font-bold">{title}</h4>
        <p className="text-on-surface-variant text-label-md">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => onChange(!on)}
        className={`w-11 h-6 rounded-full relative shrink-0 ${on ? 'bg-primary' : 'bg-outline-variant'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${on ? 'right-0.5' : 'left-0.5'}`} />
      </button>
    </div>
  );
}
