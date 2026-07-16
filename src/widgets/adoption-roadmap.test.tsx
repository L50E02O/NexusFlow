import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdoptionRoadmap } from './adoption-roadmap';

describe('AdoptionRoadmap', () => {
  it('renders the section heading', () => {
    render(<AdoptionRoadmap />);
    expect(screen.getByText(/Cómo mantener la plantilla sin perder tus avances/i)).toBeInTheDocument();
  });

  it('renders roadmap steps', () => {
    render(<AdoptionRoadmap />);
    expect(screen.getByText(/Repositorio y base visual/i)).toBeInTheDocument();
    expect(screen.getByText(/Capas funcionales/i)).toBeInTheDocument();
    expect(screen.getByText(/Evolución segura/i)).toBeInTheDocument();
  });
});
