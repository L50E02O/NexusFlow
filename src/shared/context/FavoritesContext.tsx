import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { favoriteProducts as initialFavorites } from '@/shared/data/mock';
import { useAuth } from '@/shared/context/AuthContext';
import { favoritosRepository } from '@/entities/favoritos/api/favoritos.repository';

const STORAGE_KEY = 'nexusflow-favorites';

function loadFavoriteIdsFromStorage(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as string[];
  } catch {
    /* ignore */
  }
  return initialFavorites.map((p) => p.id);
}

type FavoritesContextValue = {
  favoriteIds: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: Readonly<{ children: ReactNode }>) {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<string[]>(loadFavoriteIdsFromStorage);
  const [useLocalFallback, setUseLocalFallback] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setUseLocalFallback(true);
      setFavoriteIds(loadFavoriteIdsFromStorage());
      return;
    }

    let cancelled = false;

    async function loadFavorites() {
      const { data, error } = await favoritosRepository.listByUser(user.id);
      if (cancelled) return;
      if (error) {
        console.error('Error cargando favoritos desde Supabase:', error);
        setUseLocalFallback(true);
        setFavoriteIds(loadFavoriteIdsFromStorage());
        return;
      }
      setUseLocalFallback(false);
      setFavoriteIds(
        (data ?? [])
          .map((favorite) => favorite.id_producto)
          .filter((id): id is string => Boolean(id)),
      );
    }

    loadFavorites();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    if (useLocalFallback) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
    }
  }, [favoriteIds, useLocalFallback]);

  const isFavorite = useCallback((id: string) => favoriteIds.includes(id), [favoriteIds]);

  const reloadFavorites = useCallback(async () => {
    if (!user?.id) return;
    const { data, error } = await favoritosRepository.listByUser(user.id);
    if (error) {
      console.error('Error recargando favoritos desde Supabase:', error);
      return;
    }
    setFavoriteIds(
      (data ?? [])
        .map((favorite) => favorite.id_producto)
        .filter((id): id is string => Boolean(id)),
    );
  }, [user?.id]);

  const toggleFavorite = useCallback(
    async (id: string) => {
      if (!user?.id || useLocalFallback) {
        setFavoriteIds((prev) =>
          prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id],
        );
        return;
      }

      if (favoriteIds.includes(id)) {
        const { error } = await favoritosRepository.removeByUserAndProduct(user.id, id);
        if (!error) await reloadFavorites();
        return;
      }

      const { error } = await favoritosRepository.create({ id_usuario: user.id, id_producto: id });
      if (!error) await reloadFavorites();
    },
    [favoriteIds, reloadFavorites, user?.id, useLocalFallback],
  );

  const removeFavorite = useCallback(
    async (id: string) => {
      if (!user?.id || useLocalFallback) {
        setFavoriteIds((prev) => prev.filter((fid) => fid !== id));
        return;
      }

      const { error } = await favoritosRepository.removeByUserAndProduct(user.id, id);
      if (!error) await reloadFavorites();
    },
    [reloadFavorites, user?.id, useLocalFallback],
  );

  const value = useMemo(
    () => ({ favoriteIds, isFavorite, toggleFavorite, removeFavorite }),
    [favoriteIds, isFavorite, toggleFavorite, removeFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites debe usarse dentro de FavoritesProvider');
  return ctx;
}
