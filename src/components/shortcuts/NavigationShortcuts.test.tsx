import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NavigationShortcuts } from './NavigationShortcuts';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as any,
    useNavigate: () => mockNavigate,
  };
});

describe('NavigationShortcuts', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders null', () => {
    const { container } = render(
      <MemoryRouter>
        <NavigationShortcuts />
      </MemoryRouter>,
    );
    expect(container.innerHTML).toBe('');
  });

  it('navigates to home on Alt+1', () => {
    render(<MemoryRouter><NavigationShortcuts /></MemoryRouter>);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: '1', altKey: true }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates to shop on Alt+2', () => {
    render(<MemoryRouter><NavigationShortcuts /></MemoryRouter>);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: '2', altKey: true }));
    expect(mockNavigate).toHaveBeenCalledWith('/tienda');
  });

  it('navigates back on Alt+B', () => {
    render(<MemoryRouter><NavigationShortcuts /></MemoryRouter>);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', altKey: true }));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('focuses search input on Alt+S', () => {
    const searchInput = document.createElement('input');
    searchInput.id = 'main-search';
    document.body.appendChild(searchInput);
    const focusSpy = vi.spyOn(searchInput, 'focus');
    render(<MemoryRouter><NavigationShortcuts /></MemoryRouter>);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 's', altKey: true }));
    expect(focusSpy).toHaveBeenCalled();
    document.body.removeChild(searchInput);
  });

  it('does not trigger when alt is not pressed', () => {
    render(<MemoryRouter><NavigationShortcuts /></MemoryRouter>);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: '1' }));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('does not trigger in editable targets', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    render(<MemoryRouter><NavigationShortcuts /></MemoryRouter>);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: '1', altKey: true }));
    expect(mockNavigate).not.toHaveBeenCalled();
    document.body.removeChild(input);
  });
});
