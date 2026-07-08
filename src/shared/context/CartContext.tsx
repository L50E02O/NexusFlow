import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Product } from '@/shared/data/mock';
import { useAuth } from '@/shared/context/AuthContext';
import { supabase } from '@/shared/lib/supabase';
import {
  addCartItem as addCartItemToDb,
  clearCart as clearDbCart,
  loadCartItems,
  removeCartItem as removeCartItemFromDb,
  updateCartItemQuantity as updateDbCartItemQuantity,
} from '@/shared/lib/cart-service';

export type CartLine = { product: Product; quantity: number; detailId: string };

type CartContextValue = {
  items: CartLine[];
  itemCount: number;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, delta: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: Readonly<{ children: ReactNode }>) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartLine[]>([]);
  const [localItems, setLocalItems] = useState<CartLine[]>([]);

  const reloadDbCart = useCallback(async () => {
    if (!user?.id) return;
    const response = await loadCartItems(user.id);
    if (!response.error) {
      setItems(response.items);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      void reloadDbCart();
      return;
    }
    setItems(localItems);
  }, [user?.id, localItems, reloadDbCart]);

  const addToCart = useCallback(
    async (product: Product, quantity = 1) => {
      if (product.stock === 'out') {
        window.alert(`"${product.name}" está agotado. No se puede agregar al carrito.`);
        return;
      }

      if (!user?.id) {
        setLocalItems((prev) => {
          const existing = prev.find((line) => line.product.id === product.id);
          if (existing) {
            return prev.map((line) =>
              line.product.id === product.id
                ? { ...line, quantity: line.quantity + quantity }
                : line,
            );
          }
          return [...prev, { product, quantity, detailId: product.id }];
        });
        return;
      }

      const { data: dbProduct } = await (supabase
        .from('productos') as any)
        .select('stock')
        .eq('id_producto', product.id)
        .single() as { data: { stock: number } | null; error: any };

      if (dbProduct) {
        const currentQty = items.find((line) => line.product.id === product.id)?.quantity ?? 0;
        const requestedQty = currentQty + quantity;
        if (requestedQty > dbProduct.stock) {
          window.alert(
            `Stock insuficiente para "${product.name}". Disponible: ${dbProduct.stock}, ${currentQty > 0 ? `ya tienes ${currentQty} en tu carrito, ` : ''}solicitaste ${requestedQty}.`,
          );
          return;
        }
      }

      const { error } = await addCartItemToDb(user.id, product, quantity);
      if (!error) {
        await reloadDbCart();
      }
    },
    [reloadDbCart, user?.id, items],
  );

  const updateQuantity = useCallback(
    async (productId: string, delta: number) => {
      if (!user?.id) {
        setLocalItems((prev) =>
          prev
            .map((line) =>
              line.product.id === productId
                ? { ...line, quantity: Math.max(0, line.quantity + delta) }
                : line,
            )
            .filter((line) => line.quantity > 0),
        );
        return;
      }

      if (delta <= 0) {
        const { error } = await updateDbCartItemQuantity(user.id, productId, delta);
        if (!error) {
          await reloadDbCart();
        }
        return;
      }

      const currentLine = items.find((line) => line.product.id === productId);
      if (!currentLine) return;

      const { data: dbProduct } = await (supabase
        .from('productos') as any)
        .select('stock')
        .eq('id_producto', productId)
        .single() as { data: { stock: number } | null; error: any };

      if (dbProduct && currentLine.quantity + delta > dbProduct.stock) {
        window.alert(
          `Stock insuficiente para "${currentLine.product.name}". Disponible: ${dbProduct.stock}, ya tienes ${currentLine.quantity} en tu carrito.`,
        );
        return;
      }

      const { error } = await updateDbCartItemQuantity(user.id, productId, delta);
      if (!error) {
        await reloadDbCart();
      }
    },
    [reloadDbCart, user?.id, items],
  );

  const removeItem = useCallback(
    async (productId: string) => {
      if (!user?.id) {
        setLocalItems((prev) => prev.filter((line) => line.product.id !== productId));
        return;
      }
      const { error } = await removeCartItemFromDb(user.id, productId);
      if (!error) {
        await reloadDbCart();
      }
    },
    [reloadDbCart, user?.id],
  );

  const clearCart = useCallback(async () => {
    if (!user?.id) {
      setLocalItems([]);
      setItems([]);
      return;
    }
    const { error } = await clearDbCart(user.id);
    if (!error) {
      setItems([]);
    }
  }, [user?.id]);

  const itemCount = useMemo(
    () => items.reduce((sum, line) => sum + line.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({ items, itemCount, addToCart, updateQuantity, removeItem, clearCart }),
    [items, itemCount, addToCart, updateQuantity, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
  return ctx;
}
