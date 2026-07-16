import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const { mockList } = vi.hoisted(() => ({
  mockList: vi.fn(),
}));

vi.mock('@/entities/wcag-criterios/api/wcag-criterios.repository', () => ({
  wcagCriteriosRepository: { list: mockList },
}));

import { useWcagCriterios } from './useWcagCriterios';

describe('useWcagCriterios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts with loading true and empty state', () => {
    mockList.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useWcagCriterios());
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.criterios).toEqual([]);
  });

  it('returns criterios on success', async () => {
    const mockData = [
      { id: '1', principio: 'Perceptible', criterio: '1.1', nombre: 'Text', nivel: 'A', que_verificar: 'q', como_implementarlo: 'c', estado: 'P', created_at: '' },
      { id: '2', principio: 'Operable', criterio: '2.1', nombre: 'Keyboard', nivel: 'A', que_verificar: 'q', como_implementarlo: 'c', estado: 'P', created_at: '' },
    ];
    mockList.mockResolvedValue({ data: mockData, error: null });

    const { result } = renderHook(() => useWcagCriterios());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.criterios).toEqual(mockData);
  });

  it('groups by principio', async () => {
    const mockData = [
      { id: '1', principio: 'Perceptible', criterio: '1.1', nombre: 'Text', nivel: 'A', que_verificar: '', como_implementarlo: '', estado: 'P', created_at: '' },
      { id: '2', principio: 'Perceptible', criterio: '1.2', nombre: 'Audio', nivel: 'A', que_verificar: '', como_implementarlo: '', estado: 'P', created_at: '' },
      { id: '3', principio: 'Operable', criterio: '2.1', nombre: 'Keyboard', nivel: 'A', que_verificar: '', como_implementarlo: '', estado: 'P', created_at: '' },
    ];
    mockList.mockResolvedValue({ data: mockData, error: null });

    const { result } = renderHook(() => useWcagCriterios());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.groupedByPrincipio).toHaveProperty('Perceptible');
    expect(result.current.groupedByPrincipio).toHaveProperty('Operable');
    expect(result.current.groupedByPrincipio['Perceptible']).toHaveLength(2);
    expect(result.current.groupedByPrincipio['Operable']).toHaveLength(1);
  });

  it('sets error on failure', async () => {
    mockList.mockResolvedValue({ data: null, error: { message: 'DB error' } });

    const { result } = renderHook(() => useWcagCriterios());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('DB error');
    expect(result.current.criterios).toEqual([]);
  });

  it('ends with loading false after fetch', async () => {
    mockList.mockResolvedValue({ data: [], error: null });

    const { result } = renderHook(() => useWcagCriterios());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});
