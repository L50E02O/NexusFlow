import { useState } from 'react';
import { Icon } from '@/shared/ui/Icon';
import { coupons } from '@/shared/data/mock';
import { useCountdown } from '@/shared/hooks/useCountdown';

export function CouponsPage() {
  const [applied, setApplied] = useState<string[]>([]);
  const countdown = useCountdown(2 * 3600 + 45 * 60 + 12);

  const applyCoupon = (code: string) => {
    setApplied((prev) => (prev.includes(code) ? prev : [...prev, code]));
  };

  return (
    <main className="max-w-container-max mx-auto px-lg py-xl">
      <section className="mb-xxl">
        <div className="relative rounded-xl overflow-hidden bg-primary-container h-[300px] flex items-center p-xl">
          <div className="relative z-10 max-w-2xl">
            <h1 className="font-headline-lg text-headline-lg text-primary-fixed mb-md">
              Centro de Beneficios NexusFlow
            </h1>
            <p className="font-body-lg text-body-lg text-primary-fixed-dim mb-lg">
              Optimiza tus compras con ahorros exclusivos diseñados por nuestra inteligencia artificial.
            </p>
            <div className="flex gap-md flex-wrap">
              <button type="button" className="bg-primary-fixed text-on-primary-fixed px-lg py-md rounded-xl font-button hover:opacity-90 focus-ring">
                Explorar Ofertas
              </button>
              <button type="button" className="border-2 border-primary-fixed text-primary-fixed px-lg py-md rounded-xl font-button hover:bg-primary-fixed/10 focus-ring">
                Mis Recompensas
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-lg mb-xxl">
        <section className="md:col-span-8">
          <h2 className="font-headline-md text-headline-md text-primary flex items-center gap-sm mb-lg">
            <Icon name="auto_awesome" filled /> Sugerencias IA para ti
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant">
              <span className="bg-secondary-container text-on-secondary-container text-label-md px-md py-xs rounded-full">
                Basado en tu interés en Tech
              </span>
              <h3 className="font-headline-md text-headline-md my-sm">20% OFF en Accesorios</h3>
              <p className="text-on-surface-variant mb-lg">Complementa tu última compra con lo mejor de NexusGear.</p>
              <div className="text-label-md text-on-surface-variant">
                Código: <span className="font-bold text-primary">TECH20AUTO</span>
              </div>
              <button type="button" className="w-full mt-lg bg-primary text-on-primary py-md rounded-xl font-button hover:opacity-90 focus-ring">
                Aplicar a mi Carrito
              </button>
            </div>
          </div>
        </section>

        <section className="md:col-span-4">
          <h2 className="font-headline-md text-headline-md text-primary mb-lg flex items-center gap-sm">
            <Icon name="timer" className="text-error" /> Ofertas Flash
          </h2>
          <div className="bg-primary-container text-on-primary-container p-lg rounded-xl relative overflow-hidden">
            <div className="text-secondary-fixed font-bold mb-xs">TERMINA EN:</div>
            <div className="flex gap-sm mb-md">
              <span className="bg-primary px-3 py-1 rounded text-headline-md font-bold">
                {countdown.pad(countdown.hours)}
              </span>
              <span className="text-headline-md font-bold">:</span>
              <span className="bg-primary px-3 py-1 rounded text-headline-md font-bold">
                {countdown.pad(countdown.minutes)}
              </span>
              <span className="text-headline-md font-bold">:</span>
              <span className="bg-primary px-3 py-1 rounded text-headline-md font-bold">
                {countdown.pad(countdown.secs)}
              </span>
            </div>
            <div className="text-display-lg font-display-lg text-white mb-xs">40% OFF</div>
            <p className="font-body-md text-primary-fixed-dim">En toda la sección de Hogar</p>
          </div>
        </section>
      </div>

      <section className="mb-xxl">
        <h2 className="font-headline-md text-headline-md text-primary mb-lg">Cupones Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {coupons.map((c) => (
            <div
              key={c.code}
              className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant flex flex-col hover:border-secondary transition-all"
            >
              <div className="p-lg flex-1">
                <div className="flex items-center gap-md mb-md">
                  <div className="w-12 h-12 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center">
                    <Icon name={c.icon} />
                  </div>
                  <div>
                    <div className="text-display-lg font-display-lg text-primary leading-none">{c.discount}</div>
                    <div className="text-label-md font-bold text-on-surface-variant uppercase">{c.title}</div>
                  </div>
                </div>
                <p className="text-on-surface-variant mb-md">{c.description}</p>
                <div className="flex justify-between text-label-md text-outline">
                  <span>Expira: {c.expires}</span>
                  <span>#{c.code}</span>
                </div>
              </div>
              <div className="p-lg bg-surface-container-low border-t border-dashed border-outline-variant flex items-center justify-between">
                <div className="bg-white border-2 border-outline-variant border-dashed px-md py-sm rounded-lg font-bold text-primary tracking-widest">
                  {c.code}
                </div>
                <button
                  type="button"
                  onClick={() => applyCoupon(c.code)}
                  disabled={applied.includes(c.code)}
                  className="bg-secondary text-on-secondary px-lg py-sm rounded-xl font-button hover:opacity-90 focus-ring disabled:opacity-50"
                >
                  {applied.includes(c.code) ? 'Aplicado' : 'Aplicar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
