import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MerchantReportsPage } from './MerchantReportsPage';

vi.mock('@/shared/ui/Icon', () => ({ Icon: (props: any) => <span data-icon={props.name} /> }));
vi.mock('@/shared/data/merchantMock', () => ({
  reportKpis: [
    { label: 'Ventas', value: '$10k', delta: '+5%', up: true, icon: 'payments' },
  ],
}));

describe('MerchantReportsPage', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><MerchantReportsPage /></MemoryRouter>);
  });

  it('displays the reports heading', () => {
    render(<MemoryRouter><MerchantReportsPage /></MemoryRouter>);
    expect(screen.getByText('Reportes y Analíticas')).toBeInTheDocument();
  });

  it('displays the top-selling products section', () => {
    render(<MemoryRouter><MerchantReportsPage /></MemoryRouter>);
    expect(screen.getByText('Productos más vendidos')).toBeInTheDocument();
  });
});
