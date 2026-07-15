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

import { categoriasRepository } from './categorias.repository';

beforeEach(() => {
  for (const m of ['select', 'eq', 'maybeSingle', 'insert', 'update', 'delete', 'single', 'order']) {
    mockTable[m].mockClear();
    mockTable[m].mockImplementation(() => mockTable);
  }
  mockTable.single.mockResolvedValue({ data: null, error: null });
  mockTable.maybeSingle.mockResolvedValue({ data: null, error: null });
});

describe('categoriasRepository', () => {
  it('list calls select(*)', async () => {
    await categoriasRepository.list();
    expect(mockTable.select).toHaveBeenCalledWith('*');
  });

  it('findById calls select eq maybeSingle', async () => {
    await categoriasRepository.findById('123');
    expect(mockTable.select).toHaveBeenCalledWith('*');
    expect(mockTable.eq).toHaveBeenCalledWith('id_categoria', '123');
    expect(mockTable.maybeSingle).toHaveBeenCalled();
  });

  it('create calls insert select single', async () => {
    const payload = { id_categoria: '123' };
    await categoriasRepository.create(payload as any);
    expect(mockTable.insert).toHaveBeenCalledWith(payload);
    expect(mockTable.select).toHaveBeenCalledWith('*');
    expect(mockTable.single).toHaveBeenCalled();
  });

  it('update calls update eq select single', async () => {
    const payload = { id_categoria: '123' };
    await categoriasRepository.update('123', payload as any);
    expect(mockTable.update).toHaveBeenCalledWith(payload);
    expect(mockTable.eq).toHaveBeenCalledWith('id_categoria', '123');
    expect(mockTable.select).toHaveBeenCalledWith('*');
    expect(mockTable.single).toHaveBeenCalled();
  });

  it('remove calls delete eq', async () => {
    await categoriasRepository.remove('123');
    expect(mockTable.delete).toHaveBeenCalled();
    expect(mockTable.eq).toHaveBeenCalledWith('id_categoria', '123');
  });
});
