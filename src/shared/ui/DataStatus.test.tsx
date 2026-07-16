import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataStatus } from './DataStatus';

describe('DataStatus', () => {
  it('shows loading state', () => {
    render(<DataStatus loading={true} error={null} children={<div>content</div>} />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    render(<DataStatus loading={false} error="Something went wrong" children={<div>content</div>} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
  });

  it('shows empty state with default message', () => {
    render(<DataStatus loading={false} error={null} isEmpty={true} children={<div>content</div>} />);
    expect(screen.getByText('No hay datos disponibles.')).toBeInTheDocument();
  });

  it('shows empty state with custom message', () => {
    render(
      <DataStatus loading={false} error={null} isEmpty={true} emptyMessage="Sin resultados" children={<div>content</div>} />,
    );
    expect(screen.getByText('Sin resultados')).toBeInTheDocument();
  });

  it('renders children when not loading/error/empty', () => {
    render(<DataStatus loading={false} error={null} children={<div>content</div>} />);
    expect(screen.getByText('content')).toBeInTheDocument();
  });
});
