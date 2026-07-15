import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const { mockList } = vi.hoisted(() => ({
  mockList: vi.fn(),
}));

vi.mock('@/entities/categorias/api/categorias.repository', () => ({
  categoriasRepository: { list: mockList },
}));

vi.mock('@/shared/lib/product-mappers', () => ({
  mapCategoriaRowToCategory: (row: any) => ({
    id: row.nombre,
    label: row.nombre.charAt(0).toUpperCase() + row.nombre.slice(1),
    icon: 'category',
  }),
}));

import { useCategorias } from './useCategorias';

describe('useCategorias', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts with loading true and default category', () => {
    mockList.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useCategorias());
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.categories).toEqual([
      { id: 'mas', label: 'Más', icon: 'menu' },
    ]);
  });

  it('returns default category plus mapped data on success', async () => {
    mockList.mockResolvedValue({
      data: [
        { id_categoria: '1', nombre: 'tecnologia', descripcion: null },
        { id_categoria: '2', nombre: 'ropa', descripcion: null },
      ],
      error: null,
    });

    const { result } = renderHook(() => useCategorias());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.categories).toHaveLength(3);
    expect(result.current.categories[0]).toEqual({ id: 'mas', label: 'Más', icon: 'menu' });
    expect(result.current.categories[1]).toEqual({ id: 'tecnologia', label: 'Tecnologia', icon: 'category' });
    expect(result.current.categories[2]).toEqual({ id: 'ropa', label: 'Ropa', icon: 'category' });
  });

  it('sets error on fetch failure', async () => {
    mockList.mockResolvedValue({
      data: null,
      error: { message: 'Connection failed' },
    });

    const { result } = renderHook(() => useCategorias());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Connection failed');
    expect(result.current.categories).toEqual([
      { id: 'mas', label: 'Más', icon: 'menu' },
    ]);
  });

  it('ends with loading false after success', async () => {
    mockList.mockResolvedValue({ data: [], error: null });

    const { result } = renderHook(() => useCategorias());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('ends with loading false after error', async () => {
    mockList.mockResolvedValue({ data: null, error: { message: 'fail' } });

    const { result } = renderHook(() => useCategorias());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});
