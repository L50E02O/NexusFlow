export interface FavoritoRow {
  id_favorito: string;
  id_usuario: string | null;
  id_producto: string | null;
  created_at?: string | null;
}

export interface FavoritoInsert {
  id_favorito?: string;
  id_usuario?: string | null;
  id_producto?: string | null;
}

export interface FavoritoUpdate {
  id_favorito?: string;
  id_usuario?: string | null;
  id_producto?: string | null;
}
