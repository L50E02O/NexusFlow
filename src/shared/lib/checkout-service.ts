import { supabase } from './supabase';
import type { CartLine } from '@/shared/context/CartContext';

export type CheckoutFormData = {
  fullName: string;
  address: string;
  city: string;
  postal: string;
  deliveryMethod: string;
};

export type CheckoutResult = {
  success: boolean;
  error?: string;
  pedidoId?: string;
};

type DbProduct = { id_producto: string; stock: number };

export async function processCheckout(
  userId: string,
  items: CartLine[],
  formData: CheckoutFormData,
  total: number,
): Promise<CheckoutResult> {
  if (items.length === 0) {
    return { success: false, error: 'El carrito está vacío' };
  }

  const productIds = items.map((i) => i.product.id);
  const { data: dbProducts, error: fetchError } = await (supabase
    .from('productos') as any)
    .select('id_producto, stock')
    .in('id_producto', productIds) as { data: DbProduct[] | null; error: any };

  if (fetchError || !dbProducts) {
    return { success: false, error: 'Error al verificar inventario' };
  }

  const stockMap = new Map(dbProducts.map((p: DbProduct) => [p.id_producto, p.stock]));

  for (const item of items) {
    const available = stockMap.get(item.product.id);
    if (available === undefined) {
      return { success: false, error: `"${item.product.name}" no encontrado en inventario` };
    }
    if (available < item.quantity) {
      return {
        success: false,
        error: `Stock insuficiente para "${item.product.name}": ${available} disponible(s), ${item.quantity} solicitado(s)`,
      };
    }
  }

  const { data: pedido, error: pedidoError } = await (supabase
    .from('pedidos') as any)
    .insert({
      id_usuario: userId,
      total: total.toFixed(2),
      estado: 'confirmado',
      fecha: new Date().toISOString(),
    })
    .select('id_pedido')
    .single() as { data: { id_pedido: string } | null; error: any };

  if (pedidoError || !pedido) {
    return { success: false, error: 'Error al crear el pedido' };
  }

  const pedidoId = pedido.id_pedido;

  for (const item of items) {
    const { error: detError } = await (supabase
      .from('detalle_pedidos') as any)
      .insert({
        id_pedido: pedidoId,
        id_producto: item.product.id,
        cantidad: item.quantity,
        precio_unitario: item.product.price.toFixed(2),
      }) as { error: any };

    if (detError) {
      return { success: false, error: `Error al registrar "${item.product.name}" en el pedido` };
    }

    const currentStock = stockMap.get(item.product.id)!;

    const { data: updated, error: stockError } = await (supabase
      .from('productos') as any)
      .update({ stock: currentStock - item.quantity })
      .eq('id_producto', item.product.id)
      .gte('stock', item.quantity)
      .select('id_producto') as { data: { id_producto: string }[] | null; error: any };

    if (stockError) {
      return { success: false, error: `Error al actualizar stock de "${item.product.name}"` };
    }

    if (!updated || updated.length === 0) {
      return {
        success: false,
        error: `Stock insuficiente para "${item.product.name}" al momento de confirmar. Stock disponible menor a ${item.quantity}. Intenta de nuevo.`,
      };
    }
  }

  const { error: pagoError } = await (supabase
    .from('pagos') as any)
    .insert({
      id_pedido: pedidoId,
      metodo_pago: 'tarjeta',
      estado: 'completado',
    }) as { error: any };

  if (pagoError) {
    return { success: false, error: 'Error al procesar el pago' };
  }

  const { error: envioError } = await (supabase
    .from('envios') as any)
    .insert({
      id_pedido: pedidoId,
      direccion: `${formData.address}, ${formData.city}, CP ${formData.postal}`,
      estado: 'preparando',
    }) as { error: any };

  if (envioError) {
    return { success: false, error: 'Error al registrar el envío' };
  }

  return { success: true, pedidoId };
}
