import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CouponsPage } from './CouponsPage';

const mocks = vi.hoisted(() => ({
  mockUseCountdown: vi.fn(),
}));

vi.mock('@/shared/hooks/useCountdown', () => ({ useCountdown: () => mocks.mockUseCountdown() }));
vi.mock('@/shared/ui/Icon', () => ({ Icon: (props: any) => <span data-icon={props.name} /> }));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, Link: ({ children, to, ...p }: any) => <a href={to} {...p}>{children}</a> };
});

describe('CouponsPage', () => {
  beforeEach(() => {
    mocks.mockUseCountdown.mockReturnValue({
      hours: 2, minutes: 45, secs: 12, pad: (n: number) => n.toString().padStart(2, '0'),
      total: 9912, paused: false, togglePause: vi.fn(),
    });
  });

  it('renders benefits center heading', () => {
    render(<MemoryRouter><CouponsPage /></MemoryRouter>);
    expect(screen.getByText('Centro de Beneficios NexusFlow')).toBeInTheDocument();
  });

  it('renders AI suggestions', () => {
    render(<MemoryRouter><CouponsPage /></MemoryRouter>);
    expect(screen.getByText('Sugerencias IA para ti')).toBeInTheDocument();
    expect(screen.getByText('20% OFF en Accesorios')).toBeInTheDocument();
  });

  it('renders flash sale countdown', () => {
    render(<MemoryRouter><CouponsPage /></MemoryRouter>);
    expect(screen.getByText('Ofertas Flash')).toBeInTheDocument();
    expect(screen.getByText('40% OFF')).toBeInTheDocument();
  });

  it('renders available coupons', () => {
    render(<MemoryRouter><CouponsPage /></MemoryRouter>);
    expect(screen.getByText('Cupones Disponibles')).toBeInTheDocument();
  });
});
