import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const { mockProductosList, mockCategoriasList } = vi.hoisted(() => ({
  mockProductosList: vi.fn(),
  mockCategoriasList: vi.fn(),
}));

vi.mock('@/entities/productos/api/productos.repository', () => ({
  productosRepository: { list: mockProductosList },
}));

vi.mock('@/entities/categorias/api/categorias.repository', () => ({
  categoriasRepository: { list: mockCategoriasList },
}));

vi.mock('@/shared/lib/product-mappers', () => ({
  mapProductoRowToProduct: (row: any, categoriesMap: Record<string, string>) => ({
    id: row.id_producto,
    name: row.nombre,
    price: Number(row.precio) || 0,
    description: row.descripcion ?? undefined,
    image: row.url || 'https://placeholder',
    category: categoriesMap[row.id_categoria] ?? 'Sin categoría',
    rating: 4.5,
    reviewCount: 0,
    stock: row.stock <= 0 ? 'out' : row.stock <= 5 ? 'low' : 'in_stock',
  }),
}));

import { useProductos } from './useProductos';

describe('useProductos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns mapped products on success', async () => {
    mockProductosList.mockResolvedValue({
      data: [
        { id_producto: 'p1', nombre: 'Laptop', descripcion: 'Fast', precio: '999', stock: 10, id_categoria: 'c1', url: null },
      ],
      error: null,
    });
    mockCategoriasList.mockResolvedValue({
      data: [{ id_categoria: 'c1', nombre: 'Tecnología', descripcion: null }],
      error: null,
    });

    const { result } = renderHook(() => useProductos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.products).toHaveLength(1);
    expect(result.current.products[0].name).toBe('Laptop');
    expect(result.current.products[0].category).toBe('Tecnología');
  });

  it('sets error on products fetch failure', async () => {
    mockProductosList.mockResolvedValue({
      data: null,
      error: { message: 'Products fetch failed' },
    });
    mockCategoriasList.mockResolvedValue({
      data: [],
      error: null,
    });

    const { result } = renderHook(() => useProductos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Products fetch failed');
    expect(result.current.products).toEqual([]);
  });

  it('starts with loading true', () => {
    mockProductosList.mockReturnValue(new Promise(() => {}));
    mockCategoriasList.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useProductos());
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.products).toEqual([]);
  });

  it('ends with loading false on success', async () => {
    mockProductosList.mockResolvedValue({ data: [], error: null });
    mockCategoriasList.mockResolvedValue({ data: [], error: null });

    const { result } = renderHook(() => useProductos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('maps stock correctly', async () => {
    mockProductosList.mockResolvedValue({
      data: [
        { id_producto: 'p1', nombre: 'Out item', descripcion: '', precio: '10', stock: 0, id_categoria: null, url: null },
        { id_producto: 'p2', nombre: 'Low item', descripcion: '', precio: '20', stock: 3, id_categoria: null, url: null },
        { id_producto: 'p3', nombre: 'In stock item', descripcion: '', precio: '30', stock: 20, id_categoria: null, url: null },
      ],
      error: null,
    });
    mockCategoriasList.mockResolvedValue({ data: [], error: null });

    const { result } = renderHook(() => useProductos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products[0].stock).toBe('out');
    expect(result.current.products[1].stock).toBe('low');
    expect(result.current.products[2].stock).toBe('in_stock');
  });
});
