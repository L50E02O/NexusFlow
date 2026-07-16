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

import { menuAccesibilidadRepository } from './menu-accesibilidad.repository';

beforeEach(() => {
  for (const m of ['select', 'eq', 'maybeSingle', 'insert', 'update', 'delete', 'single', 'order']) {
    mockTable[m].mockClear();
    mockTable[m].mockImplementation(() => mockTable);
  }
  mockTable.single.mockResolvedValue({ data: null, error: null });
  mockTable.maybeSingle.mockResolvedValue({ data: null, error: null });
});

describe('menuAccesibilidadRepository', () => {
  it('list calls select and order by nombre_categoria ascending', async () => {
    await menuAccesibilidadRepository.list();
    expect(mockTable.select).toHaveBeenCalledWith('*');
    expect(mockTable.order).toHaveBeenCalledWith('nombre_categoria', { ascending: true });
  });
});
