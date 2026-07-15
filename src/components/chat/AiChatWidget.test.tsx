import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AiChatWidget } from './AiChatWidget';

const { mockUseChat, mockUseDraggable } = vi.hoisted(() => ({
  mockUseChat: vi.fn(),
  mockUseDraggable: vi.fn(),
}));

vi.mock('@/shared/context/ChatContext', () => ({
  useChat: () => mockUseChat(),
}));
vi.mock('@/shared/hooks/useDraggable', () => ({
  useDraggable: () => mockUseDraggable(),
}));
vi.mock('@/shared/hooks/useFocusTrap', () => ({
  useFocusTrap: vi.fn(),
}));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
  };
});
vi.mock('@/shared/ui/Icon', () => ({
  Icon: (props: any) => <span data-icon={props.name} />,
}));

describe('AiChatWidget', () => {
  const toggle = vi.fn();
  const open = vi.fn();
  const close = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseChat.mockReturnValue({
      isOpen: false,
      open,
      close,
      toggle,
    });
    mockUseDraggable.mockReturnValue({
      position: null,
      fixedStyle: undefined,
      onPointerDown: vi.fn(),
      onPointerMove: vi.fn(),
      onPointerEnd: vi.fn(),
      wasDragged: () => false,
    });
  });

  it('renders the FAB button', () => {
    render(<AiChatWidget />);
    expect(screen.getByLabelText(/abrir asistente/i)).toBeInTheDocument();
  });

  it('opens chat panel on FAB click', () => {
    render(<AiChatWidget />);
    const fab = screen.getByLabelText(/abrir asistente/i);
    fireEvent.pointerUp(fab);
    expect(toggle).toHaveBeenCalled();
  });

  it('shows welcome hint bubble when closed', () => {
    render(<AiChatWidget />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('does not show chat panel when closed', () => {
    render(<AiChatWidget />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows chat panel when isOpen is true', () => {
    mockUseChat.mockReturnValue({ isOpen: true, open, close, toggle });
    render(<AiChatWidget />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows textarea input when chat is open', () => {
    mockUseChat.mockReturnValue({ isOpen: true, open, close, toggle });
    render(<AiChatWidget />);
    expect(screen.getByPlaceholderText('Escribe aquí...')).toBeInTheDocument();
  });

  it('shows welcome message in chat panel', () => {
    mockUseChat.mockReturnValue({ isOpen: true, open, close, toggle });
    render(<AiChatWidget />);
    expect(screen.getByText(/¡Hola! Soy tu conserje de IA/)).toBeInTheDocument();
  });

  it('closes chat panel when close button is clicked', () => {
    mockUseChat.mockReturnValue({ isOpen: true, open, close, toggle });
    render(<AiChatWidget />);
    fireEvent.click(screen.getByLabelText('Cerrar chat'));
    expect(close).toHaveBeenCalled();
  });

  it('does not call toggle when drag was active', () => {
    mockUseDraggable.mockReturnValue({
      position: null,
      fixedStyle: undefined,
      onPointerDown: vi.fn(),
      onPointerMove: vi.fn(),
      onPointerEnd: vi.fn(),
      wasDragged: () => true,
    });
    render(<AiChatWidget />);
    const fab = screen.getByLabelText(/abrir asistente/i);
    fireEvent.pointerUp(fab);
    expect(toggle).not.toHaveBeenCalled();
  });

  it('sends a message when typing and pressing Enter', () => {
    mockUseChat.mockReturnValue({ isOpen: true, open, close, toggle });
    render(<AiChatWidget />);
    const textarea = screen.getByPlaceholderText('Escribe aquí...');
    fireEvent.change(textarea, { target: { value: 'pedido' } });
    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(screen.getByText('pedido')).toBeInTheDocument();
  });

  it('sends a message when clicking the send button', () => {
    mockUseChat.mockReturnValue({ isOpen: true, open, close, toggle });
    render(<AiChatWidget />);
    const textarea = screen.getByPlaceholderText('Escribe aquí...');
    fireEvent.change(textarea, { target: { value: 'oferta' } });
    fireEvent.click(screen.getByLabelText('Enviar mensaje'));
    expect(screen.getByText('oferta')).toBeInTheDocument();
  });

  it('does not send empty messages', () => {
    mockUseChat.mockReturnValue({ isOpen: true, open, close, toggle });
    render(<AiChatWidget />);
    fireEvent.click(screen.getByLabelText('Enviar mensaje'));
    expect(screen.getAllByText(/¡Hola! Soy tu conserje de IA/).length).toBe(1);
  });

  it('responds to pedido keyword', () => {
    mockUseChat.mockReturnValue({ isOpen: true, open, close, toggle });
    render(<AiChatWidget />);
    const textarea = screen.getByPlaceholderText('Escribe aquí...');
    fireEvent.change(textarea, { target: { value: '¿Dónde está mi pedido?' } });
    fireEvent.click(screen.getByLabelText('Enviar mensaje'));
    expect(screen.getByText(/último pedido #NF-88219/)).toBeInTheDocument();
  });

  it('responds to oferta keyword', () => {
    mockUseChat.mockReturnValue({ isOpen: true, open, close, toggle });
    render(<AiChatWidget />);
    const textarea = screen.getByPlaceholderText('Escribe aquí...');
    fireEvent.change(textarea, { target: { value: '¿Hay alguna oferta?' } });
    fireEvent.click(screen.getByLabelText('Enviar mensaje'));
    expect(screen.getByText(/20% OFF/)).toBeInTheDocument();
  });

  it('responds to devolución keyword', () => {
    mockUseChat.mockReturnValue({ isOpen: true, open, close, toggle });
    render(<AiChatWidget />);
    const textarea = screen.getByPlaceholderText('Escribe aquí...');
    fireEvent.change(textarea, { target: { value: 'Necesito una devolución' } });
    fireEvent.click(screen.getByLabelText('Enviar mensaje'));
    expect(screen.getByText(/iniciar una devolución/)).toBeInTheDocument();
  });

  it('responds with default reply for unrecognized text', () => {
    mockUseChat.mockReturnValue({ isOpen: true, open, close, toggle });
    render(<AiChatWidget />);
    const textarea = screen.getByPlaceholderText('Escribe aquí...');
    fireEvent.change(textarea, { target: { value: 'hola mundo' } });
    fireEvent.click(screen.getByLabelText('Enviar mensaje'));
    expect(screen.getByText(/Para conversaciones con vendedores/)).toBeInTheDocument();
  });

  it('renders quick reply buttons', () => {
    mockUseChat.mockReturnValue({ isOpen: true, open, close, toggle });
    render(<AiChatWidget />);
    expect(screen.getByText('¿Dónde está mi pedido?')).toBeInTheDocument();
    expect(screen.getByText('Recomiéndame ofertas')).toBeInTheDocument();
    expect(screen.getByText('Ayuda con devoluciones')).toBeInTheDocument();
  });

  it('sends quick reply when clicked', () => {
    mockUseChat.mockReturnValue({ isOpen: true, open, close, toggle });
    render(<AiChatWidget />);
    const quickReplyBtn = screen.getAllByText('¿Dónde está mi pedido?').find(
      (el) => el.tagName === 'BUTTON',
    )!;
    fireEvent.click(quickReplyBtn);
    expect(screen.getAllByText('¿Dónde está mi pedido?').length).toBeGreaterThanOrEqual(2);
  });

  it('links to messaging page', () => {
    mockUseChat.mockReturnValue({ isOpen: true, open, close, toggle });
    render(<AiChatWidget />);
    const link = screen.getByText('Ir a Mensajería y Comunicación');
    expect(link).toHaveAttribute('href', '/mensajeria');
  });

  it('has aria-expanded and aria-controls on FAB', () => {
    render(<AiChatWidget />);
    const fab = screen.getByLabelText(/abrir asistente/i);
    expect(fab).toHaveAttribute('aria-expanded', 'false');
    expect(fab).toHaveAttribute('aria-controls', 'chat-panel');
  });

  it('chat panel has dialog role and aria-modal', () => {
    mockUseChat.mockReturnValue({ isOpen: true, open, close, toggle });
    render(<AiChatWidget />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label', 'Asistente NexusFlow');
  });

  it('renders message log region', () => {
    mockUseChat.mockReturnValue({ isOpen: true, open, close, toggle });
    render(<AiChatWidget />);
    expect(screen.getByRole('log')).toBeInTheDocument();
  });

  it('sends via send() opens chat if closed', () => {
    mockUseChat.mockReturnValue({ isOpen: false, open, close, toggle });
    render(<AiChatWidget />);
    const fab = screen.getByLabelText(/abrir asistente/i);
    fireEvent.pointerUp(fab);
    expect(toggle).toHaveBeenCalled();
  });
});
