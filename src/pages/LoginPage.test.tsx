import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';

const mocks = vi.hoisted(() => ({
  mockUseI18n: vi.fn(),
  mockUseAuth: vi.fn(),
  mockUseAccessibility: vi.fn(),
  mockNavigate: vi.fn(),
  mockSignIn: vi.fn(),
  mockSignUp: vi.fn(),
  mockResetPassword: vi.fn(),
}));
vi.mock('@/shared/i18n/I18nContext', () => ({ useI18n: () => mocks.mockUseI18n() }));
vi.mock('@/shared/context/AuthContext', () => ({ useAuth: () => mocks.mockUseAuth() }));
vi.mock('@/shared/context/AccessibilityContext', () => ({ useAccessibility: () => mocks.mockUseAccessibility() }));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mocks.mockNavigate, Link: ({ children, to, ...p }: any) => <a href={to} {...p}>{children}</a> };
});
vi.mock('@/shared/ui/Icon', () => ({ Icon: (props: any) => <span data-icon={props.name} /> }));
vi.mock('@/shared/ui/SkipLink', () => ({ SkipLink: () => null }));
vi.mock('@/components/accessibility/AccessibilityMenu', () => ({ AccessibilityMenu: () => null }));

function submitForm() {
  fireEvent.submit(document.querySelector('form')!);
}

function renderPage() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.mockUseI18n.mockReturnValue({ t: (k: string) => k, locale: 'es', setLocale: vi.fn() });
  mocks.mockUseAuth.mockReturnValue({
    signIn: mocks.mockSignIn,
    signUp: mocks.mockSignUp,
    resetPassword: mocks.mockResetPassword,
    session: null,
  });
  mocks.mockUseAccessibility.mockReturnValue({ openPanel: vi.fn() });
});

describe('LoginPage', () => {
  it('renders login form by default with "Iniciar Sesión" heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeInTheDocument();
    expect(screen.getByText(/Ingresa tus credenciales/)).toBeInTheDocument();
  });

  it('shows NexusFlow brand name', () => {
    renderPage();
    expect(screen.getAllByText('NexusFlow').length).toBeGreaterThanOrEqual(1);
  });

  it('switches to register tab and shows "Crear Cuenta" heading', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));
    expect(screen.getByRole('heading', { name: 'Crear Cuenta' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombres/)).toBeInTheDocument();
  });

  it('login form shows validation errors on empty submit', () => {
    renderPage();
    submitForm();
    expect(screen.getByText('El correo electrónico es obligatorio.')).toBeInTheDocument();
    expect(screen.getByText('La contraseña es obligatoria.')).toBeInTheDocument();
  });

  it('login form shows email format error for invalid email', () => {
    renderPage();
    fireEvent.change(screen.getByLabelText(/Correo electrónico/), { target: { value: 'bad' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'pass123' } });
    submitForm();
    expect(screen.getByText('Formato de email inválido.')).toBeInTheDocument();
  });

  it('successful login navigates to redirect path', async () => {
    mocks.mockSignIn.mockResolvedValue({ user: { user_metadata: {} } });
    renderPage();
    fireEvent.change(screen.getByLabelText(/Correo electrónico/), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'secret123' } });
    submitForm();
    await waitFor(() => {
      expect(mocks.mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  it('successful login as merchant navigates to /merchant', async () => {
    mocks.mockSignIn.mockResolvedValue({ user: { user_metadata: { rol: 'comerciante' } } });
    renderPage();
    fireEvent.change(screen.getByLabelText(/Correo electrónico/), { target: { value: 'm@b.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'secret123' } });
    submitForm();
    await waitFor(() => {
      expect(mocks.mockNavigate).toHaveBeenCalledWith('/merchant', { replace: true });
    });
  });

  it('register form shows email validation error on empty submit', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));
    submitForm();
    expect(screen.getByText('El correo electrónico es obligatorio.')).toBeInTheDocument();
  });

  it('register with short password does not call signUp', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));
    fireEvent.change(screen.getByLabelText(/Correo electrónico/), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/Nombres/), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/Apellidos/), { target: { value: 'Pérez' } });
    submitForm();
    expect(mocks.mockSignUp).not.toHaveBeenCalled();
  });

  it('successful register navigates to /', async () => {
    mocks.mockSignUp.mockResolvedValue({ user: { user_metadata: {} }, requiresEmailConfirmation: false });
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));
    fireEvent.change(screen.getByLabelText(/Correo electrónico/), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/), { target: { value: 'abcdef' } });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/), { target: { value: 'abcdef' } });
    fireEvent.change(screen.getByLabelText(/Nombres/), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/Apellidos/), { target: { value: 'Pérez' } });
    submitForm();
    await waitFor(() => {
      expect(mocks.mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  it('password visibility toggle works', () => {
    renderPage();
    const input = screen.getByLabelText('Contraseña');
    expect(input).toHaveAttribute('type', 'password');
    fireEvent.click(screen.getByRole('button', { name: 'Mostrar contraseña' }));
    expect(input).toHaveAttribute('type', 'text');
    fireEvent.click(screen.getByRole('button', { name: 'Ocultar contraseña' }));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('reset password sends email and shows confirmation', async () => {
    mocks.mockResetPassword.mockResolvedValue(undefined);
    renderPage();
    fireEvent.change(screen.getByLabelText(/Correo electrónico/), { target: { value: 'a@b.com' } });
    fireEvent.click(screen.getByRole('button', { name: '¿Recuperar contraseña?' }));
    await waitFor(() => {
      expect(screen.getByText(/Te enviamos un correo/)).toBeInTheDocument();
    });
    expect(mocks.mockResetPassword).toHaveBeenCalledWith('a@b.com');
  });
});
