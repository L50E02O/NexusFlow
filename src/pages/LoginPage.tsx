// LoginPage.tsx – Updated design matching mockup
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { supabase } from '@/shared/lib/supabase';
import { AccessibilityMenu } from '@/components/accessibility/AccessibilityMenu';
import { useAccessibility } from '@/shared/context/AccessibilityContext';
import { useAuth } from '@/shared/context/AuthContext';
import { SkipLink } from '@/shared/ui/SkipLink';
import { Icon } from '@/shared/ui/Icon';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INPUT_CLASS =
  'h-12 w-full rounded-xl border border-outline-variant bg-white px-md text-body-md transition-colors focus:border-primary focus:ring-1 focus:ring-primary';

const registerProfiles = [
  { id: 'young', icon: 'bolt', title: 'Comprador Joven', desc: 'Experiencia rápida y móvil' },
  { id: 'pro', icon: 'verified_user', title: 'Adulto Profesional', desc: 'Organizada y segura' },
  { id: 'merchant', icon: 'storefront', title: 'Comerciante', desc: 'Inventario e IA' },
] as const;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openPanel } = useAccessibility();
  const { signIn, signUp, resetPassword, session } = useAuth();

  const [tab, setTab] = useState<'login' | 'register'>('login');

  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [registrationSent, setRegistrationSent] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    registerPassword?: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const redirectTo = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/';
  const [selectedProfile, setSelectedProfile] = useState<'young' | 'pro' | 'merchant'>('young');

  useEffect(() => {
    if (session) navigate(redirectTo, { replace: true });
  }, [session, navigate, redirectTo]);

  return (
    <div className="flex min-h-screen flex-col bg-surface font-body-md text-on-surface lg:flex-row">
      {/* Left branding panel – visible on lg+ */}
      <section className="hidden lg:flex lg:w-1/2 bg-primary-container bg-cover bg-center relative p-8 lg:p-12 text-white">
        <img
          src="https://images.unsplash.com/photo-1521791136064-8e1d0b61fc5d?auto=format&fit=crop&w=800&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="flex items-center gap-3">
            <Icon name="hub" className="text-4xl text-primary-fixed" filled />
            <span className="font-headline-lg">NexusFlow</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight">Bienvenido a NexusFlow</h1>
            <p className="text-lg leading-relaxed">
              Comercio electrónico adaptativo impulsado por IA que evoluciona contigo.
            </p>
            <ul className="space-y-2">
              {[{ icon: 'verified_user', text: 'Experiencia personalizada' },
                { icon: 'lock_open', text: 'Seguridad inteligente' },
                { icon: 'devices', text: 'Gestión omnicanal' }].map((item) => (
                <li key={item.text} className="flex items-start gap-2">
                  <Icon name={item.icon} className="mt-0.5 text-secondary-container" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm opacity-80">© 2026 NexusFlow Cloud Solutions.</p>
        </div>
      </section>

      {/* Right form panel */}
      <section id="main-content" className="flex flex-1 flex-col justify-center px-4 py-8 sm:px-6 lg:px-12">
        <SkipLink />
        {/* Mobile header – only on small screens */}
        <header className="flex items-center justify-between border-b pb-4 lg:hidden">
          <div className="flex items-center gap-2">
            <Icon name="hub" className="text-2xl text-primary" />
            <span className="font-headline-md font-bold text-primary">NexusFlow</span>
          </div>
          <button
            type="button"
            onClick={openPanel}
            aria-label="Abrir menú de accesibilidad"
            className="rounded-full p-2 hover:bg-surface-container hover:text-primary focus-ring"
          >
            <Icon name="accessibility_new" />
          </button>
        </header>

        <div className="mb-6 hidden items-center justify-end lg:flex">
          <button
            type="button"
            onClick={openPanel}
            aria-label="Abrir menú de accesibilidad"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant bg-surface text-on-surface transition hover:border-primary hover:text-primary focus-ring"
          >
            <Icon name="accessibility_new" />
          </button>
        </div>

        {/* Tabs */}
        <div className="my-8 flex w-full max-w-md gap-4 rounded-xl bg-surface-container-high p-1">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 rounded-lg py-2 transition-all ${tab === 'login' ? 'bg-white text-primary shadow' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 rounded-lg py-2 transition-all ${tab === 'register' ? 'bg-white text-primary shadow' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            Registrarse
          </button>
        </div>

        <h2 className="mb-2 text-2xl font-semibold text-primary">
          {tab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h2>
        <p className="mb-4 text-on-surface-variant">
          {tab === 'login'
            ? 'Ingresa tus credenciales para acceder a tu panel.'
            : 'Selecciona tu perfil y comienza hoy mismo.'}
        </p>

        {tab === 'register' && (
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
        )}

        {resetSent && (
          <p className="rounded-xl bg-secondary-container/30 p-3 mb-4 text-on-surface" role="status" aria-live="polite">
            Te enviamos un correo con instrucciones para restablecer tu contraseña.
          </p>
        )}

        {registrationSent && (
          <p className="rounded-xl bg-primary-container/20 border border-primary/20 p-3 mb-4 text-on-surface" role="status" aria-live="polite">
            Revisa tu correo y confirma tu cuenta para continuar. La creación del perfil se completará después de iniciar sesión.
          </p>
        )}

        {authError && (
          <p className="rounded-xl bg-error-container/20 border border-error/20 p-3 mb-4" role="alert">
            {authError}
          </p>
        )}

        <form className="space-y-4" noValidate onSubmit={async (e) => {
          e.preventDefault();
          setAuthError(null);
          setFieldErrors({});

          // --- Validation ---------------------------------------------------
          if (tab === 'login') {
            const errors: { email?: string; password?: string } = {};
            if (!email.trim()) errors.email = 'El correo electrónico es obligatorio.';
            else if (!EMAIL_RE.test(email)) errors.email = 'Formato de email inválido.';
            if (!password) errors.password = 'La contraseña es obligatoria.';
            if (Object.keys(errors).length) {
              setFieldErrors(errors);
              emailRef.current?.focus();
              return;
            }
          } else {
            const errors: {
              email?: string;
              registerPassword?: string;
              confirmPassword?: string;
              firstName?: string;
              lastName?: string;
            } = {};
            if (!email.trim()) errors.email = 'El correo electrónico es obligatorio.';
            else if (!EMAIL_RE.test(email)) errors.email = 'Formato de email inválido.';
            if (!registerPassword) errors.registerPassword = 'La contraseña es obligatoria.';
            else if (registerPassword.length < 6) errors.registerPassword = 'La contraseña debe tener al menos 6 caracteres.';
            if (!confirmPassword) errors.confirmPassword = 'Confirma la contraseña.';
            else if (registerPassword !== confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden.';
            if (!firstName.trim()) errors.firstName = 'El nombre es obligatorio.';
            if (!lastName.trim()) errors.lastName = 'Los apellidos son obligatorios.';
            if (Object.keys(errors).length) {
              setFieldErrors(errors);
              emailRef.current?.focus();
              return;
            }
          }

          // --- Submit ------------------------------------------------------
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
        }}>

          {/* Nombre y apellidos – solo registro */}
          {tab === 'register' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label htmlFor="firstName" className="block text-label-md text-on-surface-variant">Nombres</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  placeholder="Ej. Juan"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={INPUT_CLASS}
                  aria-invalid={!!fieldErrors.firstName}
                  aria-describedby={fieldErrors.firstName ? 'firstName-error' : undefined}
                />
                {fieldErrors.firstName && (
                  <p id="firstName-error" className="text-sm text-error" role="alert">
                    {fieldErrors.firstName}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label htmlFor="lastName" className="block text-label-md text-on-surface-variant">Apellidos</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  placeholder="Ej. Pérez"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={INPUT_CLASS}
                  aria-invalid={!!fieldErrors.lastName}
                  aria-describedby={fieldErrors.lastName ? 'lastName-error' : undefined}
                />
                {fieldErrors.lastName && (
                  <p id="lastName-error" className="text-sm text-error" role="alert">
                    {fieldErrors.lastName}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="email" className="block text-label-md text-on-surface-variant">Correo electrónico</label>
            <input
              ref={emailRef}
              id="email"
              name="email"
              type="email"
              required
              placeholder="ejemplo@nexusflow.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={INPUT_CLASS}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            />
            {fieldErrors.email && (
              <p id="email-error" className="text-sm text-error" role="alert">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password fields */}
          {tab === 'register' ? (
            <>
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
                    <button type="button" onClick={() => setShowRegisterPassword(!showRegisterPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant min-h-11 min-w-11 inline-flex items-center justify-center" aria-label={showRegisterPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
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
                    <button type="button" onClick={() => setShowRegisterPassword(!showRegisterPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant min-h-11 min-w-11 inline-flex items-center justify-center" aria-label={showRegisterPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
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
            </>
          ) : (
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
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition disabled:opacity-60"
          >
            {submitting ? (tab === 'login' ? 'Iniciando sesión...' : 'Creando cuenta...') : (tab === 'login' ? 'Iniciar sesión' : 'Crear cuenta')}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-6 flex flex-col items-center space-y-2 text-sm text-on-surface-variant">
          {tab === 'login' && (
            <button type="button" className="hover:underline" onClick={async () => {
              if (!email.trim()) {
                setFieldErrors({ email: 'Ingresa tu correo para recuperar la contraseña.' });
                return;
              }
              try {
                await resetPassword(email);
                setResetSent(true);
              } catch (err) {
                setAuthError(err instanceof Error ? err.message : 'Error al enviar el correo de recuperación.');
              }
            }}>
              ¿Recuperar contraseña?
            </button>
          )}
          <Link to="/" className="hover:underline">Continuar como invitado</Link>
          <Link to="/terminos" className="hover:underline">Términos y condiciones</Link>
        </div>

        <AccessibilityMenu />
      </section>
    </div>
  );
}
