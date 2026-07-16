import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockTable } = vi.hoisted(() => {
  const mockTable: Record<string, any> = {};
  for (const m of ['select', 'eq', 'maybeSingle', 'insert', 'update', 'delete', 'single', 'order']) {
    mockTable[m] = vi.fn(() => mockTable);
  }
  mockTable.then = undefined;
  return { mockTable };
});

vi.mock('../../../shared/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => mockTable),
  },
}));

import { favoritosRepository } from './favoritos.repository';

beforeEach(() => {
  for (const m of ['select', 'eq', 'maybeSingle', 'insert', 'update', 'delete', 'single', 'order']) {
    mockTable[m].mockClear();
    mockTable[m].mockImplementation(() => mockTable);
  }
  mockTable.single.mockResolvedValue({ data: null, error: null });
  mockTable.maybeSingle.mockResolvedValue({ data: null, error: null });
});

describe('favoritosRepository', () => {
  it('listByUser calls select eq', async () => {
    await favoritosRepository.listByUser('user-1');
    expect(mockTable.select).toHaveBeenCalledWith('*');
    expect(mockTable.eq).toHaveBeenCalledWith('id_usuario', 'user-1');
  });

  it('findByUserAndProduct calls select eq eq maybeSingle', async () => {
    await favoritosRepository.findByUserAndProduct('user-1', 'prod-1');
    expect(mockTable.select).toHaveBeenCalledWith('*');
    expect(mockTable.eq).toHaveBeenCalledWith('id_usuario', 'user-1');
    expect(mockTable.eq).toHaveBeenCalledWith('id_producto', 'prod-1');
    expect(mockTable.maybeSingle).toHaveBeenCalled();
  });

  it('create calls insert select single', async () => {
    const payload = { id_usuario: 'user-1', id_producto: 'prod-1' };
    await favoritosRepository.create(payload as any);
    expect(mockTable.insert).toHaveBeenCalledWith(payload);
    expect(mockTable.select).toHaveBeenCalledWith('*');
    expect(mockTable.single).toHaveBeenCalled();
  });

  it('removeByUserAndProduct calls delete eq eq', async () => {
    await favoritosRepository.removeByUserAndProduct('user-1', 'prod-1');
    expect(mockTable.delete).toHaveBeenCalled();
    expect(mockTable.eq).toHaveBeenCalledWith('id_usuario', 'user-1');
    expect(mockTable.eq).toHaveBeenCalledWith('id_producto', 'prod-1');
  });
});
