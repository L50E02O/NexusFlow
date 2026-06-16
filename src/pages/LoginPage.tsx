import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@/shared/ui/Icon';
import { AccessibilityMenu } from '@/components/accessibility/AccessibilityMenu';
import { useAccessibility } from '@/shared/context/AccessibilityContext';
import { useAuth } from '@/shared/context/AuthContext';
import { SkipLink } from '@/shared/ui/SkipLink';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INPUT_CLASS =
  'h-12 w-full rounded-xl border border-outline-variant bg-white px-md text-body-md transition-colors focus:border-primary focus:ring-1 focus:ring-primary';

const adaptiveProfiles = [
  { icon: 'smartphone', title: 'Comprador Joven Digital', desc: 'Rápida, fluida y optimizada para dispositivos móviles.' },
  { icon: 'work', title: 'Adulto Profesional', desc: 'Organizada, eficiente y centrada en la productividad.' },
  { icon: 'monitoring', title: 'Portal Comerciante', desc: 'Inteligente, potente y con analíticas en tiempo real.' },
];
type FieldErrors = {
  email?: string;
  password?: string;
  registerPassword?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
};

type ProfileOption = 'young' | 'pro' | 'merchant';

const registerProfiles = [
  { id: 'young', icon: 'bolt', title: 'Comprador Joven', desc: 'Experiencia rápida y móvil' },
  { id: 'pro', icon: 'verified_user', title: 'Adulto Profesional', desc: 'Organizada y segura' },
  { id: 'merchant', icon: 'storefront', title: 'Comerciante', desc: 'Inventario e IA' },
] as const;

const validateLogin = (email: string, password: string) => {
  const errors: FieldErrors = {};
  if (!email.trim()) errors.email = 'El correo electrónico es obligatorio.';
  else if (!EMAIL_RE.test(email)) errors.email = 'Formato de email inválido.';
  if (!password) errors.password = 'La contraseña es obligatoria.';
  return errors;
};

const validateRegister = (
  email: string,
  registerPassword: string,
  confirmPassword: string,
  firstName: string,
  lastName: string,
) => {
  const errors: FieldErrors = {};

  if (!email.trim()) errors.email = 'El correo electrónico es obligatorio.';
  else if (!EMAIL_RE.test(email)) errors.email = 'Formato de email inválido.';
  if (!registerPassword) errors.registerPassword = 'La contraseña es obligatoria.';
  else if (registerPassword.length < 6) errors.registerPassword = 'La contraseña debe tener al menos 6 caracteres.';
  if (!confirmPassword) errors.confirmPassword = 'Confirma la contraseña.';
  else if (registerPassword !== confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden.';
  if (!firstName.trim()) errors.firstName = 'El nombre es obligatorio.';
  if (!lastName.trim()) errors.lastName = 'Los apellidos son obligatorios.';

  return errors;
};

const getSubmitLabel = (tab: 'login' | 'register', submitting: boolean) => {
  if (submitting) return tab === 'login' ? 'Iniciando sesión...' : 'Creando cuenta...';
  return tab === 'login' ? 'Iniciar sesión' : 'Crear cuenta';
};

type RegisterProfileChooserProps = Readonly<{
  selectedProfile: ProfileOption;
  setSelectedProfile: Dispatch<SetStateAction<ProfileOption>>;
}>;

function RegisterProfileChooser({ selectedProfile, setSelectedProfile }: RegisterProfileChooserProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {registerProfiles.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => setSelectedProfile(p.id)}
          className={`flex flex-col items-center rounded-xl border-2 p-4 text-center transition ${selectedProfile === p.id ? 'border-primary bg-surface-container-low' : 'border-outline-variant bg-white hover:border-primary'}`}
        >
          <Icon name={p.icon} className="mb-2 text-3xl text-secondary" />
          <h3 className="text-label-md font-medium text-primary mb-1">{p.title}</h3>
          <p className="text-sm text-on-surface-variant">{p.desc}</p>
        </button>
      ))}
    </div>
  );
}

type AuthPasswordFieldsProps = Readonly<{
  tab: 'login' | 'register';
  showPassword: boolean;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
  showRegisterPassword: boolean;
  setShowRegisterPassword: Dispatch<SetStateAction<boolean>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  registerPassword: string;
  setRegisterPassword: Dispatch<SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: Dispatch<SetStateAction<string>>;
  fieldErrors: FieldErrors;
}>;

function RegisterPasswordFields({
  showRegisterPassword,
  setShowRegisterPassword,
  registerPassword,
  setRegisterPassword,
  confirmPassword,
  setConfirmPassword,
  fieldErrors,
}: Readonly<Pick<AuthPasswordFieldsProps, 'showRegisterPassword' | 'setShowRegisterPassword' | 'registerPassword' | 'setRegisterPassword' | 'confirmPassword' | 'setConfirmPassword' | 'fieldErrors'>>) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="space-y-1">
        <label htmlFor="registerPassword" className="block text-label-md text-on-surface-variant">Contraseña</label>
        <div className="relative">
          <input
            id="registerPassword"
            name="registerPassword"
            type={showRegisterPassword ? 'text' : 'password'}
            required
            placeholder="••••••••"
            autoComplete="new-password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            className={INPUT_CLASS}
            aria-invalid={!!fieldErrors.registerPassword}
            aria-describedby={fieldErrors.registerPassword ? 'registerPassword-error' : undefined}
          />
          <button
            type="button"
            onClick={() => setShowRegisterPassword(!showRegisterPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant min-h-11 min-w-11 inline-flex items-center justify-center"
            aria-label={showRegisterPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            <Icon name={showRegisterPassword ? 'visibility_off' : 'visibility'} />
          </button>
        </div>
        {fieldErrors.registerPassword && (
          <p id="registerPassword-error" className="text-sm text-error" role="alert">
            {fieldErrors.registerPassword}
          </p>
        )}
      </div>
      <div className="space-y-1">
        <label htmlFor="confirmPassword" className="block text-label-md text-on-surface-variant">Confirmar contraseña</label>
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showRegisterPassword ? 'text' : 'password'}
            required
            placeholder="••••••••"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={INPUT_CLASS}
            aria-invalid={!!fieldErrors.confirmPassword}
            aria-describedby={fieldErrors.confirmPassword ? 'confirmPassword-error' : undefined}
          />
          <button
            type="button"
            onClick={() => setShowRegisterPassword(!showRegisterPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant min-h-11 min-w-11 inline-flex items-center justify-center"
            aria-label={showRegisterPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            <Icon name={showRegisterPassword ? 'visibility_off' : 'visibility'} />
          </button>
        </div>
        {fieldErrors.confirmPassword && (
          <p id="confirmPassword-error" className="text-sm text-error" role="alert">
            {fieldErrors.confirmPassword}
          </p>
        )}
      </div>
    </div>
  );
}

function LoginPasswordField({
  showPassword,
  setShowPassword,
  password,
  setPassword,
  fieldErrors,
}: Readonly<Pick<AuthPasswordFieldsProps, 'showPassword' | 'setShowPassword' | 'password' | 'setPassword' | 'fieldErrors'>>) {
  return (
    <>
      <div className="space-y-1">
        <label htmlFor="password" className="block text-label-md text-on-surface-variant">Contraseña</label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${INPUT_CLASS} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            <Icon name={showPassword ? 'visibility_off' : 'visibility'} />
          </button>
        </div>
      </div>
      {fieldErrors.password && (
        <p id="password-error" className="text-sm text-error" role="alert">
          {fieldErrors.password}
        </p>
      )}
    </>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openPanel } = useAccessibility();
  const { signIn, signUp, resetPassword, session } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<string>('young');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  const redirectTo = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/';

  useEffect(() => {
    if (session) {
      navigate(redirectTo, { replace: true });
    }
  }, [session, navigate, redirectTo]);

  const handleResetPassword = async () => {
    setAuthError(null);
    setFieldErrors({});

    if (!email.trim()) {
      setFieldErrors({ email: 'Ingresa tu correo para recuperar la contraseña.' });
      emailRef.current?.focus();
      return;
    }

    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Error al enviar el correo de recuperación.');
    }
  };

  const processSubmit = async () => {
    setAuthError(null);
    setFieldErrors({});

    const errors = tab === 'login'
      ? validateLogin(email, password)
      : validateRegister(email, registerPassword, confirmPassword, firstName, lastName);

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      emailRef.current?.focus();
      return;
    }

    setSubmitting(true);
    try {
      if (tab === 'login') {
        await signIn(email, password);
        navigate(redirectTo, { replace: true });
      } else {
        const result = await signUp(email, registerPassword, {
          role: selectedProfile === 'merchant' ? 'comerciante' : 'cliente',
          firstName,
          lastName,
          demoRecords: [
            { title: 'Registro 1', description: 'Demo record 1' },
            { title: 'Registro 2', description: 'Demo record 2' },
            { title: 'Registro 3', description: 'Demo record 3' },
          ],
        });

        if (result.requiresEmailConfirmation) {
          setRegistrationSent(true);
          return;
        }

        navigate(selectedProfile === 'merchant' ? '/merchant' : '/', { replace: true });
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Error al procesar la solicitud.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    void processSubmit();
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface font-body-md text-on-surface">
      <SkipLink />
      <header className="flex items-center justify-between border-b border-outline-variant px-gutter py-sm lg:hidden">
        <div className="flex items-center gap-sm">
          <Icon name="hub" className="shrink-0 text-[28px] text-primary" filled />
          <span className="font-headline-md font-bold text-primary">NexusFlow</span>
        </div>
        <button
          type="button"
          onClick={openPanel}
          aria-label="Abrir menú de accesibilidad"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container hover:text-primary focus-ring"
        >
          <Icon name="accessibility_new" />
        </button>
      </header>

      <section className="border-b border-outline-variant bg-primary-container px-gutter py-lg text-on-primary-container lg:hidden">
        <h1 className="mb-sm font-headline-md text-headline-md leading-tight text-white">
          Bienvenido a NexusFlow
        </h1>
        <p className="max-w-xl text-body-md leading-relaxed opacity-90">
          Comercio electrónico adaptativo impulsado por IA que evoluciona contigo.
        </p>
      </section>

      <main
        id="main-content"
        className="flex min-h-0 flex-1 flex-col lg:flex-row"
        tabIndex={-1}
      >
        <section className="relative hidden min-h-[320px] flex-col justify-between overflow-hidden bg-primary-container p-xl text-white lg:flex lg:h-screen lg:min-h-screen lg:w-[48%] lg:p-xxl xl:w-[48%]">
          <img
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB85QyyEpojHDVjr0kGWAWmK-fkJsBL4JVj_GuasQas4o09vOkIPV7GBo_LyZOI5wXZq4Hojsb6K8eGbZtB1eqajezxPWy15irE46UmRUIDixolZIjVYHpQKU1MJpQftYpsWpTuDwC1w126Q2xh4c0DailZCzkqxzW9l7zlTi3y-o6hXQWVUROTkS-ZJF8y5aKIw2a1GGkp34lEw25UI8j8j8cSr4ccpY7iIh9n6css6gixuwqUtspYDSBMPtg_aUpbzzlnrM7sg48"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-container/90 via-primary-container/80 to-primary-container/65" aria-hidden="true" />

          <div className="relative z-10 flex flex-col gap-xl justify-center py-0">
            <div className="flex items-center gap-sm">
              <Icon name="hub" className="shrink-0 text-[40px] text-primary-fixed" filled />
              <span className="font-headline-lg text-headline-lg tracking-tight">NexusFlow</span>
            </div>
            <div className="max-w-lg space-y-lg">
              <h1 className="text-balance font-display-lg text-[clamp(2rem,4vw,3rem)] leading-tight">
                Bienvenido a NexusFlow
              </h1>
              <p className="max-w-md font-body-lg text-body-lg leading-relaxed text-on-primary-container">
                Comercio electrónico adaptativo impulsado por IA que evoluciona contigo.
              </p>
              <ul className="space-y-md pt-sm">
                {[
                  { icon: 'verified_user', text: 'Experiencia personalizada' },
                  { icon: 'lock_open', text: 'Seguridad inteligente' },
                  { icon: 'devices', text: 'Gestión omnicanal' },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-md">
                    <Icon name={item.icon} className="mt-0.5 shrink-0 text-secondary-container" />
                    <span className="font-body-md leading-snug">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="relative z-10 text-sm opacity-70">© 2026 NexusFlow Cloud Solutions.</p>
        </section>

        <section className="flex min-h-0 flex-1 flex-col bg-surface lg:max-h-screen lg:overflow-y-auto">
          <div className="flex flex-1 items-center justify-center px-gutter py-xl sm:px-lg sm:py-lg lg:px-xl lg:py-lg">
          <div className="w-full max-w-2xl space-y-lg lg:space-y-lg">
            <div className="hidden justify-end lg:flex">
              <button
                type="button"
                onClick={openPanel}
                aria-label="Abrir menú de accesibilidad"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container hover:text-primary focus-ring"
              >
                <Icon name="accessibility_new" />
              </button>
            </div>
            <div className="mb-sm flex items-center gap-xs font-label-md uppercase tracking-wide text-secondary">
              <Icon name="lock" className="text-lg" />
              <span>Inicio de Sesión Seguro</span>
            </div>

            <div className="mb-lg flex items-center rounded-2xl border border-outline-variant bg-surface-container p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setTab('login')}
                className={`h-11 min-h-11 flex-1 rounded-xl font-button transition-all ${
                  tab === 'login' ? 'bg-white text-primary shadow' : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => setTab('register')}
                className={`h-11 min-h-11 flex-1 rounded-xl font-button transition-all ${
                  tab === 'register' ? 'bg-white text-primary shadow' : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                Registrarse
              </button>
            </div>
        {tab === 'register' && (
          <RegisterProfileChooser selectedProfile={selectedProfile} setSelectedProfile={setSelectedProfile} />
        )}

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
              <div className="mb-md grid grid-cols-1 gap-lg min-[520px]:grid-cols-3 min-[520px]:gap-xl">
                {registerProfiles.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedProfile(p.id)}
                    className={`flex min-h-[7.5rem] flex-col items-center justify-center rounded-xl border-2 p-sm text-center transition-all focus-ring sm:p-md ${
                      selectedProfile === p.id
                        ? 'border-primary bg-surface-container-low profile-card-active'
                        : 'border-outline-variant bg-white hover:border-primary'
                    }`}
                  >
                    <Icon name={p.icon} className="mb-sm shrink-0 text-3xl text-secondary" />
                    <h3 className="mb-1 text-label-md leading-tight text-primary">{p.title}</h3>
                    <p className="text-[12px] leading-snug text-on-surface-variant">{p.desc}</p>
                  </button>
                ))}
              </div>
            )}

            {resetSent && (
              <p className="p-md bg-secondary-container/30 rounded-xl border border-secondary/20 text-on-surface text-sm" role="status">
                Te enviamos un correo con instrucciones para restablecer tu contraseña.
              </p>
            )}
            {authError && (
              <p className="form-error p-md bg-error-container/20 rounded-xl border border-error/20 text-sm" role="alert" id="form-error-summary">
                {authError}
              </p>
            )}

            <form
              className="space-y-lg"
              noValidate
              onSubmit={async (e) => {
                e.preventDefault();
                setAuthError(null);
                setFieldErrors({});

                if (tab === 'login') {
                  const errors: { email?: string; password?: string } = {};
                  if (!email.trim()) {
                    errors.email = 'El correo electrónico es obligatorio.';
                  } else if (!EMAIL_RE.test(email)) {
                    errors.email = 'El email debe tener el formato usuario@dominio.com';
                  }
                  if (!password) {
                    errors.password = 'La contraseña es obligatoria.';
                  }
                  if (Object.keys(errors).length > 0) {
                    setFieldErrors(errors);
                    emailRef.current?.focus();
                    return;
                  }
                }

                if (tab === 'register') {
                  const errors: { email?: string; password?: string } = {};
                  if (!email.trim()) {
                    errors.email = 'El correo electrónico es obligatorio.';
                  } else if (!EMAIL_RE.test(email)) {
                    errors.email = 'El email debe tener el formato usuario@dominio.com';
                  }
                  if (!registerPassword) {
                    errors.password = 'La contraseña es obligatoria.';
                  } else if (registerPassword.length < 6) {
                    errors.password = 'La contraseña debe tener al menos 6 caracteres.';
                  } else if (registerPassword !== confirmPassword) {
                    errors.password = 'Las contraseñas no coinciden.';
                  }
                  if (Object.keys(errors).length > 0) {
                    setFieldErrors(errors);
                    emailRef.current?.focus();
                    return;
                  }

                  setSubmitting(true);
                  try {
                    await signUp(email, registerPassword, {
                      role: selectedProfile === 'merchant' ? 'merchant' : 'consumer',
                      firstName,
                      lastName,
                    });
                    navigate(selectedProfile === 'merchant' ? '/merchant' : '/', { replace: true });
                  } catch (err) {
                    setAuthError(err instanceof Error ? err.message : 'No se pudo crear la cuenta.');
                  } finally {
                    setSubmitting(false);
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
                <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 sm:gap-xl">
                  <div className="space-y-md">
                    <label className="block font-label-md text-on-surface-variant" htmlFor="firstName">
                      Nombres (requerido)
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      autoComplete="given-name"
                      aria-required="true"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ej. Juan"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div className="space-y-md">
                    <label className="block font-label-md text-on-surface-variant" htmlFor="lastName">
                      Apellidos (requerido)
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      autoComplete="family-name"
                      aria-required="true"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Ej. Pérez"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
              )}
        <form className="space-y-4" noValidate onSubmit={handleSubmit}>

              <div className="space-y-md">
                <label className="block font-label-md text-on-surface-variant" htmlFor="email">
                  Correo electrónico (requerido)
                </label>
                <p className="text-label-md text-on-surface-variant" id="email-format-hint">
                  Formato: usuario@dominio.com
                </p>
                <input
                  ref={emailRef}
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  aria-required="true"
                  aria-invalid={fieldErrors.email ? true : undefined}
                  aria-describedby={fieldErrors.email ? 'email-error email-format-hint' : 'email-format-hint'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@nexusflow.com"
                  className={INPUT_CLASS}
                />
                {fieldErrors.email && (
                  <p id="email-error" className="form-error" role="alert">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {tab === 'register' ? (
                <>
                    <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 sm:gap-xl">
                    <div className="space-y-md">
                      <label className="block font-label-md text-on-surface-variant" htmlFor="password">
                        Contraseña (requerido)
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        autoComplete="new-password"
                        aria-required="true"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        placeholder="••••••••"
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div className="space-y-md">
                      <label className="block font-label-md text-on-surface-variant" htmlFor="confirmPassword">
                        Confirmar contraseña (requerido)
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        autoComplete="new-password"
                        aria-required="true"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className={INPUT_CLASS}
                      />
                    </div>
                  </div>
                  <div className="space-y-md">
                    <label className="block font-label-md text-on-surface-variant" htmlFor="phone">
                      Teléfono (opcional)
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+52 000 000 0000"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div className="space-y-md">
                    <label className="flex items-start gap-md cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        className="w-6 h-6 mt-0.5 rounded border-outline-variant text-primary focus:ring-primary"
                      />
                      <span className="text-label-md text-on-surface-variant font-normal">
                        Acepto los{' '}
                        <Link to="/terminos" className="text-primary font-bold hover:underline">
                          términos y condiciones
                        </Link>{' '}
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
                  <div className="space-y-md">
                    <div className="flex flex-col gap-xs sm:flex-row sm:items-center sm:justify-between">
                      <label className="block font-label-md text-on-surface-variant" htmlFor="password">
                        Contraseña
                      </label>
                      <button
                        type="button"
                        className="self-start text-left font-label-md text-secondary hover:underline sm:self-auto"
                        onClick={async () => {
                          if (!email.trim()) {
                            setFieldErrors({ email: 'Ingresa tu correo para recuperar la contraseña.' });
                            return;
                          }
                          try {
                            await resetPassword(email);
                            setResetSent(true);
                          } catch (err) {
                            setAuthError(err instanceof Error ? err.message : 'No se pudo enviar el correo de recuperación.');
                          }
                        }}
                      >
                        ¿Recuperar contraseña?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="current-password"
                        aria-required="true"
                        aria-invalid={fieldErrors.password ? true : undefined}
                        aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`${INPUT_CLASS} pr-12`}
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
                    {fieldErrors.password && (
                      <p id="password-error" className="form-error" role="alert">
                        {fieldErrors.password}
                      </p>
                    )}
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
          </div>
        </section>
      </main>

      <section className="border-t border-outline-variant bg-surface-container-low px-gutter py-xl md:px-xxl">
        <div className="mx-auto max-w-container-max space-y-lg">
          <div className="text-center md:text-left">
            <h3 className="font-headline-md text-headline-md text-primary">Experiencia Adaptativa</h3>
            <p className="text-on-surface-variant">Selecciona el perfil que mejor se adapta a tus necesidades actuales.</p>
          </div>
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
            {adaptiveProfiles.map((p) => (
              <button
                key={p.title}
                type="button"
                onClick={() => navigate(p.title === 'Portal Comerciante' ? '/merchant' : '/')}
                className="group w-full cursor-pointer rounded-2xl border border-transparent bg-white p-lg text-left shadow-sm transition-all hover:border-secondary hover:shadow-md focus-ring"
              >
                <div className="mb-md flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-fixed transition-transform group-hover:scale-110">
                  <Icon name={p.icon} className="text-on-secondary-fixed" />
                </div>
                <h4 className="mb-xs font-headline-md text-lg leading-snug text-primary">{p.title}</h4>
                <p className="font-body-md leading-relaxed text-on-surface-variant">{p.desc}</p>
              </button>
            ))}
          </div>
          {/* Password fields */}
          {tab === 'register' ? (
            <RegisterPasswordFields
              showRegisterPassword={showRegisterPassword}
              setShowRegisterPassword={setShowRegisterPassword}
              registerPassword={registerPassword}
              setRegisterPassword={setRegisterPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              fieldErrors={fieldErrors}
            />
          ) : (
            <LoginPasswordField
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              password={password}
              setPassword={setPassword}
              fieldErrors={fieldErrors}
            />
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition disabled:opacity-60"
          >
            {getSubmitLabel(tab, submitting)}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-6 flex flex-col items-center space-y-2 text-sm text-on-surface-variant">
          {tab === 'login' && (
            <button type="button" className="hover:underline" onClick={handleResetPassword}>
              ¿Recuperar contraseña?
            </button>
          )}
          <Link to="/" className="hover:underline">Continuar como invitado</Link>
          <Link to="/terminos" className="hover:underline">Términos y condiciones</Link>
        </div>
      </section>

      <AccessibilityMenu />
    </div>
  );
}
