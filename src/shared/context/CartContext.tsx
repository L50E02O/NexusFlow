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

      const { error } = await addCartItemToDb(user.id, product, quantity);
      if (!error) {
        await reloadDbCart();
      }
    },
    [reloadDbCart, user?.id],
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

      const { error } = await updateDbCartItemQuantity(user.id, productId, delta);
      if (!error) {
        await reloadDbCart();
      }
    },
    [reloadDbCart, user?.id],
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
