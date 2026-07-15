import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SupportPage } from './SupportPage';

const mocks = vi.hoisted(() => ({
  mockUseChat: vi.fn(),
  mockUseAccessibility: vi.fn(),
  mockNavigate: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mocks.mockNavigate, Link: ({ children, to, ...p }: any) => <a href={to} {...p}>{children}</a> };
});
vi.mock('@/shared/context/ChatContext', () => ({ useChat: () => mocks.mockUseChat() }));
vi.mock('@/shared/context/AccessibilityContext', () => ({ useAccessibility: () => mocks.mockUseAccessibility() }));
vi.mock('@/shared/ui/Icon', () => ({ Icon: (props: any) => <span data-icon={props.name} /> }));
vi.mock('@/components/accessibility/VideoTutorialModal', () => ({ VideoTutorialModal: () => null }));

describe('SupportPage', () => {
  const mockOpen = vi.fn();
  const mockOpenPanel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.mockUseChat.mockReturnValue({ open: mockOpen });
    mocks.mockUseAccessibility.mockReturnValue({ openPanel: mockOpenPanel });
  });

  it('renders help center heading', () => {
    render(<MemoryRouter><SupportPage /></MemoryRouter>);
    expect(screen.getByText('Centro de Ayuda y Soporte')).toBeInTheDocument();
  });

  it('renders help categories', () => {
    render(<MemoryRouter><SupportPage /></MemoryRouter>);
    expect(screen.getByText('Pedidos')).toBeInTheDocument();
    expect(screen.getByText('Pagos')).toBeInTheDocument();
    expect(screen.getByText('Devoluciones')).toBeInTheDocument();
  });

  it('renders ticket form', () => {
    render(<MemoryRouter><SupportPage /></MemoryRouter>);
    expect(screen.getByText('¿Necesitas ayuda? Cuéntanos qué pasó.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ej\. No recibí/)).toBeInTheDocument();
  });

  it('renders AI assistant section', () => {
    render(<MemoryRouter><SupportPage /></MemoryRouter>);
    expect(screen.getByText('Asistente NexusFlow')).toBeInTheDocument();
    expect(screen.getByText('Iniciar Chat con IA')).toBeInTheDocument();
  });

  it('renders recent tickets', () => {
    render(<MemoryRouter><SupportPage /></MemoryRouter>);
    expect(screen.getByText('Tickets recientes')).toBeInTheDocument();
    expect(screen.getByText('Error en pago')).toBeInTheDocument();
    expect(screen.getByText('Cambio de dirección')).toBeInTheDocument();
  });

  it('renders video tutorial section', () => {
    render(<MemoryRouter><SupportPage /></MemoryRouter>);
    expect(screen.getByText('Cómo usar el Centro de Soporte')).toBeInTheDocument();
  });

  it('renders quick action links', () => {
    render(<MemoryRouter><SupportPage /></MemoryRouter>);
    expect(screen.getByText('Crear Ticket')).toBeInTheDocument();
    expect(screen.getByText('Seguimiento de Tickets')).toBeInTheDocument();
    expect(screen.getByText('Soporte en Tiempo Real')).toBeInTheDocument();
  });

  it('opens chat when AI button clicked', () => {
    render(<MemoryRouter><SupportPage /></MemoryRouter>);
    fireEvent.click(screen.getByText('Iniciar Chat con IA'));
    expect(mockOpen).toHaveBeenCalled();
  });

  it('opens accessibility panel', () => {
    render(<MemoryRouter><SupportPage /></MemoryRouter>);
    fireEvent.click(screen.getByText('Ver Guías de Accesibilidad'));
    expect(mockOpenPanel).toHaveBeenCalled();
  });

  it('renders service status section', () => {
    render(<MemoryRouter><SupportPage /></MemoryRouter>);
    expect(screen.getByText('Estado del Servicio')).toBeInTheDocument();
    expect(screen.getByText('Sistemas Operativos')).toBeInTheDocument();
  });

  it('renders recent consultations', () => {
    render(<MemoryRouter><SupportPage /></MemoryRouter>);
    expect(screen.getByText('Consultas Recientes')).toBeInTheDocument();
    expect(screen.getByText('#NF-8821: Error en pago')).toBeInTheDocument();
  });

  it('renders tutorials and video tutorials', () => {
    render(<MemoryRouter><SupportPage /></MemoryRouter>);
    expect(screen.getByText('Guías Rápidas y Tutoriales')).toBeInTheDocument();
    expect(screen.getByText('Cómo configurar tu cuenta')).toBeInTheDocument();
  });

  it('renders help category for Cuenta', () => {
    render(<MemoryRouter><SupportPage /></MemoryRouter>);
    expect(screen.getByText('Cuenta')).toBeInTheDocument();
    expect(screen.getByText('Seguridad, perfil y preferencias de usuario.')).toBeInTheDocument();
  });

  it('renders ticket count', () => {
    render(<MemoryRouter><SupportPage /></MemoryRouter>);
    expect(screen.getByText(/tickets activos/)).toBeInTheDocument();
  });
});
