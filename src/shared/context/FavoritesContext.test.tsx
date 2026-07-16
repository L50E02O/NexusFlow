import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { type ReactNode } from 'react';
import { FavoritesProvider, useFavorites } from './FavoritesContext';

const { mockUseAuth } = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
}));

vi.mock('@/shared/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

const { mockFavoritosRepository } = vi.hoisted(() => ({
  mockFavoritosRepository: {
    listByUser: vi.fn(),
    create: vi.fn(),
    removeByUserAndProduct: vi.fn(),
  },
}));

vi.mock('@/entities/favoritos/api/favoritos.repository', () => ({
  favoritosRepository: mockFavoritosRepository,
}));

vi.mock('@/shared/data/mock', () => ({
  favoriteProducts: [
    { id: 'fav-1', name: 'Fav 1', price: 10, image: '', category: 'Tech', rating: 4, reviewCount: 1 },
    { id: 'fav-2', name: 'Fav 2', price: 20, image: '', category: 'Tech', rating: 4, reviewCount: 1 },
  ],
}));

function wrapper({ children }: { children: ReactNode }) {
  return <FavoritesProvider>{children}</FavoritesProvider>;
}

describe('FavoritesContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({ user: null });
    localStorage.clear();
    mockFavoritosRepository.listByUser.mockResolvedValue({ data: [], error: null });
    mockFavoritosRepository.create.mockResolvedValue({ data: null, error: null });
    mockFavoritosRepository.removeByUserAndProduct.mockResolvedValue({ data: null, error: null });
  });

  it('useFavorites throws outside provider', () => {
    expect(() => {
      renderHook(() => useFavorites());
    }).toThrow('useFavorites debe usarse dentro de FavoritesProvider');
  });

  it('loads from localStorage when not logged in', () => {
    localStorage.setItem('nexusflow-favorites', JSON.stringify(['stored-1', 'stored-2']));

    const { result } = renderHook(() => useFavorites(), { wrapper });

    expect(result.current.favoriteIds).toEqual(['stored-1', 'stored-2']);
  });

  it('falls back to mock favorites when localStorage is empty', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });

    expect(result.current.favoriteIds).toEqual(['fav-1', 'fav-2']);
  });

  it('isFavorite returns true for stored IDs', () => {
    localStorage.setItem('nexusflow-favorites', JSON.stringify(['stored-1']));

    const { result } = renderHook(() => useFavorites(), { wrapper });

    expect(result.current.isFavorite('stored-1')).toBe(true);
    expect(result.current.isFavorite('not-stored')).toBe(false);
  });

  it('toggleFavorite adds locally when not logged in', async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });

    await act(async () => {
      await result.current.toggleFavorite('new-fav');
    });

    expect(result.current.favoriteIds).toContain('new-fav');
  });

  it('toggleFavorite removes locally when not logged in', async () => {
    localStorage.setItem('nexusflow-favorites', JSON.stringify(['fav-1', 'fav-2']));

    const { result } = renderHook(() => useFavorites(), { wrapper });

    await act(async () => {
      await result.current.toggleFavorite('fav-1');
    });

    expect(result.current.favoriteIds).not.toContain('fav-1');
    expect(result.current.favoriteIds).toContain('fav-2');
  });

  it('removeFavorite removes locally when not logged in', async () => {
    localStorage.setItem('nexusflow-favorites', JSON.stringify(['fav-1', 'fav-2']));

    const { result } = renderHook(() => useFavorites(), { wrapper });

    await act(async () => {
      await result.current.removeFavorite('fav-1');
    });

    expect(result.current.favoriteIds).not.toContain('fav-1');
  });

  it('loads favorites from DB when logged in', async () => {
    mockUseAuth.mockReturnValue({ user: { id: 'user1' } });
    mockFavoritosRepository.listByUser.mockResolvedValue({
      data: [
        { id_producto: 'db-fav-1' },
        { id_producto: 'db-fav-2' },
      ],
      error: null,
    });

    const { result } = renderHook(() => useFavorites(), { wrapper });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockFavoritosRepository.listByUser).toHaveBeenCalledWith('user1');
    expect(result.current.favoriteIds).toEqual(['db-fav-1', 'db-fav-2']);
  });

  it('toggleFavorite calls repository.create when logged in and not favorite', async () => {
    mockUseAuth.mockReturnValue({ user: { id: 'user1' } });
    mockFavoritosRepository.listByUser.mockResolvedValue({
      data: [],
      error: null,
    });

    const { result } = renderHook(() => useFavorites(), { wrapper });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    await act(async () => {
      await result.current.toggleFavorite('new-prod');
    });

    expect(mockFavoritosRepository.create).toHaveBeenCalledWith({
      id_usuario: 'user1',
      id_producto: 'new-prod',
    });
  });

  it('toggleFavorite calls repository.removeByUserAndProduct when logged in and is favorite', async () => {
    mockUseAuth.mockReturnValue({ user: { id: 'user1' } });
    mockFavoritosRepository.listByUser.mockResolvedValue({
      data: [{ id_producto: 'existing-fav' }],
      error: null,
    });

    const { result } = renderHook(() => useFavorites(), { wrapper });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    await act(async () => {
      await result.current.toggleFavorite('existing-fav');
    });

    expect(mockFavoritosRepository.removeByUserAndProduct).toHaveBeenCalledWith(
      'user1',
      'existing-fav',
    );
  });
});
