import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MerchantReturnsPage } from './MerchantReturnsPage';

vi.mock('@/shared/ui/Icon', () => ({ Icon: (props: any) => <span data-icon={props.name} /> }));
vi.mock('@/shared/data/merchantMock', () => ({
  returnRequests: [
    { id: 'R001', product: 'Laptop', reason: 'Defecto', status: 'pending' },
  ],
  returnStatusLabels: {
    pending: { label: 'Pendiente', className: 'bg-yellow' },
    approved: { label: 'Aprobado', className: 'bg-green' },
    rejected: { label: 'Rechazado', className: 'bg-red' },
  },
}));

describe('MerchantReturnsPage', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><MerchantReturnsPage /></MemoryRouter>);
  });

  it('displays the returns management heading', () => {
    render(<MemoryRouter><MerchantReturnsPage /></MemoryRouter>);
    expect(screen.getByText('Gestión de Devoluciones')).toBeInTheDocument();
  });

  it('displays the recent requests heading', () => {
    render(<MemoryRouter><MerchantReturnsPage /></MemoryRouter>);
    expect(screen.getByText('Solicitudes Recientes')).toBeInTheDocument();
  });
});
