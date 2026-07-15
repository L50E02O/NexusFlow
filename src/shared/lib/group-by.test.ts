import { describe, it, expect } from 'vitest';
import { groupBy } from './group-by';

describe('groupBy', () => {
  it('groups items by a string key', () => {
    const items = [
      { type: 'a', value: 1 },
      { type: 'b', value: 2 },
      { type: 'a', value: 3 },
    ];
    const result = groupBy(items, 'type');
    expect(result).toEqual({
      a: [
        { type: 'a', value: 1 },
        { type: 'a', value: 3 },
      ],
      b: [{ type: 'b', value: 2 }],
    });
  });

  it('returns empty object for empty array', () => {
    expect(groupBy([], 'type')).toEqual({});
  });

  it('handles single item', () => {
    const items = [{ type: 'x', value: 10 }];
    const result = groupBy(items, 'type');
    expect(result).toEqual({ x: [{ type: 'x', value: 10 }] });
  });

  it('groups by numeric key converting to string', () => {
    const items = [
      { id: 1, name: 'a' },
      { id: 1, name: 'b' },
      { id: 2, name: 'c' },
    ];
    const result = groupBy(items, 'id');
    expect(Object.keys(result)).toEqual(['1', '2']);
    expect(result['1']).toHaveLength(2);
  });
});
