import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Footer } from './Footer';

const { mockUseI18n, mockNavigate } = vi.hoisted(() => ({
  mockUseI18n: vi.fn(),
  mockNavigate: vi.fn(),
}));

vi.mock('@/shared/i18n/I18nContext', () => ({
  useI18n: () => mockUseI18n(),
}));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
  };
});
vi.mock('@/shared/ui/Icon', () => ({
  Icon: (props: any) => <span data-icon={props.name} />,
}));

function renderFooter() {
  return render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  );
}

describe('Footer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseI18n.mockReturnValue({
      locale: 'es',
      setLocale: vi.fn(),
      t: (k: string) => k,
    });
  });

  it('renders NexusFlow brand name', () => {
    renderFooter();
    expect(screen.getByText('NexusFlow')).toBeInTheDocument();
  });

  it('renders company links section', () => {
    renderFooter();
    expect(screen.getByText('Empresa')).toBeInTheDocument();
    expect(screen.getByText('Sobre nosotros')).toBeInTheDocument();
    expect(screen.getByText('Sostenibilidad')).toBeInTheDocument();
    expect(screen.getByText('Carreras')).toBeInTheDocument();
  });

  it('renders support links section', () => {
    renderFooter();
    expect(screen.getByText('Soporte')).toBeInTheDocument();
    expect(screen.getByText('Centro de soporte y accesibilidad')).toBeInTheDocument();
    expect(screen.getByText('Privacidad')).toBeInTheDocument();
    expect(screen.getByText('Términos de uso')).toBeInTheDocument();
    expect(screen.getByText('Política de devoluciones')).toBeInTheDocument();
    expect(screen.getByText('Métodos de pago')).toBeInTheDocument();
  });

  it('newsletter form submission shows thank-you message', async () => {
    renderFooter();
    const input = screen.getByPlaceholderText('Correo electrónico');
    const submitBtn = screen.getByRole('button', { name: /unirse al boletín/i });

    await act(async () => {
      fireEvent.change(input, { target: { value: 'test@example.com' } });
      fireEvent.click(submitBtn);
    });

    expect(screen.getByRole('status')).toHaveTextContent(
      '¡Gracias! Te hemos suscrito al boletín de NexusFlow.',
    );
  });

  it('toggle locale button switches between es/en', () => {
    const setLocale = vi.fn();
    mockUseI18n.mockReturnValue({
      locale: 'es',
      setLocale,
      t: (k: string) => k,
    });

    renderFooter();
    const btn = screen.getByRole('button', { name: /cambiar idioma/i });
    fireEvent.click(btn);

    expect(setLocale).toHaveBeenCalledWith('en');
  });

  it('has accessible aria-label on newsletter form', () => {
    renderFooter();
    expect(
      screen.getByRole('form', { name: /formulario de suscripción al boletín/i }),
    ).toBeInTheDocument();
  });
});
