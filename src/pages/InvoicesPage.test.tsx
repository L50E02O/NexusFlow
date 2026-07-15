import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { InvoicesPage } from './InvoicesPage';

vi.mock('@/shared/ui/Icon', () => ({ Icon: (props: any) => <span data-icon={props.name} /> }));

describe('InvoicesPage', () => {
  it('renders page heading', () => {
    render(<MemoryRouter><InvoicesPage /></MemoryRouter>);
    expect(screen.getByText('Facturas y Pagos')).toBeInTheDocument();
  });

  it('renders summary cards', () => {
    render(<MemoryRouter><InvoicesPage /></MemoryRouter>);
    expect(screen.getByText('Total pagado este mes')).toBeInTheDocument();
    expect(screen.getByText('Pagos pendientes')).toBeInTheDocument();
    expect(screen.getByText('Método predeterminado')).toBeInTheDocument();
  });

  it('renders payment history table', () => {
    render(<MemoryRouter><InvoicesPage /></MemoryRouter>);
    expect(screen.getByText('Historial de pagos')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ID de factura...')).toBeInTheDocument();
  });

  it('renders invoice rows', () => {
    render(<MemoryRouter><InvoicesPage /></MemoryRouter>);
    expect(screen.getAllByText('Completado').length).toBeGreaterThanOrEqual(1);
  });
});
