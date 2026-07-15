import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LayerStack } from './layer-stack';

describe('LayerStack', () => {
  it('renders the section heading', () => {
    render(<LayerStack />);
    expect(screen.getByText(/Cada nivel con una responsabilidad clara/i)).toBeInTheDocument();
  });

  it('renders layer cards from data', () => {
    render(<LayerStack />);
    expect(screen.getByText('app')).toBeInTheDocument();
    expect(screen.getByText('pages')).toBeInTheDocument();
    expect(screen.getByText('widgets')).toBeInTheDocument();
    expect(screen.getByText('entities')).toBeInTheDocument();
    expect(screen.getByText('shared')).toBeInTheDocument();
  });
});
