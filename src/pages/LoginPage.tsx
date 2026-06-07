import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@/shared/ui/Icon';
import { AccessibilityPanel } from '@/components/accessibility/AccessibilityPanel';
import { useAccessibility } from '@/shared/context/AccessibilityContext';
import { useAuth } from '@/shared/context/AuthContext';

const adaptiveProfiles = [
  { icon: 'smartphone', title: 'Comprador Joven Digital', desc: 'Rápida, fluida y optimizada para dispositivos móviles.' },
  { icon: 'work', title: 'Adulto Profesional', desc: 'Organizada, eficiente y centrada en la productividad.' },
  { icon: 'monitoring', title: 'Portal Comerciante', desc: 'Inteligente, potente y con analíticas en tiempo real.' },
];

const registerProfiles = [
  { id: 'young', icon: 'bolt', title: 'Comprador Joven', desc: 'Experiencia rápida y móvil' },
  { id: 'pro', icon: 'verified_user', title: 'Adulto Profesional', desc: 'Organizada y segura' },
  { id: 'merchant', icon: 'storefront', title: 'Comerciante', desc: 'Inventario e IA' },
] as const;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openPanel } = useAccessibility();
  const { signIn, session } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<string>('young');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/';

  useEffect(() => {
    if (session) {
      navigate(redirectTo, { replace: true });
    }
  }, [session, navigate, redirectTo]);

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col md:flex-row min-h-screen">
        <section className="hidden md:flex md:w-1/2 lg:w-3/5 bg-primary-container relative overflow-hidden flex-col justify-between p-xxl text-white">
          <div className="relative z-10 space-y-xl">
            <div className="flex items-center gap-sm">
              <Icon name="hub" className="text-primary-fixed text-[40px]" filled />
              <span className="font-headline-lg text-headline-lg tracking-tight">NexusFlow</span>
            </div>
            <div className="max-w-lg space-y-md">
              <h1 className="font-display-lg text-display-lg">Bienvenido a NexusFlow</h1>
              <p className="font-body-lg text-body-lg text-on-primary-container">
                Comercio electrónico adaptativo impulsado por IA que evoluciona contigo.
              </p>
              <ul className="space-y-md pt-md">
                {[
                  { icon: 'verified_user', text: 'Experiencia personalizada' },
                  { icon: 'lock_open', text: 'Seguridad inteligente' },
                  { icon: 'devices', text: 'Gestión omnicanal' },
                ].map((item) => (
                  <li key={item.text} className="flex items-center gap-md">
                    <Icon name={item.icon} className="text-secondary-container" />
                    <span className="font-body-md">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <img
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB85QyyEpojHDVjr0kGWAWmK-fkJsBL4JVj_GuasQas4o09vOkIPV7GBo_LyZOI5wXZq4Hojsb6K8eGbZtB1eqajezxPWy15irE46UmRUIDixolZIjVYHpQKU1MJpQftYpsWpTuDwC1w126Q2xh4c0DailZCzkqxzW9l7zlTi3y-o6hXQWVUROTkS-ZJF8y5aKIw2a1GGkp34lEw25UI8j8j8cSr4ccpY7iIh9n6css6gixuwqUtspYDSBMPtg_aUpbzzlnrM7sg48"
          />
          <p className="relative z-10 text-sm opacity-60">© 2024 NexusFlow Cloud Solutions.</p>
        </section>

        <section className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center p-gutter md:p-xxl bg-surface">
          <div className="max-w-md w-full mx-auto space-y-xl">
            <div className="flex md:hidden items-center gap-sm mb-xl">
              <Icon name="hub" className="text-primary text-[32px]" filled />
              <span className="font-headline-md text-headline-md text-primary font-bold">NexusFlow</span>
            </div>

            <div className="flex items-center gap-xs text-secondary font-label-md uppercase mb-sm tracking-wide">
              <Icon name="lock" className="text-lg" />
              <span>Inicio de Sesión Seguro</span>
            </div>

            <div className="p-1 bg-surface-container rounded-2xl flex items-center shadow-sm border border-outline-variant mb-xl">
              <button
                type="button"
                onClick={() => setTab('login')}
                className={`flex-1 h-10 rounded-xl font-button transition-all ${
                  tab === 'login' ? 'bg-white text-primary shadow' : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => setTab('register')}
                className={`flex-1 h-10 rounded-xl font-button transition-all ${
                  tab === 'register' ? 'bg-white text-primary shadow' : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                Registrarse
              </button>
            </div>

            <header className="space-y-sm">
              <h2 className="font-headline-lg text-headline-lg text-primary">
                {tab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </h2>
              <p className="text-on-surface-variant font-body-md">
                {tab === 'login'
                  ? 'Ingresa tus credenciales para acceder a tu panel.'
                  : 'Selecciona tu perfil y comienza hoy mismo.'}
              </p>
            </header>

            {tab === 'register' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-md mb-lg">
                {registerProfiles.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedProfile(p.id)}
                    className={`border-2 p-md rounded-xl flex flex-col items-center text-center transition-all focus-ring ${
                      selectedProfile === p.id
                        ? 'border-primary bg-surface-container-low profile-card-active'
                        : 'border-outline-variant bg-white hover:border-primary'
                    }`}
                  >
                    <Icon name={p.icon} className="text-secondary mb-sm text-3xl" />
                    <h3 className="text-label-md text-primary mb-1">{p.title}</h3>
                    <p className="text-[12px] text-on-surface-variant leading-tight">{p.desc}</p>
                  </button>
                ))}
              </div>
            )}

            {authError && (
              <p className="text-error font-label-md p-md bg-error-container/20 rounded-xl border border-error/20" role="alert">
                {authError}
              </p>
            )}

            <form
              className="space-y-lg"
              onSubmit={async (e) => {
                e.preventDefault();
                setAuthError(null);

                if (tab === 'register') {
                  if (selectedProfile === 'merchant') {
                    navigate('/merchant');
                  } else {
                    navigate('/');
                  }
                  return;
                }

                setSubmitting(true);
                try {
                  await signIn(email, password);
                  navigate(redirectTo, { replace: true });
                } catch (err) {
                  setAuthError(err instanceof Error ? err.message : 'No se pudo iniciar sesión.');
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {tab === 'register' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
                  <div className="space-y-sm">
                    <label className="block font-label-md text-on-surface-variant" htmlFor="firstName">
                      Nombres
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      required
                      placeholder="Ej. Juan"
                      className="w-full h-12 px-md bg-white border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="space-y-sm">
                    <label className="block font-label-md text-on-surface-variant" htmlFor="lastName">
                      Apellidos
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      required
                      placeholder="Ej. Pérez"
                      className="w-full h-12 px-md bg-white border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-sm">
                <label className="block font-label-md text-on-surface-variant" htmlFor="email">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@nexusflow.com"
                  className="w-full h-12 px-md bg-white border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              {tab === 'register' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
                    <div className="space-y-sm">
                      <label className="block font-label-md text-on-surface-variant" htmlFor="password">
                        Contraseña
                      </label>
                      <input
                        id="password"
                        type="password"
                        required
                        placeholder="••••••••"
                        className="w-full h-12 px-md bg-white border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                    <div className="space-y-sm">
                      <label className="block font-label-md text-on-surface-variant" htmlFor="confirmPassword">
                        Confirmar contraseña
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        required
                        placeholder="••••••••"
                        className="w-full h-12 px-md bg-white border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-sm">
                    <label className="block font-label-md text-on-surface-variant" htmlFor="phone">
                      Teléfono (opcional)
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+52 000 000 0000"
                      className="w-full h-12 px-md bg-white border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="space-y-sm">
                    <label className="flex items-start gap-md cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        className="w-6 h-6 mt-0.5 rounded border-outline-variant text-primary focus:ring-primary"
                      />
                      <span className="text-label-md text-on-surface-variant font-normal">
                        Acepto los{' '}
                        <a href="#" className="text-primary font-bold hover:underline">
                          términos y condiciones
                        </a>{' '}
                        y la política de privacidad.
                      </span>
                    </label>
                    <label className="flex items-start gap-md cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-6 h-6 mt-0.5 rounded border-outline-variant text-primary focus:ring-primary"
                      />
                      <span className="text-label-md text-on-surface-variant font-normal">
                        Deseo recibir correos promocionales y actualizaciones de NexusFlow.
                      </span>
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="w-full h-14 bg-primary text-white font-button rounded-xl shadow hover:bg-primary/90 transition-all"
                  >
                    Crear cuenta
                  </button>
                </>
              ) : (
                <>
                  <div className="space-y-sm">
                    <div className="flex justify-between items-center">
                      <label className="block font-label-md text-on-surface-variant" htmlFor="password">
                        Contraseña
                      </label>
                      <a href="#" className="text-secondary font-label-md hover:underline">
                        ¿Recuperar contraseña?
                      </a>
                    </div>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-12 px-md bg-white border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant"
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        <Icon name={showPassword ? 'visibility_off' : 'visibility'} />
                      </button>
                    </div>
                  </div>
                  <label className="flex items-center gap-sm cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                    />
                    <span className="font-label-md text-on-surface-variant">Recordar sesión</span>
                  </label>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-12 bg-primary text-white font-button rounded-xl shadow hover:bg-primary/90 transition-all disabled:opacity-60"
                  >
                    {submitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
                  </button>
                  <Link
                    to="/"
                    className="w-full h-12 border border-outline-variant text-on-surface-variant font-button rounded-xl hover:bg-surface-container-low transition-all flex items-center justify-center"
                  >
                    Continuar como invitado
                  </Link>
                </>
              )}
            </form>
          </div>
        </section>
      </main>

      <section className="bg-surface-container-low py-xl px-gutter md:px-xxl border-t border-outline-variant">
        <div className="max-w-container-max mx-auto space-y-lg">
          <div className="text-center md:text-left">
            <h3 className="font-headline-md text-headline-md text-primary">Experiencia Adaptativa</h3>
            <p className="text-on-surface-variant">Selecciona el perfil que mejor se adapta a tus necesidades actuales.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {adaptiveProfiles.map((p) => (
              <button
                key={p.title}
                type="button"
                onClick={() => navigate(p.title === 'Portal Comerciante' ? '/merchant' : '/')}
                className="group bg-white p-lg rounded-2xl shadow-sm hover:shadow-md border border-transparent hover:border-secondary cursor-pointer transition-all text-left w-full focus-ring"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center mb-md group-hover:scale-110 transition-transform">
                  <Icon name={p.icon} className="text-on-secondary-fixed" />
                </div>
                <h4 className="font-headline-md text-lg text-primary mb-xs">{p.title}</h4>
                <p className="text-on-surface-variant font-body-md">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={openPanel}
        aria-label="Opciones de Accesibilidad"
        className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-on-primary shadow-lg hover:scale-110 transition-all focus-ring"
      >
        <Icon name="accessibility_new" className="text-[28px]" />
      </button>
      <AccessibilityPanel />
    </div>
  );
}
