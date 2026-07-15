import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const { mockList } = vi.hoisted(() => ({
  mockList: vi.fn(),
}));

vi.mock('@/entities/menu-accesibilidad/api/menu-accesibilidad.repository', () => ({
  menuAccesibilidadRepository: { list: mockList },
}));

import { useMenuAccesibilidad } from './useMenuAccesibilidad';

describe('useMenuAccesibilidad', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts with loading true and empty state', () => {
    mockList.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useMenuAccesibilidad());
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.items).toEqual([]);
  });

  it('returns items on success', async () => {
    const mockData = [
      { id: '1', nombre_categoria: 'Formularios', elemento_criterio: 'Labels', descripcion_criterio: 'All inputs need labels', aplica_todos_formularios: true, created_at: '' },
    ];
    mockList.mockResolvedValue({ data: mockData, error: null });

    const { result } = renderHook(() => useMenuAccesibilidad());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.items).toEqual(mockData);
  });

  it('filters items where title equals description', async () => {
    const mockData = [
      { id: '1', nombre_categoria: 'Formularios', elemento_criterio: 'Same text', descripcion_criterio: 'Same text', aplica_todos_formularios: true, created_at: '' },
      { id: '2', nombre_categoria: 'Formularios', elemento_criterio: 'Labels', descripcion_criterio: 'All inputs need labels', aplica_todos_formularios: true, created_at: '' },
    ];
    mockList.mockResolvedValue({ data: mockData, error: null });

    const { result } = renderHook(() => useMenuAccesibilidad());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.groupedByCategoria['Formularios']).toHaveLength(1);
    expect(result.current.groupedByCategoria['Formularios'][0].id).toBe('2');
  });

  it('filters items where title equals category name', async () => {
    const mockData = [
      { id: '1', nombre_categoria: 'Formularios', elemento_criterio: 'Formularios', descripcion_criterio: 'Category match', aplica_todos_formularios: true, created_at: '' },
      { id: '2', nombre_categoria: 'Formularios', elemento_criterio: 'Labels', descripcion_criterio: 'Good item', aplica_todos_formularios: true, created_at: '' },
    ];
    mockList.mockResolvedValue({ data: mockData, error: null });

    const { result } = renderHook(() => useMenuAccesibilidad());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.groupedByCategoria['Formularios']).toHaveLength(1);
    expect(result.current.groupedByCategoria['Formularios'][0].id).toBe('2');
  });

  it('filters items with empty title or description', async () => {
    const mockData = [
      { id: '1', nombre_categoria: 'Nav', elemento_criterio: '', descripcion_criterio: 'desc', aplica_todos_formularios: false, created_at: '' },
      { id: '2', nombre_categoria: 'Nav', elemento_criterio: 'title', descripcion_criterio: '', aplica_todos_formularios: false, created_at: '' },
      { id: '3', nombre_categoria: 'Nav', elemento_criterio: 'Valid', descripcion_criterio: 'Valid item', aplica_todos_formularios: false, created_at: '' },
    ];
    mockList.mockResolvedValue({ data: mockData, error: null });

    const { result } = renderHook(() => useMenuAccesibilidad());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.groupedByCategoria['Nav']).toHaveLength(1);
    expect(result.current.groupedByCategoria['Nav'][0].id).toBe('3');
  });

  it('groups by nombre_categoria', async () => {
    const mockData = [
      { id: '1', nombre_categoria: 'Formularios', elemento_criterio: 'Labels', descripcion_criterio: 'Need labels', aplica_todos_formularios: true, created_at: '' },
      { id: '2', nombre_categoria: 'Navegacion', elemento_criterio: 'Skip links', descripcion_criterio: 'Provide skip links', aplica_todos_formularios: false, created_at: '' },
      { id: '3', nombre_categoria: 'Formularios', elemento_criterio: 'Errors', descripcion_criterio: 'Show error messages', aplica_todos_formularios: true, created_at: '' },
    ];
    mockList.mockResolvedValue({ data: mockData, error: null });

    const { result } = renderHook(() => useMenuAccesibilidad());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.groupedByCategoria).toHaveProperty('Formularios');
    expect(result.current.groupedByCategoria).toHaveProperty('Navegacion');
    expect(result.current.groupedByCategoria['Formularios']).toHaveLength(2);
    expect(result.current.groupedByCategoria['Navegacion']).toHaveLength(1);
  });

  it('sets error on failure', async () => {
    mockList.mockResolvedValue({ data: null, error: { message: 'Fetch error' } });

    const { result } = renderHook(() => useMenuAccesibilidad());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Fetch error');
    expect(result.current.items).toEqual([]);
  });

  it('ends with loading false after fetch', async () => {
    mockList.mockResolvedValue({ data: [], error: null });

    const { result } = renderHook(() => useMenuAccesibilidad());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});
