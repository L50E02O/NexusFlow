import { supabase } from '@/shared/lib/supabase';
import { mapProductoRowToProduct } from '@/shared/lib/product-mappers';
import type { Product } from '@/shared/data/mock';
import type { CarritoRow } from '@/shared/types/database/carritos';
import type { DetalleCarritoRow } from '@/shared/types/database/detalle-carritos';
import type { ProductoRow } from '@/shared/types/database/productos';

const cartTable = supabase.from('carritos' as const);
const detailsTable = supabase.from('detalle_carritos' as const);
const productTable = supabase.from('productos' as const);

export type CartLine = {
  product: Product;
  quantity: number;
  detailId: string;
};

async function getCartByUserId(userId: string) {
  return cartTable.select('*').eq('id_usuario', userId).maybeSingle();
}

async function loadProductsByIds(ids: string[]) {
  if (ids.length === 0) return { data: [] as ProductoRow[], error: null };
  return productTable.select('*').in('id_producto', ids);
}

export async function getOrCreateCart(userId: string) {
  const { data, error } = await getCartByUserId(userId);
  if (error) return { data: null as CarritoRow | null, error };
  if (data) return { data, error: null };

  return cartTable.insert({ id_usuario: userId }).select('*').single();
}

export async function loadCartItems(userId: string) {
  const cartResponse = await getCartByUserId(userId);
  if (cartResponse.error) return { items: [] as CartLine[], error: cartResponse.error };
  const cart = cartResponse.data;
  if (!cart?.id_carrito) return { items: [] as CartLine[], error: null };

  const { data: details, error: detailsError } = await detailsTable
    .select('*')
    .eq('id_carrito', cart.id_carrito);

  if (detailsError) return { items: [] as CartLine[], error: detailsError };

  const productIds = details
    .map((detail) => detail.id_producto)
    .filter((id): id is string => Boolean(id));

  const productsResponse = await loadProductsByIds(productIds);
  if (productsResponse.error) return { items: [] as CartLine[], error: productsResponse.error };

  const productMap = productsResponse.data.reduce<Record<string, ProductoRow>>((map, item) => {
    if (item.id_producto) map[item.id_producto] = item;
    return map;
  }, {});

  const items = details
    .map((detail) => {
      const productRow = detail.id_producto ? productMap[detail.id_producto] : undefined;
      if (!productRow) return null;
      return {
        detailId: detail.id_detalle,
        quantity: detail.cantidad,
        product: mapProductoRowToProduct(productRow, {}),
      };
    })
    .filter((line): line is CartLine => line !== null);

  return { items, error: null };
}

async function findCartDetail(cartId: string, productId: string) {
  return detailsTable
    .select('*')
    .eq('id_carrito', cartId)
    .eq('id_producto', productId)
    .maybeSingle();
}

export async function addCartItem(userId: string, product: Product, quantity: number) {
  const cartResponse = await getOrCreateCart(userId);
  if (cartResponse.error || !cartResponse.data) return { error: cartResponse.error };
  const cartId = cartResponse.data.id_carrito;

  const detailResponse = await findCartDetail(cartId, product.id);
  if (detailResponse.error) return { error: detailResponse.error };

  if (detailResponse.data) {
    const nextQuantity = detailResponse.data.cantidad + quantity;
    if (nextQuantity <= 0) {
      return detailsTable
        .delete()
        .eq('id_detalle', detailResponse.data.id_detalle);
    }
    return detailsTable
      .update({ cantidad: nextQuantity })
      .eq('id_detalle', detailResponse.data.id_detalle)
      .select('*')
      .single();
  }

  return detailsTable.insert({
    cantidad: Math.max(1, quantity),
    id_carrito: cartId,
    id_producto: product.id,
  }).select('*').single();
}

export async function updateCartItemQuantity(userId: string, productId: string, delta: number) {
  const cartResponse = await getCartByUserId(userId);
  if (cartResponse.error || !cartResponse.data?.id_carrito) return { error: cartResponse.error };

  const detailResponse = await findCartDetail(cartResponse.data.id_carrito, productId);
  if (detailResponse.error || !detailResponse.data) return { error: detailResponse.error };

  const nextQuantity = detailResponse.data.cantidad + delta;
  if (nextQuantity <= 0) {
    return detailsTable.delete().eq('id_detalle', detailResponse.data.id_detalle);
  }

  return detailsTable
    .update({ cantidad: nextQuantity })
    .eq('id_detalle', detailResponse.data.id_detalle)
    .select('*')
    .single();
}

export async function removeCartItem(userId: string, productId: string) {
  const cartResponse = await getCartByUserId(userId);
  if (cartResponse.error || !cartResponse.data?.id_carrito) return { error: cartResponse.error };

  return detailsTable
    .delete()
    .eq('id_carrito', cartResponse.data.id_carrito)
    .eq('id_producto', productId);
}

export async function clearCart(userId: string) {
  const cartResponse = await getCartByUserId(userId);
  if (cartResponse.error || !cartResponse.data?.id_carrito) return { error: cartResponse.error };

  return detailsTable.delete().eq('id_carrito', cartResponse.data.id_carrito);
}
