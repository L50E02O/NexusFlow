import { describe, it, expect } from 'vitest';
import { searchCategories, filterProducts } from './product-utils';
import type { Category, Product } from '@/shared/data/mock';

const categories: Category[] = [
  { id: 'tech', label: 'Tecnología', icon: 'laptop_mac' },
  { id: 'ropa', label: 'Ropa', icon: 'checkroom' },
  { id: 'hogar', label: 'Hogar', icon: 'chair' },
  { id: 'mas', label: 'Más', icon: 'menu' },
];

const products: Product[] = [
  { id: '1', name: 'Laptop', price: 1000, image: '', category: 'Tecnología', rating: 5, reviewCount: 10, stock: 'in_stock' },
  { id: '2', name: 'Camisa', price: 50, image: '', category: 'Ropa', rating: 4, reviewCount: 5, stock: 'low' },
  { id: '3', name: 'Silla', price: 200, image: '', category: 'Hogar', rating: 3, reviewCount: 2, stock: 'in_stock' },
];

describe('searchCategories', () => {
  it('returns empty array for empty query', () => {
    expect(searchCategories('', categories)).toEqual([]);
  });

  it('returns empty array for whitespace-only query', () => {
    expect(searchCategories('   ', categories)).toEqual([]);
  });

  it('filters categories by label', () => {
    const result = searchCategories('tecn', categories);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('tech');
  });

  it('filters categories by id', () => {
    const result = searchCategories('ropa', categories);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('ropa');
  });

  it('excludes "mas" category', () => {
    const result = searchCategories('más', categories);
    expect(result).toHaveLength(0);
  });

  it('is case-insensitive', () => {
    const result = searchCategories('TECNO', categories);
    expect(result).toHaveLength(1);
  });
});

describe('filterProducts', () => {
  it('returns all products with no filters', () => {
    expect(filterProducts(products, categories, {})).toHaveLength(3);
  });

  it('filters by categoryId', () => {
    const result = filterProducts(products, categories, { categoryId: 'tech' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Laptop');
  });

  it('ignores "mas" categoryId', () => {
    const result = filterProducts(products, categories, { categoryId: 'mas' });
    expect(result).toHaveLength(3);
  });

  it('filters by query matching name', () => {
    const result = filterProducts(products, categories, { query: 'laptop' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Laptop');
  });

  it('filters by query matching category', () => {
    const result = filterProducts(products, categories, { query: 'ropa' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Camisa');
  });

  it('combines categoryId and query filters', () => {
    const result = filterProducts(products, categories, { categoryId: 'tech', query: 'laptop' });
    expect(result).toHaveLength(1);
  });

  it('returns empty when query does not match', () => {
    const result = filterProducts(products, categories, { query: 'xyz' });
    expect(result).toHaveLength(0);
  });
});
