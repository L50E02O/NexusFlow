import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotificationsPage } from './NotificationsPage';

vi.mock('@/shared/ui/Icon', () => ({ Icon: (props: any) => <span data-icon={props.name} /> }));

describe('NotificationsPage', () => {
  it('renders page heading', () => {
    render(<MemoryRouter><NotificationsPage /></MemoryRouter>);
    expect(screen.getByText('Centro de Notificaciones')).toBeInTheDocument();
  });

  it('renders filter tabs', () => {
    render(<MemoryRouter><NotificationsPage /></MemoryRouter>);
    expect(screen.getByText('Todas')).toBeInTheDocument();
    expect(screen.getByText('Pedidos')).toBeInTheDocument();
    expect(screen.getByText('Promociones')).toBeInTheDocument();
    expect(screen.getByText('Seguridad')).toBeInTheDocument();
  });

  it('renders notification cards', () => {
    render(<MemoryRouter><NotificationsPage /></MemoryRouter>);
    expect(screen.getByText('Rastrear pedido')).toBeInTheDocument();
  });

  it('renders AI suggestions sidebar', () => {
    render(<MemoryRouter><NotificationsPage /></MemoryRouter>);
    expect(screen.getByText('Sugerencias IA')).toBeInTheDocument();
  });

  it('renders mark all as read button', () => {
    render(<MemoryRouter><NotificationsPage /></MemoryRouter>);
    expect(screen.getByText('Marcar todas como leídas')).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<MemoryRouter><NotificationsPage /></MemoryRouter>);
    expect(screen.getByPlaceholderText('Filtrar mensajes...')).toBeInTheDocument();
  });

  it('renders order notification with track button', () => {
    render(<MemoryRouter><NotificationsPage /></MemoryRouter>);
    expect(screen.getByText('¡Tu pedido está en camino!')).toBeInTheDocument();
    expect(screen.getByText('Rastrear pedido')).toBeInTheDocument();
  });

  it('renders security notification', () => {
    render(<MemoryRouter><NotificationsPage /></MemoryRouter>);
    expect(screen.getByText('Nuevo inicio de sesión detectado')).toBeInTheDocument();
  });

  it('renders promo notification with product info', () => {
    render(<MemoryRouter><NotificationsPage /></MemoryRouter>);
    expect(screen.getByText('Basado en tus favoritos')).toBeInTheDocument();
    expect(screen.getByText('Nexus Elite Pro')).toBeInTheDocument();
  });

  it('renders payment notification', () => {
    render(<MemoryRouter><NotificationsPage /></MemoryRouter>);
    expect(screen.getByText('Pago confirmado')).toBeInTheDocument();
  });

  it('filters notifications by tab', () => {
    render(<MemoryRouter><NotificationsPage /></MemoryRouter>);
    fireEvent.click(screen.getByText('Pedidos'));
    expect(screen.getByText('¡Tu pedido está en camino!')).toBeInTheDocument();
  });

  it('filters notifications by security tab', () => {
    render(<MemoryRouter><NotificationsPage /></MemoryRouter>);
    fireEvent.click(screen.getByText('Seguridad'));
    expect(screen.getByText('Nuevo inicio de sesión detectado')).toBeInTheDocument();
  });

  it('filters notifications by promos tab', () => {
    render(<MemoryRouter><NotificationsPage /></MemoryRouter>);
    fireEvent.click(screen.getByText('Promociones'));
    expect(screen.getByText('Basado en tus favoritos')).toBeInTheDocument();
  });

  it('renders AI suggestion stock alert', () => {
    render(<MemoryRouter><NotificationsPage /></MemoryRouter>);
    expect(screen.getByText('Alerta de Stock')).toBeInTheDocument();
    expect(screen.getByText(/Soporte Ergonómico M1/)).toBeInTheDocument();
  });

  it('renders see all suggestions button', () => {
    render(<MemoryRouter><NotificationsPage /></MemoryRouter>);
    expect(screen.getByText('Ver todas las sugerencias')).toBeInTheDocument();
  });
});
