import { describe, it, expect } from 'vitest';
import { navigationItems, heroMetrics, layerCards, roadmapSteps, ctaItems } from './site-data';

describe('site-data', () => {
  it('navigationItems has items with label and href', () => {
    expect(navigationItems.length).toBeGreaterThan(0);
    navigationItems.forEach((item) => {
      expect(item.label).toBeTruthy();
      expect(item.href).toBeTruthy();
    });
  });

  it('heroMetrics has items with value and label', () => {
    expect(heroMetrics.length).toBeGreaterThan(0);
    heroMetrics.forEach((m) => {
      expect(m.value).toBeTruthy();
      expect(m.label).toBeTruthy();
    });
  });

  it('layerCards has items with name, title, description and tags', () => {
    expect(layerCards.length).toBeGreaterThan(0);
    layerCards.forEach((c) => {
      expect(c.name).toBeTruthy();
      expect(c.title).toBeTruthy();
      expect(c.description).toBeTruthy();
      expect(Array.isArray(c.tags)).toBe(true);
    });
  });

  it('roadmapSteps has items with title, description and items', () => {
    expect(roadmapSteps.length).toBeGreaterThan(0);
    roadmapSteps.forEach((s) => {
      expect(s.title).toBeTruthy();
      expect(s.description).toBeTruthy();
      expect(Array.isArray(s.items)).toBe(true);
    });
  });

  it('ctaItems is a non-empty array of strings', () => {
    expect(ctaItems.length).toBeGreaterThan(0);
    ctaItems.forEach((item) => expect(typeof item).toBe('string'));
  });
});
