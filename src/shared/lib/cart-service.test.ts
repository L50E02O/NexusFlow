import { describe, it, expect, vi, beforeEach } from 'vitest';

const { cartChain, detailsChain, productChain } = vi.hoisted(() => {
  const results: Record<string, { data: any; error: any }> = {};

  function makeChain(name: string): Record<string, any> {
    results[name] = { data: null, error: null };
    const chain: Record<string, any> = {};
    for (const m of ['select', 'eq', 'maybeSingle', 'insert', 'in', 'update', 'delete', 'single', 'gte']) {
      chain[m] = vi.fn(() => chain);
    }
    chain.then = (resolve: any, reject: any) => {
      const r = results[name];
      return Promise.resolve(r).then(resolve, reject);
    };
    chain.setResult = (data: any, error: any) => {
      results[name] = { data, error };
    };
    chain.getResult = () => results[name];
    return chain;
  }

  return {
    cartChain: makeChain('cart'),
    detailsChain: makeChain('details'),
    productChain: makeChain('products'),
  };
});

vi.mock('@/shared/lib/supabase', () => ({
  supabase: {
    from: vi.fn((table: string) => {
      if (table === 'carritos') return cartChain;
      if (table === 'detalle_carritos') return detailsChain;
      if (table === 'productos') return productChain;
      return {};
    }),
  },
}));

import {
  getOrCreateCart,
  loadCartItems,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from './cart-service';

beforeEach(() => {
  vi.clearAllMocks();
  cartChain.setResult(null, null);
  detailsChain.setResult(null, null);
  productChain.setResult(null, null);
});

describe('getOrCreateCart', () => {
  it('returns existing cart if found', async () => {
    cartChain.setResult({ id_carrito: 'c1', id_usuario: 'u1' }, null);
    const result = await getOrCreateCart('u1');
    expect(result.data).toEqual({ id_carrito: 'c1', id_usuario: 'u1' });
    expect(result.error).toBeNull();
  });

  it('creates new cart if none exists', async () => {
    cartChain.setResult(null, null);
    cartChain.single.mockResolvedValue({ data: { id_carrito: 'c2' }, error: null });
    const result = await getOrCreateCart('u1');
    expect(result.data?.id_carrito).toBe('c2');
  });

  it('returns error if getCartByUserId fails', async () => {
    cartChain.setResult(null, { message: 'fail' });
    const result = await getOrCreateCart('u1');
    expect(result.error).toEqual({ message: 'fail' });
  });
});

describe('loadCartItems', () => {
  it('returns empty items if cart has no id_carrito', async () => {
    cartChain.setResult({ id_carrito: null }, null);
    const result = await loadCartItems('u1');
    expect(result.items).toEqual([]);
  });

  it('returns empty items on cart error', async () => {
    cartChain.setResult(null, { message: 'err' });
    const result = await loadCartItems('u1');
    expect(result.items).toEqual([]);
  });

  it('returns items mapped from details + products', async () => {
    cartChain.setResult({ id_carrito: 'c1' }, null);
    detailsChain.setResult([
      { id_detalle: 'd1', id_producto: 'p1', cantidad: 2 },
      { id_detalle: 'd2', id_producto: 'p2', cantidad: 1 },
    ], null);
    productChain.setResult([
      { id_producto: 'p1', nombre: 'Prod1', precio: '10', stock: 10, id_categoria: null, url: null, descripcion: '' },
      { id_producto: 'p2', nombre: 'Prod2', precio: '20', stock: 5, id_categoria: null, url: null, descripcion: '' },
    ], null);

    const result = await loadCartItems('u1');
    expect(result.items).toHaveLength(2);
    expect(result.items[0].quantity).toBe(2);
    expect(result.items[1].quantity).toBe(1);
  });

  it('filters out details with null product ids', async () => {
    cartChain.setResult({ id_carrito: 'c1' }, null);
    detailsChain.setResult([
      { id_detalle: 'd1', id_producto: null, cantidad: 1 },
      { id_detalle: 'd2', id_producto: 'p1', cantidad: 2 },
    ], null);
    productChain.setResult([
      { id_producto: 'p1', nombre: 'Prod1', precio: '10', stock: 10, id_categoria: null, url: null, descripcion: '' },
    ], null);

    const result = await loadCartItems('u1');
    expect(result.items).toHaveLength(1);
  });

  it('returns error on details fetch error', async () => {
    cartChain.setResult({ id_carrito: 'c1' }, null);
    detailsChain.setResult(null, { message: 'details err' });

    const result = await loadCartItems('u1');
    expect(result.items).toEqual([]);
    expect(result.error).toEqual({ message: 'details err' });
  });

  it('returns error on products fetch error', async () => {
    cartChain.setResult({ id_carrito: 'c1' }, null);
    detailsChain.setResult([{ id_detalle: 'd1', id_producto: 'p1', cantidad: 1 }], null);
    productChain.setResult(null, { message: 'products err' });

    const result = await loadCartItems('u1');
    expect(result.items).toEqual([]);
    expect(result.error).toEqual({ message: 'products err' });
  });

  it('skips details whose product is not in the products response', async () => {
    cartChain.setResult({ id_carrito: 'c1' }, null);
    detailsChain.setResult([
      { id_detalle: 'd1', id_producto: 'p1', cantidad: 1 },
      { id_detalle: 'd2', id_producto: 'p-missing', cantidad: 2 },
    ], null);
    productChain.setResult([
      { id_producto: 'p1', nombre: 'Prod1', precio: '10', stock: 10, id_categoria: null, url: null, descripcion: '' },
    ], null);

    const result = await loadCartItems('u1');
    expect(result.items).toHaveLength(1);
  });
});

describe('addCartItem', () => {
  it('creates new detail when product not in cart', async () => {
    cartChain.setResult({ id_carrito: 'c1' }, null);
    detailsChain.setResult(null, null);
    detailsChain.single.mockResolvedValue({ data: { id_detalle: 'new' }, error: null });

    const product = { id: 'p1', name: 'Test', price: 10, image: '', category: 'X', rating: 0, reviewCount: 0 };
    const result = await addCartItem('u1', product, 2);
    expect(result.error).toBeFalsy();
  });

  it('updates quantity when product already in cart', async () => {
    cartChain.setResult({ id_carrito: 'c1' }, null);
    detailsChain.setResult({ id_detalle: 'd1', cantidad: 2 }, null);
    detailsChain.single.mockResolvedValue({ data: { id_detalle: 'd1', cantidad: 3 }, error: null });

    const product = { id: 'p1', name: 'Test', price: 10, image: '', category: 'X', rating: 0, reviewCount: 0 };
    const result = await addCartItem('u1', product, 1);
    expect(result.error).toBeFalsy();
  });

  it('deletes detail when resulting quantity <= 0', async () => {
    cartChain.setResult({ id_carrito: 'c1' }, null);
    detailsChain.setResult({ id_detalle: 'd1', cantidad: 1 }, null);

    const product = { id: 'p1', name: 'Test', price: 10, image: '', category: 'X', rating: 0, reviewCount: 0 };
    const result = await addCartItem('u1', product, -1);
    expect(result.error).toBeFalsy();
    expect(detailsChain.delete).toHaveBeenCalled();
  });

  it('returns error if getOrCreateCart fails', async () => {
    cartChain.setResult(null, { message: 'cart err' });
    const product = { id: 'p1', name: 'Test', price: 10, image: '', category: 'X', rating: 0, reviewCount: 0 };
    const result = await addCartItem('u1', product, 1);
    expect(result.error).toBeTruthy();
  });

  it('returns error if findCartDetail fails', async () => {
    cartChain.setResult({ id_carrito: 'c1' }, null);
    detailsChain.setResult(null, { message: 'detail err' });

    const product = { id: 'p1', name: 'Test', price: 10, image: '', category: 'X', rating: 0, reviewCount: 0 };
    const result = await addCartItem('u1', product, 1);
    expect(result.error).toEqual({ message: 'detail err' });
  });
});

describe('updateCartItemQuantity', () => {
  it('returns error when cart not found', async () => {
    cartChain.setResult(null, { message: 'no cart' });
    const result = await updateCartItemQuantity('u1', 'p1', 1);
    expect(result.error).toBeTruthy();
  });

  it('returns error when detail not found', async () => {
    cartChain.setResult({ id_carrito: 'c1' }, null);
    detailsChain.setResult(null, { message: 'no detail' });

    const result = await updateCartItemQuantity('u1', 'p1', 1);
    expect(result.error).toEqual({ message: 'no detail' });
  });

  it('updates quantity with positive delta', async () => {
    cartChain.setResult({ id_carrito: 'c1' }, null);
    detailsChain.setResult({ id_detalle: 'd1', cantidad: 2 }, null);
    detailsChain.single.mockResolvedValue({ data: { id_detalle: 'd1', cantidad: 3 }, error: null });

    const result = await updateCartItemQuantity('u1', 'p1', 1);
    expect(result.error).toBeFalsy();
  });

  it('deletes when delta causes quantity <= 0', async () => {
    cartChain.setResult({ id_carrito: 'c1' }, null);
    detailsChain.setResult({ id_detalle: 'd1', cantidad: 1 }, null);

    const result = await updateCartItemQuantity('u1', 'p1', -1);
    expect(result.error).toBeFalsy();
    expect(detailsChain.delete).toHaveBeenCalled();
  });
});

describe('removeCartItem', () => {
  it('returns error when cart not found', async () => {
    cartChain.setResult(null, { message: 'no cart' });
    const result = await removeCartItem('u1', 'p1');
    expect(result.error).toBeTruthy();
  });

  it('deletes detail matching cart and product', async () => {
    cartChain.setResult({ id_carrito: 'c1' }, null);
    const result = await removeCartItem('u1', 'p1');
    expect(result.error).toBeFalsy();
    expect(detailsChain.delete).toHaveBeenCalled();
  });
});

describe('clearCart', () => {
  it('returns error when cart not found', async () => {
    cartChain.setResult(null, { message: 'no cart' });
    const result = await clearCart('u1');
    expect(result.error).toBeTruthy();
  });

  it('deletes all details for the cart', async () => {
    cartChain.setResult({ id_carrito: 'c1' }, null);
    const result = await clearCart('u1');
    expect(result.error).toBeFalsy();
    expect(detailsChain.delete).toHaveBeenCalled();
  });
});
