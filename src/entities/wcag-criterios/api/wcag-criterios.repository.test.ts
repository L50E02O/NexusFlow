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

import { wcagCriteriosRepository } from './wcag-criterios.repository';

beforeEach(() => {
  for (const m of ['select', 'eq', 'maybeSingle', 'insert', 'update', 'delete', 'single', 'order']) {
    mockTable[m].mockClear();
    mockTable[m].mockImplementation(() => mockTable);
  }
  mockTable.single.mockResolvedValue({ data: null, error: null });
  mockTable.maybeSingle.mockResolvedValue({ data: null, error: null });
});

describe('wcagCriteriosRepository', () => {
  it('list calls select and order by criterio ascending', async () => {
    await wcagCriteriosRepository.list();
    expect(mockTable.select).toHaveBeenCalledWith('*');
    expect(mockTable.order).toHaveBeenCalledWith('criterio', { ascending: true });
  });

  it('update calls update eq select single', async () => {
    const payload = { criterio: '1.1.1' };
    await wcagCriteriosRepository.update('123', payload as any);
    expect(mockTable.update).toHaveBeenCalledWith(payload);
    expect(mockTable.eq).toHaveBeenCalledWith('id', '123');
    expect(mockTable.select).toHaveBeenCalledWith('*');
    expect(mockTable.single).toHaveBeenCalled();
  });
});
