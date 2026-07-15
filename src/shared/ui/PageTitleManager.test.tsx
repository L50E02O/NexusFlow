import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const { mockUsePageTitle } = vi.hoisted(() => ({
  mockUsePageTitle: vi.fn(),
}));

vi.mock('@/shared/hooks/usePageTitle', () => ({
  usePageTitle: mockUsePageTitle,
}));

import { PageTitleManager } from './PageTitleManager';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <PageTitleManager />
    </MemoryRouter>,
  );
}

describe('PageTitleManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders null', () => {
    const { container } = renderAt('/');
    expect(container.innerHTML).toBe('');
  });

  it('calls usePageTitle with "Inicio" for /', () => {
    renderAt('/');
    expect(mockUsePageTitle).toHaveBeenCalledWith('Inicio');
  });

  it('calls usePageTitle with "Tienda" for /tienda', () => {
    renderAt('/tienda');
    expect(mockUsePageTitle).toHaveBeenCalledWith('Tienda');
  });

  it('calls usePageTitle with "Categorías" for /categorias', () => {
    renderAt('/categorias');
    expect(mockUsePageTitle).toHaveBeenCalledWith('Categorías');
  });

  it('calls usePageTitle with "Mi perfil" for /perfil', () => {
    renderAt('/perfil');
    expect(mockUsePageTitle).toHaveBeenCalledWith('Mi perfil');
  });

  it('calls usePageTitle with "Panel comerciante" for /merchant', () => {
    renderAt('/merchant');
    expect(mockUsePageTitle).toHaveBeenCalledWith('Panel comerciante');
  });

  it('calls usePageTitle with "Inventario" for /merchant/inventario', () => {
    renderAt('/merchant/inventario');
    expect(mockUsePageTitle).toHaveBeenCalledWith('Inventario');
  });

  it('falls back to "NexusFlow" for unknown routes', () => {
    renderAt('/unknown-route');
    expect(mockUsePageTitle).toHaveBeenCalledWith('NexusFlow');
  });

  it('falls back to "NexusFlow" for deep unknown routes', () => {
    renderAt('/some/deep/unknown');
    expect(mockUsePageTitle).toHaveBeenCalledWith('NexusFlow');
  });
});
