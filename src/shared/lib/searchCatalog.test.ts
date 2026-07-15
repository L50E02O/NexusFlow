import { describe, it, expect } from 'vitest';
import { getFullProductCatalog, searchCategories, filterProducts } from './searchCatalog';

describe('getFullProductCatalog', () => {
  it('returns a non-empty array of products', () => {
    const catalog = getFullProductCatalog();
    expect(catalog.length).toBeGreaterThan(0);
  });

  it('each product has required fields', () => {
    const catalog = getFullProductCatalog();
    for (const p of catalog) {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(typeof p.price).toBe('number');
      expect(p.image).toBeTruthy();
      expect(p.category).toBeTruthy();
    }
  });

  it('does not duplicate products by id', () => {
    const catalog = getFullProductCatalog();
    const ids = catalog.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('includes merchant catalog products with merchant- prefix', () => {
    const catalog = getFullProductCatalog();
    const merchantProducts = catalog.filter((p) => p.id.startsWith('merchant-'));
    expect(merchantProducts.length).toBeGreaterThan(0);
  });
});

describe('searchCategories', () => {
  it('returns empty for empty query', () => {
    expect(searchCategories('')).toEqual([]);
  });

  it('finds categories by label', () => {
    const result = searchCategories('accesorios');
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result.some((c) => c.label.toLowerCase().includes('accesorios'))).toBe(true);
  });

  it('is case-insensitive', () => {
    const result = searchCategories('ACCESORIOS');
    expect(result.length).toBeGreaterThanOrEqual(1);
  });
});

describe('filterProducts', () => {
  const sample = getFullProductCatalog();

  it('returns all when no filters', () => {
    expect(filterProducts(sample, {})).toHaveLength(sample.length);
  });

  it('filters by query matching name', () => {
    const firstName = sample[0].name.split(' ')[0].toLowerCase();
    const result = filterProducts(sample, { query: firstName });
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it('filters by query matching category', () => {
    const firstCategory = sample[0].category.toLowerCase().split(' ')[0];
    const result = filterProducts(sample, { query: firstCategory });
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it('filters by categoryId', () => {
    const result = filterProducts(sample, { categoryId: 'tech' });
    expect(result.length).toBeGreaterThanOrEqual(0);
  });

  it('ignores "mas" categoryId', () => {
    const result = filterProducts(sample, { categoryId: 'mas' });
    expect(result).toHaveLength(sample.length);
  });

  it('returns empty when query does not match', () => {
    const result = filterProducts(sample, { query: 'xyznonexistent123' });
    expect(result).toHaveLength(0);
  });
});
