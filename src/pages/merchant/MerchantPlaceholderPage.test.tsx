import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MerchantPlaceholderPage } from './MerchantPlaceholderPage';

vi.mock('@/shared/ui/Icon', () => ({ Icon: (props: any) => <span data-icon={props.name} /> }));

describe('MerchantPlaceholderPage', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><MerchantPlaceholderPage /></MemoryRouter>);
  });

  it('shows default title for unknown segment', () => {
    render(
      <MemoryRouter initialEntries={['/merchant/unknown']}>
        <MerchantPlaceholderPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Módulo Comerciante')).toBeInTheDocument();
  });

  it('shows mapped title for known segment', () => {
    render(
      <MemoryRouter initialEntries={['/merchant/seguridad']}>
        <MerchantPlaceholderPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Seguridad y Detección de Fraude')).toBeInTheDocument();
  });
});
