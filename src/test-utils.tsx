import { vi } from 'vitest';

export const mockI18n = {
  t: (k: string) => k,
  locale: 'es' as const,
  setLocale: vi.fn(),
};

export const mockAuth = {
  session: null,
  user: null,
  profile: null,
  loading: false,
  isMerchant: false,
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  resetPassword: vi.fn(),
};

export const mockCart = {
  items: [],
  itemCount: 0,
  addToCart: vi.fn(),
  updateQuantity: vi.fn(),
  removeItem: vi.fn(),
  clearCart: vi.fn(),
};

export const mockFavorites = {
  favoriteIds: [] as string[],
  isFavorite: vi.fn(() => false),
  toggleFavorite: vi.fn(),
  removeFavorite: vi.fn(),
};

export const mockProductos = {
  products: [
    { id: 'p1', name: 'Product One', price: 99, image: '/img1.jpg', category: 'Tech', rating: 4, reviewCount: 10, stock: 'in_stock' as const },
    { id: 'p2', name: 'Product Two', price: 49, image: '/img2.jpg', category: 'Home', rating: 3, reviewCount: 5, stock: 'in_stock' as const },
  ],
  loading: false,
  error: null,
};

export const mockCategorias = {
  categories: [
    { id: 'tech', label: 'Tech', icon: 'laptop_mac' },
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'mas', label: 'Mas', icon: 'menu' },
  ],
  loading: false,
  error: null,
};

export const mockCountdown = {
  hours: 4,
  minutes: 12,
  secs: 45,
  pad: (n: number) => n.toString().padStart(2, '0'),
  total: 15165,
  paused: false,
  pause: vi.fn(),
  resume: vi.fn(),
  togglePause: vi.fn(),
};
