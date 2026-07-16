import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { OffersPage } from './OffersPage';

const { mockUseCountdown } = vi.hoisted(() => ({
  mockUseCountdown: vi.fn(),
}));

vi.mock('@/shared/hooks/useCountdown', () => ({
  useCountdown: () => mockUseCountdown(),
}));

vi.mock('@/shared/ui/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid="icon">{name}</span>,
}));

vi.mock('@/shared/data/mock', async (importOriginal) => {
  const orig = await importOriginal<typeof import('@/shared/data/mock')>();
  return { ...orig, formatPrice: (v: number) => `$${v}` };
});

describe('OffersPage', () => {
  beforeEach(() => {
    mockUseCountdown.mockReturnValue({
      hours: 0,
      minutes: 45,
      secs: 12,
      pad: (n: number) => n.toString().padStart(2, '0'),
      paused: false,
      togglePause: vi.fn(),
    });
  });

  it('renders the page heading', () => {
    render(
      <MemoryRouter>
        <OffersPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Ofertas Diseñadas para Ti')).toBeInTheDocument();
  });

  it('renders AI suggestions section', () => {
    render(
      <MemoryRouter>
        <OffersPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Sugerencias IA')).toBeInTheDocument();
    expect(screen.getByText('Nexus Audio Pro')).toBeInTheDocument();
    expect(screen.getByText('Nexus Watch Series')).toBeInTheDocument();
  });

  it('renders flash deals section', () => {
    render(
      <MemoryRouter>
        <OffersPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Ofertas Relámpago')).toBeInTheDocument();
    expect(screen.getByText('Reloj Minimalist Q2')).toBeInTheDocument();
    expect(screen.getByText('Cámara Retro Nexus')).toBeInTheDocument();
  });

  it('renders promo categories', () => {
    render(
      <MemoryRouter>
        <OffersPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Categorías en Promoción')).toBeInTheDocument();
    expect(screen.getByText('Tecnología')).toBeInTheDocument();
    expect(screen.getByText('Hogar')).toBeInTheDocument();
    expect(screen.getByText('Sostenibilidad')).toBeInTheDocument();
  });

  it('renders loyalty section', () => {
    render(
      <MemoryRouter>
        <OffersPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Tu Fidelidad Premia')).toBeInTheDocument();
    expect(screen.getByText(/2,450 puntos/)).toBeInTheDocument();
  });
});
