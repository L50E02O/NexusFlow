import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/shared/lib/supabase', () => {
  const chainable = () => {
    const chain: Record<string, unknown> = {};
    const methods = ['select', 'eq', 'in', 'insert', 'single', 'update', 'gte'];
    methods.forEach((m) => {
      chain[m] = vi.fn().mockReturnValue(chain);
    });
    return chain;
  };

  return {
    supabase: {
      from: vi.fn(() => chainable()),
    },
  };
});

import { supabase } from '@/shared/lib/supabase';
import { processCheckout } from './checkout-service';
import type { CartLine } from '@/shared/context/CartContext';

const mockProduct = { id: 'p1', name: 'Test Product', price: 100, image: '', category: 'X', rating: 0, reviewCount: 0 };
const mockFormData = { fullName: 'John', address: '123 St', city: 'Madrid', postal: '28001', deliveryMethod: 'standard' };

function makeItems(): CartLine[] {
  return [{ product: mockProduct, quantity: 2, detailId: 'd1' }];
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('processCheckout', () => {
  it('returns error for empty cart', async () => {
    const result = await processCheckout('u1', [], mockFormData, 0);
    expect(result.success).toBe(false);
    expect(result.error).toBe('El carrito está vacío');
  });

  it('returns error when products fetch fails', async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      in: vi.fn().mockResolvedValue({ data: null, error: { message: 'fetch fail' } }),
    };
    (supabase.from as any).mockReturnValue(chain);

    const result = await processCheckout('u1', makeItems(), mockFormData, 200);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Error al verificar inventario');
  });

  it('returns error when product not found in inventory', async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      in: vi.fn().mockResolvedValue({ data: [], error: null }),
    };
    (supabase.from as any).mockReturnValue(chain);

    const result = await processCheckout('u1', makeItems(), mockFormData, 200);
    expect(result.success).toBe(false);
    expect(result.error).toContain('no encontrado');
  });

  it('returns error when stock is insufficient', async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      in: vi.fn().mockResolvedValue({ data: [{ id_producto: 'p1', stock: 1 }], error: null }),
    };
    (supabase.from as any).mockReturnValue(chain);

    const result = await processCheckout('u1', makeItems(), mockFormData, 200);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Stock insuficiente');
  });

  it('completes checkout successfully', async () => {
    const productsChain = {
      select: vi.fn().mockReturnThis(),
      in: vi.fn().mockResolvedValue({ data: [{ id_producto: 'p1', stock: 10 }], error: null }),
    };
    const pedidosChain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id_pedido: 'ped1' }, error: null }),
    };
    const detalleChain = {
      insert: vi.fn().mockReturnThis(),
    };
    detalleChain.insert.mockReturnValue({
      error: null,
    });
    const productosUpdateChain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
    };
    productosUpdateChain.select.mockResolvedValue({ data: [{ id_producto: 'p1' }], error: null });
    const pagosChain = {
      insert: vi.fn().mockReturnThis(),
    };
    pagosChain.insert.mockReturnValue({ error: null });
    const enviosChain = {
      insert: vi.fn().mockReturnThis(),
    };
    enviosChain.insert.mockReturnValue({ error: null });

    let fromCallCount = 0;
    (supabase.from as any).mockImplementation((table: string) => {
      fromCallCount++;
      if (table === 'productos') {
        if (fromCallCount <= 2) return productsChain;
        return productosUpdateChain;
      }
      if (table === 'pedidos') return pedidosChain;
      if (table === 'detalle_pedidos') return detalleChain;
      if (table === 'pagos') return pagosChain;
      if (table === 'envios') return enviosChain;
      return productsChain;
    });

    const result = await processCheckout('u1', makeItems(), mockFormData, 200);
    expect(result.success).toBe(true);
    expect(result.pedidoId).toBe('ped1');
  });

  it('returns error when pedido creation fails', async () => {
    const productsChain = {
      select: vi.fn().mockReturnThis(),
      in: vi.fn().mockResolvedValue({ data: [{ id_producto: 'p1', stock: 10 }], error: null }),
    };
    const pedidosChain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { message: 'pedido fail' } }),
    };
    (supabase.from as any).mockImplementation((table: string) => {
      if (table === 'productos') return productsChain;
      return pedidosChain;
    });

    const result = await processCheckout('u1', makeItems(), mockFormData, 200);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Error al crear el pedido');
  });

  it('returns error when detalle insert fails', async () => {
    const productsChain = {
      select: vi.fn().mockReturnThis(),
      in: vi.fn().mockResolvedValue({ data: [{ id_producto: 'p1', stock: 10 }], error: null }),
    };
    const pedidosChain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id_pedido: 'ped1' }, error: null }),
    };
    const detalleChain = {
      insert: vi.fn().mockReturnValue({ error: { message: 'detalle fail' } }),
    };
    (supabase.from as any).mockImplementation((table: string) => {
      if (table === 'productos') return productsChain;
      if (table === 'pedidos') return pedidosChain;
      if (table === 'detalle_pedidos') return detalleChain;
      return productsChain;
    });

    const result = await processCheckout('u1', makeItems(), mockFormData, 200);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Error al registrar');
  });

  it('returns error when stock update fails', async () => {
    const productsChain = {
      select: vi.fn().mockReturnThis(),
      in: vi.fn().mockResolvedValue({ data: [{ id_producto: 'p1', stock: 10 }], error: null }),
    };
    const pedidosChain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id_pedido: 'ped1' }, error: null }),
    };
    const detalleChain = {
      insert: vi.fn().mockReturnValue({ error: null }),
    };
    const productosUpdateChain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
    };
    productosUpdateChain.select.mockResolvedValue({ data: null, error: { message: 'stock fail' } });

    let fromCallCount = 0;
    (supabase.from as any).mockImplementation((table: string) => {
      fromCallCount++;
      if (table === 'productos') {
        if (fromCallCount <= 2) return productsChain;
        return productosUpdateChain;
      }
      if (table === 'pedidos') return pedidosChain;
      if (table === 'detalle_pedidos') return detalleChain;
      return productsChain;
    });

    const result = await processCheckout('u1', makeItems(), mockFormData, 200);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Error al actualizar stock');
  });

  it('returns error when pago insert fails', async () => {
    const productsChain = {
      select: vi.fn().mockReturnThis(),
      in: vi.fn().mockResolvedValue({ data: [{ id_producto: 'p1', stock: 10 }], error: null }),
    };
    const pedidosChain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id_pedido: 'ped1' }, error: null }),
    };
    const detalleChain = {
      insert: vi.fn().mockReturnValue({ error: null }),
    };
    const productosUpdateChain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
    };
    productosUpdateChain.select.mockResolvedValue({ data: [{ id_producto: 'p1' }], error: null });
    const pagosChain = {
      insert: vi.fn().mockReturnValue({ error: { message: 'pago fail' } }),
    };

    let fromCallCount = 0;
    (supabase.from as any).mockImplementation((table: string) => {
      fromCallCount++;
      if (table === 'productos') {
        if (fromCallCount <= 2) return productsChain;
        return productosUpdateChain;
      }
      if (table === 'pedidos') return pedidosChain;
      if (table === 'detalle_pedidos') return detalleChain;
      if (table === 'pagos') return pagosChain;
      return productsChain;
    });

    const result = await processCheckout('u1', makeItems(), mockFormData, 200);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Error al procesar el pago');
  });

  it('returns error when envio insert fails', async () => {
    const productsChain = {
      select: vi.fn().mockReturnThis(),
      in: vi.fn().mockResolvedValue({ data: [{ id_producto: 'p1', stock: 10 }], error: null }),
    };
    const pedidosChain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id_pedido: 'ped1' }, error: null }),
    };
    const detalleChain = {
      insert: vi.fn().mockReturnValue({ error: null }),
    };
    const productosUpdateChain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
    };
    productosUpdateChain.select.mockResolvedValue({ data: [{ id_producto: 'p1' }], error: null });
    const pagosChain = {
      insert: vi.fn().mockReturnValue({ error: null }),
    };
    const enviosChain = {
      insert: vi.fn().mockReturnValue({ error: { message: 'envio fail' } }),
    };

    let fromCallCount = 0;
    (supabase.from as any).mockImplementation((table: string) => {
      fromCallCount++;
      if (table === 'productos') {
        if (fromCallCount <= 2) return productsChain;
        return productosUpdateChain;
      }
      if (table === 'pedidos') return pedidosChain;
      if (table === 'detalle_pedidos') return detalleChain;
      if (table === 'pagos') return pagosChain;
      if (table === 'envios') return enviosChain;
      return productsChain;
    });

    const result = await processCheckout('u1', makeItems(), mockFormData, 200);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Error al registrar el envío');
  });

  it('returns error when updated stock is empty (race condition)', async () => {
    const productsChain = {
      select: vi.fn().mockReturnThis(),
      in: vi.fn().mockResolvedValue({ data: [{ id_producto: 'p1', stock: 10 }], error: null }),
    };
    const pedidosChain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id_pedido: 'ped1' }, error: null }),
    };
    const detalleChain = {
      insert: vi.fn().mockReturnValue({ error: null }),
    };
    const productosUpdateChain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
    };
    productosUpdateChain.select.mockResolvedValue({ data: [], error: null });

    let fromCallCount = 0;
    (supabase.from as any).mockImplementation((table: string) => {
      fromCallCount++;
      if (table === 'productos') {
        if (fromCallCount <= 2) return productsChain;
        return productosUpdateChain;
      }
      if (table === 'pedidos') return pedidosChain;
      if (table === 'detalle_pedidos') return detalleChain;
      return productsChain;
    });

    const result = await processCheckout('u1', makeItems(), mockFormData, 200);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Stock insuficiente');
  });
});
