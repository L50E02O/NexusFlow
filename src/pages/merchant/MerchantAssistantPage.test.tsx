import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MerchantAssistantPage } from './MerchantAssistantPage';

vi.mock('@/shared/ui/Icon', () => ({ Icon: (props: any) => <span data-icon={props.name} /> }));
vi.mock('@/shared/data/merchantMock', () => ({
  assistantMessages: [
    { role: 'assistant', text: 'Hola, soy tu asistente', time: '10:00', stats: { sales: '$1k', orders: 12 } },
    { role: 'user', text: 'Hola', time: '10:01' },
  ],
  assistantSuggestions: ['¿Cómo va el inventario?', 'Revisar pedidos'],
  assistantInsights: [
    { title: 'Ticket promedio', value: '$85', note: 'Estable', action: null },
    { title: 'Stock bajo', value: '3', note: 'Reponer', action: 'Revisar Stock' },
  ],
}));

describe('MerchantAssistantPage', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><MerchantAssistantPage /></MemoryRouter>);
  });

  it('displays the assistant heading', () => {
    render(<MemoryRouter><MerchantAssistantPage /></MemoryRouter>);
    expect(screen.getByText('Asistente IA NexusFlow')).toBeInTheDocument();
  });

  it('displays the business intelligence heading', () => {
    render(<MemoryRouter><MerchantAssistantPage /></MemoryRouter>);
    expect(screen.getByText('Inteligencia de Negocio')).toBeInTheDocument();
  });

  it('displays initial assistant messages', () => {
    render(<MemoryRouter><MerchantAssistantPage /></MemoryRouter>);
    expect(screen.getByText('Hola, soy tu asistente')).toBeInTheDocument();
  });

  it('displays assistant stats', () => {
    render(<MemoryRouter><MerchantAssistantPage /></MemoryRouter>);
    expect(screen.getByText('$1k')).toBeInTheDocument();
    expect(screen.getByText(12)).toBeInTheDocument();
  });

  it('renders suggestion buttons', () => {
    render(<MemoryRouter><MerchantAssistantPage /></MemoryRouter>);
    expect(screen.getByText('¿Cómo va el inventario?')).toBeInTheDocument();
    expect(screen.getByText('Revisar pedidos')).toBeInTheDocument();
  });

  it('populates input when suggestion clicked', () => {
    render(<MemoryRouter><MerchantAssistantPage /></MemoryRouter>);
    fireEvent.click(screen.getByText('¿Cómo va el inventario?'));
    const input = screen.getByPlaceholderText(/Escribe un mensaje/);
    expect(input).toHaveValue('¿Cómo va el inventario?');
  });

  it('renders business insights', () => {
    render(<MemoryRouter><MerchantAssistantPage /></MemoryRouter>);
    expect(screen.getByText('Ticket promedio')).toBeInTheDocument();
    expect(screen.getByText('$85')).toBeInTheDocument();
    expect(screen.getByText('Stock bajo')).toBeInTheDocument();
    expect(screen.getByText('Reponer')).toBeInTheDocument();
  });

  it('renders insight action button', () => {
    render(<MemoryRouter><MerchantAssistantPage /></MemoryRouter>);
    expect(screen.getByText('Revisar Stock')).toBeInTheDocument();
  });

  it('renders online status', () => {
    render(<MemoryRouter><MerchantAssistantPage /></MemoryRouter>);
    expect(screen.getByText('En línea')).toBeInTheDocument();
  });

  it('renders bundle suggestion', () => {
    render(<MemoryRouter><MerchantAssistantPage /></MemoryRouter>);
    expect(screen.getByText(/Bundle/)).toBeInTheDocument();
  });

  it('sends message on send button click', () => {
    render(<MemoryRouter><MerchantAssistantPage /></MemoryRouter>);
    const input = screen.getByPlaceholderText(/Escribe un mensaje/);
    fireEvent.change(input, { target: { value: 'Hola asistente' } });
    fireEvent.click(screen.getByLabelText('Enviar'));
    expect(screen.getByText('Hola asistente')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('does not send empty message', () => {
    render(<MemoryRouter><MerchantAssistantPage /></MemoryRouter>);
    fireEvent.click(screen.getByLabelText('Enviar'));
    expect(screen.queryByText('Gracias por tu consulta')).not.toBeInTheDocument();
  });

  it('renders assistant reply after sending message', () => {
    render(<MemoryRouter><MerchantAssistantPage /></MemoryRouter>);
    const input = screen.getByPlaceholderText(/Escribe un mensaje/);
    fireEvent.change(input, { target: { value: '¿Cuál es el stock?' } });
    fireEvent.click(screen.getByLabelText('Enviar'));
    expect(screen.getByText(/Gracias por tu consulta/)).toBeInTheDocument();
  });

  it('renders merchant avatar', () => {
    render(<MemoryRouter><MerchantAssistantPage /></MemoryRouter>);
    expect(screen.getByAltText('Avatar del comerciante')).toBeInTheDocument();
  });
});
