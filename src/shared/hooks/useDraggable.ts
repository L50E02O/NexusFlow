import { useCallback, useRef, useState, type CSSProperties, type PointerEvent } from 'react';

type Position = { x: number; y: number };

type UseDraggableOptions = {
  initial?: Position;
  dragThreshold?: number;
};

export function useDraggable({ initial, dragThreshold = 6 }: UseDraggableOptions = {}) {
  const [position, setPosition] = useState<Position | null>(initial ?? null);
  const dragState = useRef({
    active: false,
    moved: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    width: 0,
    height: 0,
  });

  const clamp = useCallback((x: number, y: number, w: number, h: number) => {
    const margin = 8;
    const maxX = Math.max(margin, window.innerWidth - w - margin);
    const maxY = Math.max(margin, window.innerHeight - h - margin);
    return {
      x: Math.min(Math.max(margin, x), maxX),
      y: Math.min(Math.max(margin, y), maxY),
    };
  }, []);

  const onPointerDown = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (e.button !== 0) return;
      const el = e.currentTarget;
      const root = (el.closest('[data-draggable]') as HTMLElement | null) ?? el;
      const rect = root.getBoundingClientRect();
      const origin = position ?? { x: rect.left, y: rect.top };
      if (!position) setPosition(origin);
      dragState.current = {
        active: true,
        moved: false,
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        originX: origin.x,
        originY: origin.y,
        width: rect.width,
        height: rect.height,
      };
      el.setPointerCapture(e.pointerId);
    },
    [position],
  );

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      const s = dragState.current;
      if (!s.active || e.pointerId !== s.pointerId) return;
      const dx = e.clientX - s.startX;
      const dy = e.clientY - s.startY;
      if (!s.moved && Math.hypot(dx, dy) < dragThreshold) return;
      s.moved = true;
      const next = clamp(s.originX + dx, s.originY + dy, s.width, s.height);
      setPosition(next);
    },
    [clamp, dragThreshold],
  );

  const onPointerEnd = useCallback((e: PointerEvent<HTMLElement>) => {
    const s = dragState.current;
    if (!s.active || e.pointerId !== s.pointerId) return;
    s.active = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  }, []);

  const wasDragged = useCallback(() => dragState.current.moved, []);

  const fixedStyle: CSSProperties | undefined = position
    ? { position: 'fixed', left: position.x, top: position.y, right: 'auto', bottom: 'auto', zIndex: 60 }
    : undefined;

  return {
    position,
    fixedStyle,
    onPointerDown,
    onPointerMove,
    onPointerEnd,
    wasDragged,
  };
}
