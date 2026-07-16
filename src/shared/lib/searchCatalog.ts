import {
  aiPicks,
  catalogProducts,
  categories,
  featuredProduct,
  trendingProducts,
  type Category,
  type Product,
} from '@/shared/data/mock';
import { inventoryProducts, merchantCatalogProducts } from '@/shared/data/merchantMock';

const PLACEHOLDER_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAr-DZ0IJDzubK9RIQ3HHsKdw6Pq-JPUADiGhYbYceKwrYXfnUxY71vGtu4jM3nR1KiD6Zkaus-EGsvgGSx2a5qoenBtpOUlLRM2qIHIyAI8nhTo5mtlrLlOl-BGh8_FiBEc6QY8Ji3gzNQbGC1rv8xVnJMm1_dfB5tMV9CmSkIvr-MuWOoNsHtkAvZ-vS2saDWJptEuWCsMT8rOL4VSuTUybLWBlEmn9wMJnSnMbK2xeHZtxzFTVRJoae3OSC6ydHH7JRYcL7mNIU';

function parsePrice(value: string): number {
  const n = parseFloat(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function stockFromCount(count: number): Product['stock'] {
  if (count <= 0) return 'out';
  if (count <= 5) return 'low';
  return 'in_stock';
}

function merchantCatalogToProduct(item: (typeof merchantCatalogProducts)[number]): Product {
  return {
    id: `merchant-${item.sku}`,
    name: item.name,
    price: parsePrice(item.price),
    image: item.image,
    category: item.category,
    rating: 4.5,
    reviewCount: 0,
    stock: stockFromCount(item.stock),
    badge: item.status === 'draft' ? 'Borrador' : undefined,
  };
}

function inventoryToProduct(item: (typeof inventoryProducts)[number]): Product {
  return {
    id: `inventory-${item.sku}`,
    name: item.name,
    price: parsePrice(item.price),
    image: PLACEHOLDER_IMAGE,
    category: item.category,
    rating: 4,
    reviewCount: 0,
    stock: item.status === 'out' ? 'out' : item.status === 'low' ? 'low' : 'in_stock',
  };
}

/** Catálogo unificado: tienda + productos de comerciantes (sin duplicar por id). */
export function getFullProductCatalog(): Product[] {
  const byId = new Map<string, Product>();

  for (const p of [featuredProduct, ...catalogProducts, ...trendingProducts, ...aiPicks]) {
    byId.set(p.id, p);
  }
  for (const p of merchantCatalogProducts) {
    byId.set(`merchant-${p.sku}`, merchantCatalogToProduct(p));
  }
  for (const p of inventoryProducts) {
    const id = `inventory-${p.sku}`;
    if (!byId.has(id) && !Array.from(byId.values()).some((x) => x.name === p.name)) {
      byId.set(id, inventoryToProduct(p));
    }
  }

  return Array.from(byId.values());
}

export function searchCategories(query: string): Category[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return categories.filter(
    (c) => c.label.toLowerCase().includes(q) || c.id.toLowerCase().includes(q),
  );
}

export function filterProducts(
  products: Product[],
  options: { query?: string; categoryId?: string },
): Product[] {
  let list = [...products];
  const q = options.query?.trim().toLowerCase() ?? '';
  const catId = options.categoryId ?? '';

  if (catId && catId !== 'mas') {
    const cat = categories.find((c) => c.id === catId);
    if (cat) {
      const label = cat.label.toLowerCase();
      list = list.filter(
        (p) =>
          p.category.toLowerCase().includes(label) ||
          label.includes(p.category.toLowerCase()),
      );
    }
  }

  if (q) {
    const matchedCategories = searchCategories(q).map((c) => c.label.toLowerCase());
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        matchedCategories.some((label) => p.category.toLowerCase().includes(label)),
    );
  }

  return list;
}
