import { supabase } from '../../../shared/lib/supabase';
import type { FavoritoInsert, FavoritoUpdate } from '../../../shared/types/database/favoritos';

const tableName = 'favoritos';
const table = supabase.from(tableName) as any;

export const favoritosRepository = {
  listByUser(idUsuario: string) {
    return table.select('*').eq('id_usuario', idUsuario);
  },
  findByUserAndProduct(idUsuario: string, idProducto: string) {
    return table
      .select('*')
      .eq('id_usuario', idUsuario)
      .eq('id_producto', idProducto)
      .maybeSingle();
  },
  create(payload: FavoritoInsert) {
    return table.insert(payload).select('*').single();
  },
  removeByUserAndProduct(idUsuario: string, idProducto: string) {
    return table
      .delete()
      .eq('id_usuario', idUsuario)
      .eq('id_producto', idProducto);
  },
} as const;
