import type { Category, Product } from '@/shared/data/mock';

export function searchCategories(query: string, categories: Category[]) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return categories.filter(
    (category) =>
      category.id !== 'mas' &&
      (category.label.toLowerCase().includes(q) || category.id.toLowerCase().includes(q)),
  );
}

export function filterProducts(
  products: Product[],
  categories: Category[],
  options: { query?: string; categoryId?: string },
): Product[] {
  let list = [...products];
  const query = options.query?.trim().toLowerCase() ?? '';
  const categoryId = options.categoryId ?? '';

  if (categoryId && categoryId !== 'mas') {
    const category = categories.find((item) => item.id === categoryId);
    if (category) {
      const categoryLabel = category.label.toLowerCase();
      list = list.filter(
        (product) =>
          product.category.toLowerCase().includes(categoryLabel) ||
          categoryLabel.includes(product.category.toLowerCase()),
      );
    }
  }

  if (query) {
    const matchedCategories = searchCategories(query, categories).map((cat) => cat.label.toLowerCase());
    list = list.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        matchedCategories.some((label) => product.category.toLowerCase().includes(label)),
    );
  }

  return list;
}
