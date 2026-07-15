import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CategoriesPage } from './CategoriesPage';

const { mockUseCategorias } = vi.hoisted(() => ({
  mockUseCategorias: vi.fn(),
}));

vi.mock('@/shared/hooks/useCategorias', () => ({
  useCategorias: () => mockUseCategorias(),
}));

vi.mock('@/shared/ui/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid="icon">{name}</span>,
}));

describe('CategoriesPage', () => {
  it('shows loading state', () => {
    mockUseCategorias.mockReturnValue({ categories: [], loading: true, error: null });
    render(
      <MemoryRouter>
        <CategoriesPage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Cargando categorías/)).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseCategorias.mockReturnValue({ categories: [], loading: false, error: 'fail' });
    render(
      <MemoryRouter>
        <CategoriesPage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/No se pudieron cargar las categorías/)).toBeInTheDocument();
  });

  it('renders categories', () => {
    mockUseCategorias.mockReturnValue({
      categories: [
        { id: 'tech', label: 'Tech', icon: 'laptop_mac' },
        { id: 'home', label: 'Home', icon: 'home' },
      ],
      loading: false,
      error: null,
    });
    render(
      <MemoryRouter>
        <CategoriesPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Categorías')).toBeInTheDocument();
    expect(screen.getByText('Tech')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
});
