import { describe, it, expect } from 'vitest';
import {
  getCategoryIcon,
  mapCategoriaRowToCategory,
  mapProductoRowToProduct,
} from './product-mappers';
import type { CategoriaRow } from '@/shared/types/database/categorias';
import type { ProductoRow } from '@/shared/types/database/productos';

describe('getCategoryIcon', () => {
  it('returns mapped icon for known category', () => {
    expect(getCategoryIcon('laptops')).toBe('laptop_mac');
    expect(getCategoryIcon('telefonos')).toBe('smartphone');
    expect(getCategoryIcon('ropa')).toBe('checkroom');
  });

  it('returns default icon for unknown category', () => {
    expect(getCategoryIcon('desconocida')).toBe('category');
  });

  it('is case-insensitive', () => {
    expect(getCategoryIcon('LAPTOPS')).toBe('laptop_mac');
    expect(getCategoryIcon('Laptops')).toBe('laptop_mac');
  });
});

describe('mapCategoriaRowToCategory', () => {
  it('maps a CategoriaRow to a Category', () => {
    const row: CategoriaRow = { id_categoria: '1', nombre: 'tecnologia' };
    const result = mapCategoriaRowToCategory(row);
    expect(result).toEqual({
      id: 'tecnologia',
      label: 'Tecnologia',
      icon: 'category',
    });
  });

  it('uses mapped icon when category name matches', () => {
    const row: CategoriaRow = { id_categoria: '2', nombre: 'laptops' };
    const result = mapCategoriaRowToCategory(row);
    expect(result.icon).toBe('laptop_mac');
  });
});

describe('mapProductoRowToProduct', () => {
  const baseRow: ProductoRow = {
    id_producto: 'p1',
    nombre: 'Test Product',
    descripcion: 'A test product',
    precio: '99.99',
    stock: 10,
    id_categoria: 'cat1',
    url: 'https://example.com/img.png',
  };

  it('maps a ProductoRow to a Product with correct fields', () => {
    const result = mapProductoRowToProduct(baseRow, { cat1: 'Tecnología' });
    expect(result.id).toBe('p1');
    expect(result.name).toBe('Test Product');
    expect(result.price).toBe(99.99);
    expect(result.description).toBe('A test product');
    expect(result.image).toBe('https://example.com/img.png');
    expect(result.category).toBe('Tecnología');
    expect(result.stock).toBe('in_stock');
    expect(result.rating).toBe(4.5);
    expect(result.reviewCount).toBe(0);
  });

  it('returns stock "out" when stock is 0', () => {
    const result = mapProductoRowToProduct({ ...baseRow, stock: 0 }, {});
    expect(result.stock).toBe('out');
  });

  it('returns stock "low" when stock is between 1 and 5', () => {
    const result = mapProductoRowToProduct({ ...baseRow, stock: 3 }, {});
    expect(result.stock).toBe('low');
  });

  it('returns stock "in_stock" when stock is > 5', () => {
    const result = mapProductoRowToProduct({ ...baseRow, stock: 10 }, {});
    expect(result.stock).toBe('in_stock');
  });

  it('uses placeholder image when url is null', () => {
    const result = mapProductoRowToProduct({ ...baseRow, url: null }, {});
    expect(result.image).toContain('unsplash.com');
  });

  it('uses placeholder image when url is empty string', () => {
    const result = mapProductoRowToProduct({ ...baseRow, url: '  ' }, {});
    expect(result.image).toContain('unsplash.com');
  });

  it('defaults category to "Sin categoría" when id_categoria is null', () => {
    const result = mapProductoRowToProduct({ ...baseRow, id_categoria: null }, {});
    expect(result.category).toBe('Sin categoría');
  });

  it('defaults category to "Sin categoría" when not found in map', () => {
    const result = mapProductoRowToProduct(baseRow, {});
    expect(result.category).toBe('Sin categoría');
  });

  it('returns 0 price when precio is not a valid number', () => {
    const result = mapProductoRowToProduct({ ...baseRow, precio: 'abc' }, {});
    expect(result.price).toBe(0);
  });
});
