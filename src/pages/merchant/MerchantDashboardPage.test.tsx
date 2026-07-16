import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MerchantDashboardPage } from './MerchantDashboardPage';

vi.mock('@/shared/ui/Icon', () => ({ Icon: (props: any) => <span data-icon={props.name} /> }));
vi.mock('@/shared/data/merchantMock', () => ({
  merchantMetrics: [
    { label: 'Ingresos', value: '$100', delta: '+10%', up: true, icon: 'payments', iconBg: 'bg-primary' },
  ],
  merchantOrders: [{ id: '001', customer: 'Ana', customerInitials: 'A', product: 'Widget', amount: 50, status: 'shipped' }],
  lowStockItems: [{ name: 'Cable', stock: 3, image: '', icon: 'cable' }],
  merchantAiTips: [{ tag: 'Stock', title: 'Reponer', body: 'Revisa inventario', action: 'Ver más' }],
  merchantOrderStatus: {
    shipped: { label: 'Enviado', className: 'bg-green' },
    processing: { label: 'Procesando', className: 'bg-blue' },
    pending: { label: 'Pendiente', className: 'bg-yellow' },
  },
}));

describe('MerchantDashboardPage', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><MerchantDashboardPage /></MemoryRouter>);
  });

  it('displays sales analytics heading', () => {
    render(<MemoryRouter><MerchantDashboardPage /></MemoryRouter>);
    expect(screen.getByText('Analíticas de Ventas')).toBeInTheDocument();
  });

  it('displays recent orders heading', () => {
    render(<MemoryRouter><MerchantDashboardPage /></MemoryRouter>);
    expect(screen.getByText('Pedidos Recientes')).toBeInTheDocument();
  });
});
