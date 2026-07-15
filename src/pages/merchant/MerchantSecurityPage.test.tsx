import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MerchantSecurityPage } from './MerchantSecurityPage';

vi.mock('@/shared/ui/Icon', () => ({ Icon: (props: any) => <span data-icon={props.name} /> }));
vi.mock('@/shared/data/merchantMock', () => ({
  securitySummary: [
    { label: 'Amenazas', value: '3', delta: '-20%', up: false, stable: false },
  ],
  securityLogs: [
    { event: 'Login', user: 'admin', location: 'CDMX', time: '10:30', ok: true },
  ],
}));

describe('MerchantSecurityPage', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><MerchantSecurityPage /></MemoryRouter>);
  });

  it('displays the security heading', () => {
    render(<MemoryRouter><MerchantSecurityPage /></MemoryRouter>);
    expect(screen.getByText('Seguridad y Detección de Fraude')).toBeInTheDocument();
  });

  it('displays the system logs heading', () => {
    render(<MemoryRouter><MerchantSecurityPage /></MemoryRouter>);
    expect(screen.getByText('Registros del Sistema')).toBeInTheDocument();
  });
});
