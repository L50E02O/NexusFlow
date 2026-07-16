import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Breadcrumbs } from './Breadcrumbs';

function renderWithRouter(pathname: string) {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <Breadcrumbs />
    </MemoryRouter>,
  );
}

describe('Breadcrumbs', () => {
  it('renders nothing on root path', () => {
    const { container } = renderWithRouter('/');
    expect(container.firstChild).toBeNull();
  });

  it('renders breadcrumbs for a single segment', () => {
    renderWithRouter('/tienda');
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Tienda')).toBeInTheDocument();
  });

  it('marks the last crumb with aria-current', () => {
    renderWithRouter('/tienda');
    const last = screen.getByText('Tienda');
    expect(last).toHaveAttribute('aria-current', 'page');
  });

  it('renders navigation with aria-label', () => {
    renderWithRouter('/tienda');
    expect(screen.getByRole('navigation', { name: 'Migas de pan' })).toBeInTheDocument();
  });

  it('shows multiple segments', () => {
    renderWithRouter('/merchant/productos');
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Portal comerciante')).toBeInTheDocument();
    expect(screen.getByText('Productos')).toBeInTheDocument();
  });
});
