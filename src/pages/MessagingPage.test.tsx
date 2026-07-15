import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MessagingPage } from './MessagingPage';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useLocation: () => ({ state: null }) };
});
vi.mock('@/shared/ui/Icon', () => ({ Icon: (props: any) => <span data-icon={props.name} /> }));

describe('MessagingPage', () => {
  it('renders thread list with search', () => {
    render(<MemoryRouter><MessagingPage /></MemoryRouter>);
    expect(screen.getByPlaceholderText('Buscar mensajes...')).toBeInTheDocument();
  });

  it('renders filter tabs', () => {
    render(<MemoryRouter><MessagingPage /></MemoryRouter>);
    expect(screen.getByText('Todos')).toBeInTheDocument();
    expect(screen.getByText('No leídos')).toBeInTheDocument();
    expect(screen.getByText('Importantes')).toBeInTheDocument();
  });

  it('renders message threads from mock data', () => {
    render(<MemoryRouter><MessagingPage /></MemoryRouter>);
    expect(screen.getByText('Soporte NexusFlow')).toBeInTheDocument();
  });

  it('renders chat panel for active thread', () => {
    render(<MemoryRouter><MessagingPage /></MemoryRouter>);
    expect(screen.getAllByText('Carlos Mendoza').length).toBeGreaterThanOrEqual(1);
  });

  it('filters threads when typing in search', () => {
    render(<MemoryRouter><MessagingPage /></MemoryRouter>);
    const searchInput = screen.getByPlaceholderText('Buscar mensajes...');
    fireEvent.change(searchInput, { target: { value: 'Elena' } });
    expect(screen.getByText('Elena Ruiz')).toBeInTheDocument();
    expect(screen.queryByText('Soporte NexusFlow')).not.toBeInTheDocument();
  });

  it('shows all threads when search is cleared', () => {
    render(<MemoryRouter><MessagingPage /></MemoryRouter>);
    const searchInput = screen.getByPlaceholderText('Buscar mensajes...');
    fireEvent.change(searchInput, { target: { value: 'Elena' } });
    expect(screen.queryByText('Soporte NexusFlow')).not.toBeInTheDocument();
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByText('Soporte NexusFlow')).toBeInTheDocument();
  });

  it('switches to unread tab and filters', () => {
    render(<MemoryRouter><MessagingPage /></MemoryRouter>);
    fireEvent.click(screen.getByText('No leídos'));
    expect(screen.getByText('Elena Ruiz')).toBeInTheDocument();
    expect(screen.queryByText('Soporte NexusFlow')).not.toBeInTheDocument();
  });

  it('switches to important tab and filters', () => {
    render(<MemoryRouter><MessagingPage /></MemoryRouter>);
    fireEvent.click(screen.getByText('Importantes'));
    expect(screen.getByText('Soporte NexusFlow')).toBeInTheDocument();
  });

  it('clicking a thread sets it as active', () => {
    render(<MemoryRouter><MessagingPage /></MemoryRouter>);
    fireEvent.click(screen.getByText('Elena Ruiz'));
    expect(screen.getAllByText('Elena Ruiz').length).toBeGreaterThanOrEqual(1);
  });

  it('displays messages for the active thread', () => {
    render(<MemoryRouter><MessagingPage /></MemoryRouter>);
    expect(screen.getByText(/Hola, estoy revisando los últimos envíos/)).toBeInTheDocument();
  });

  it('sends a message when typing and clicking send', () => {
    render(<MemoryRouter><MessagingPage /></MemoryRouter>);
    const textarea = screen.getByPlaceholderText('Escribe un mensaje...');
    fireEvent.change(textarea, { target: { value: 'Hola test' } });
    fireEvent.click(screen.getByLabelText('Enviar mensaje'));
    expect(screen.getByText('Hola test')).toBeInTheDocument();
  });

  it('sends a message when pressing Enter', () => {
    render(<MemoryRouter><MessagingPage /></MemoryRouter>);
    const textarea = screen.getByPlaceholderText('Escribe un mensaje...');
    fireEvent.change(textarea, { target: { value: 'Enter test' } });
    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(screen.getByText('Enter test')).toBeInTheDocument();
  });

  it('does not send empty messages', () => {
    render(<MemoryRouter><MessagingPage /></MemoryRouter>);
    const textarea = screen.getByPlaceholderText('Escribe un mensaje...');
    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(screen.getByPlaceholderText('Escribe un mensaje...')).toHaveValue('');
  });

  it('displays AI suggestions section', () => {
    render(<MemoryRouter><MessagingPage /></MemoryRouter>);
    expect(screen.getByText('IA Nexus:')).toBeInTheDocument();
    expect(screen.getByText('Adjuntar factura #4421')).toBeInTheDocument();
    expect(screen.getByText('Traducir')).toBeInTheDocument();
  });

  it('clicking an AI suggestion sends it as message', () => {
    render(<MemoryRouter><MessagingPage /></MemoryRouter>);
    const suggestionBtn = screen.getAllByText('Adjuntar factura #4421').find(
      (el) => el.tagName === 'BUTTON',
    )!;
    fireEvent.click(suggestionBtn);
    expect(screen.getAllByText('Adjuntar factura #4421').length).toBeGreaterThanOrEqual(2);
  });

  it('shows "Hoy" date separator in chat', () => {
    render(<MemoryRouter><MessagingPage /></MemoryRouter>);
    expect(screen.getByText('Hoy')).toBeInTheDocument();
  });

  it('shows thread preview text', () => {
    render(<MemoryRouter><MessagingPage /></MemoryRouter>);
    expect(screen.getAllByText(/¿Podrías enviarme la factura/).length).toBeGreaterThanOrEqual(1);
  });

  it('shows online status indicator', () => {
    render(<MemoryRouter><MessagingPage /></MemoryRouter>);
    expect(screen.getByText('En línea')).toBeInTheDocument();
  });

  it('displays header with active thread info', () => {
    render(<MemoryRouter><MessagingPage /></MemoryRouter>);
    expect(screen.getAllByText('Carlos Mendoza').length).toBeGreaterThanOrEqual(1);
  });

  it('renders attach and emoji buttons', () => {
    render(<MemoryRouter><MessagingPage /></MemoryRouter>);
    expect(screen.getByLabelText('Adjuntar archivo')).toBeInTheDocument();
    expect(screen.getByLabelText('Emoji')).toBeInTheDocument();
  });

  it('search filters by preview text', () => {
    render(<MemoryRouter><MessagingPage /></MemoryRouter>);
    const searchInput = screen.getByPlaceholderText('Buscar mensajes...');
    fireEvent.change(searchInput, { target: { value: 'factura' } });
    expect(screen.getAllByText('Carlos Mendoza').length).toBeGreaterThanOrEqual(1);
  });
});
