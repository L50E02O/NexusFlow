import { useEffect, useState } from 'react';

export function useCountdown(totalSeconds: number) {
  const [seconds, setSeconds] = useState(totalSeconds);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');

  return { hours: h, minutes: m, secs: s, pad, total: seconds };
}
