import type { CategoriaRow } from '@/shared/types/database/categorias';
import type { ProductoRow } from '@/shared/types/database/productos';
import type { Category, Product } from '@/shared/data/mock';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80';

const categoryIconMap: Record<string, string> = {
  accesorios: 'watch',
  bebidas: 'local_drink',
  camisas: 'checkroom',
  consolas: 'sports_esports',
  deportes: 'fitness_center',
  hogar: 'chair',
  laptops: 'laptop_mac',
  telefonos: 'smartphone',
  ropa: 'checkroom',
  deportes_exterior: 'sports_soccer',
};

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getCategoryIcon(categoryName: string) {
  return categoryIconMap[categoryName.toLowerCase()] ?? 'category';
}

export function mapCategoriaRowToCategory(row: CategoriaRow): Category {
  return {
    id: row.nombre,
    label: capitalize(row.nombre),
    icon: getCategoryIcon(row.nombre),
  };
}

export function mapProductoRowToProduct(
  row: ProductoRow,
  categoriesMap: Record<string, string>,
): Product {
  const category = row.id_categoria ? categoriesMap[row.id_categoria] ?? 'Sin categoría' : 'Sin categoría';

  const stock = row.stock <= 0 ? 'out' : row.stock <= 5 ? 'low' : 'in_stock';

  return {
    id: row.id_producto,
    name: row.nombre,
    price: Number(row.precio) || 0,
    description: row.descripcion ?? undefined,
    image: row.url?.trim() ? row.url : PLACEHOLDER_IMAGE,
    category,
    rating: 4.5,
    reviewCount: 0,
    stock,
  };
}
