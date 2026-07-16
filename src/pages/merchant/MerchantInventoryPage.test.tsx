import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MerchantInventoryPage } from './MerchantInventoryPage';

vi.mock('@/shared/ui/Icon', () => ({ Icon: (props: any) => <span data-icon={props.name} /> }));
vi.mock('@/shared/data/merchantMock', () => ({
  inventorySummary: [
    { label: 'Total', value: '500', note: 'unidades', icon: 'inventory', iconBg: 'bg-primary' },
  ],
  inventoryProducts: [
    { sku: 'SKU-001', name: 'Monitor', icon: 'monitor', category: 'Electrónica', stock: 25, price: '$300', status: 'ok' },
  ],
  lowStockItems: [{ name: 'Cable USB', stock: 2 }],
}));

describe('MerchantInventoryPage', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><MerchantInventoryPage /></MemoryRouter>);
  });

  it('displays the inventory management heading', () => {
    render(<MemoryRouter><MerchantInventoryPage /></MemoryRouter>);
    expect(screen.getByText('Gestión de Inventario')).toBeInTheDocument();
  });

  it('displays the product list heading', () => {
    render(<MemoryRouter><MerchantInventoryPage /></MemoryRouter>);
    expect(screen.getByText('Lista de Productos')).toBeInTheDocument();
  });
});
