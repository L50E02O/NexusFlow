import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SustainabilityPage } from './SustainabilityPage';

vi.mock('@/shared/ui/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid="icon">{name}</span>,
}));

describe('SustainabilityPage', () => {
  it('renders the page heading', () => {
    render(
      <MemoryRouter>
        <SustainabilityPage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Compromiso con la sostenibilidad/)).toBeInTheDocument();
  });

  it('renders all four pillars', () => {
    render(
      <MemoryRouter>
        <SustainabilityPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Materiales responsables')).toBeInTheDocument();
    expect(screen.getByText('Economía circular')).toBeInTheDocument();
    expect(screen.getByText('Logística eficiente')).toBeInTheDocument();
    expect(screen.getByText('Impacto social')).toBeInTheDocument();
  });

  it('renders footer links', () => {
    render(
      <MemoryRouter>
        <SustainabilityPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Ver políticas')).toBeInTheDocument();
    expect(screen.getByText('Centro de soporte')).toBeInTheDocument();
    expect(screen.getByText('Explorar productos sostenibles')).toBeInTheDocument();
  });

  it('renders an Icon for each pillar', () => {
    render(
      <MemoryRouter>
        <SustainabilityPage />
      </MemoryRouter>,
    );
    expect(screen.getAllByTestId('icon')).toHaveLength(4);
  });
});
