import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Icon } from './Icon';

describe('Icon', () => {
  it('renders with name', () => {
    render(<Icon name="home" />);
    expect(screen.getByText('home')).toBeInTheDocument();
  });

  it('applies className', () => {
    const { container } = render(<Icon name="home" className="text-primary" />);
    expect(container.firstChild).toHaveClass('text-primary');
  });

  it('adds filled class when filled is true', () => {
    const { container } = render(<Icon name="home" filled />);
    expect(container.firstChild).toHaveClass('filled');
  });

  it('sets aria-hidden true when no aria-label', () => {
    render(<Icon name="home" />);
    expect(screen.getByText('home')).toHaveAttribute('aria-hidden', 'true');
  });

  it('sets aria-hidden false when aria-label provided', () => {
    render(<Icon name="home" aria-label="Inicio" />);
    expect(screen.getByText('home')).toHaveAttribute('aria-hidden', 'false');
  });

  it('sets role img when aria-label provided', () => {
    render(<Icon name="home" aria-label="Inicio" />);
    expect(screen.getByText('home')).toHaveAttribute('role', 'img');
  });

  it('uses provided role over default', () => {
    render(<Icon name="home" role="presentation" />);
    expect(screen.getByText('home')).toHaveAttribute('role', 'presentation');
  });
});
