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

import { pedidosRepository } from './pedidos.repository';

beforeEach(() => {
  for (const m of ['select', 'eq', 'maybeSingle', 'insert', 'update', 'delete', 'single', 'order']) {
    mockTable[m].mockClear();
    mockTable[m].mockImplementation(() => mockTable);
  }
  mockTable.single.mockResolvedValue({ data: null, error: null });
  mockTable.maybeSingle.mockResolvedValue({ data: null, error: null });
});

describe('pedidosRepository', () => {
  it('list calls select(*)', async () => {
    await pedidosRepository.list();
    expect(mockTable.select).toHaveBeenCalledWith('*');
  });

  it('findById calls select eq maybeSingle', async () => {
    await pedidosRepository.findById('123');
    expect(mockTable.select).toHaveBeenCalledWith('*');
    expect(mockTable.eq).toHaveBeenCalledWith('id_pedido', '123');
    expect(mockTable.maybeSingle).toHaveBeenCalled();
  });

  it('create calls insert select single', async () => {
    const payload = { id_pedido: '123' };
    await pedidosRepository.create(payload as any);
    expect(mockTable.insert).toHaveBeenCalledWith(payload);
    expect(mockTable.select).toHaveBeenCalledWith('*');
    expect(mockTable.single).toHaveBeenCalled();
  });

  it('update calls update eq select single', async () => {
    const payload = { id_pedido: '123' };
    await pedidosRepository.update('123', payload as any);
    expect(mockTable.update).toHaveBeenCalledWith(payload);
    expect(mockTable.eq).toHaveBeenCalledWith('id_pedido', '123');
    expect(mockTable.select).toHaveBeenCalledWith('*');
    expect(mockTable.single).toHaveBeenCalled();
  });

  it('remove calls delete eq', async () => {
    await pedidosRepository.remove('123');
    expect(mockTable.delete).toHaveBeenCalled();
    expect(mockTable.eq).toHaveBeenCalledWith('id_pedido', '123');
  });
});
