import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomeHero } from './home-hero';

describe('HomeHero', () => {
  it('renders the hero title', () => {
    render(<HomeHero />);
    expect(screen.getByText(/Ecommerce modular, limpio y listo para crecer/i)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<HomeHero />);
    expect(screen.getByText('NexusFlow')).toBeInTheDocument();
    expect(screen.getByText('Capas')).toBeInTheDocument();
    expect(screen.getByText('Flujo')).toBeInTheDocument();
  });
});
