import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PlaceholderPage } from './PlaceholderPage';

describe('PlaceholderPage', () => {
  it('renders title and description', () => {
    render(
      <MemoryRouter>
        <PlaceholderPage title="Test Title" description="Test Description" />
      </MemoryRouter>,
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders default description when none provided', () => {
    render(
      <MemoryRouter>
        <PlaceholderPage title="Only Title" />
      </MemoryRouter>,
    );
    expect(screen.getByText('Only Title')).toBeInTheDocument();
    expect(screen.getByText(/en desarrollo/)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(
      <MemoryRouter>
        <PlaceholderPage title="T" />
      </MemoryRouter>,
    );
    expect(screen.getByText('Ir al inicio')).toBeInTheDocument();
    expect(screen.getByText('Ver tienda')).toBeInTheDocument();
  });
});
