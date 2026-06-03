import { Link } from 'react-router-dom';
import { Icon } from '@/shared/ui/Icon';
import { useCountdown } from '@/shared/hooks/useCountdown';
import { abandonedCartLines, formatPrice } from '@/shared/data/mock';
import { useCart } from '@/shared/context/CartContext';

const PROMO_CODE = 'NEXUS10';

export function CartRecoveryPage() {
  const { pad, minutes, secs, total } = useCountdown(14 * 60 + 59);
  const { addToCart } = useCart();

  const subtotal = abandonedCartLines.reduce((s, l) => s + l.product.price * l.quantity, 0);
  const discount = subtotal * 0.1;
  const totalAfter = subtotal - discount;

  const restoreAll = () => {
    abandonedCartLines.forEach((line) => {
      for (let i = 0; i < line.quantity; i++) addToCart(line.product);
    });
  };

  return (
    <main className="max-w-container-max mx-auto px-lg py-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        <div className="lg:col-span-8 space-y-xl">
          <section>
            <h1 className="font-headline-lg text-headline-lg text-primary mb-sm">
              ¡Te extrañamos! Tu carrito te espera.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Hemos guardado estos artículos exclusivos para ti. Completa tu pedido antes de que se agoten.
            </p>
          </section>

          <section className="bg-primary-container text-white rounded-xl p-lg flex flex-col md:flex-row items-center justify-between gap-lg relative overflow-hidden">
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-secondary-container text-primary text-label-md font-bold rounded-full mb-md">
                OFERTA ESPECIAL
              </span>
              <h2 className="font-headline-lg text-headline-lg mb-xs">Obtén un 10% extra hoy</h2>
              <p className="opacity-90 font-body-md">
                Usa el código <span className="font-bold underline">{PROMO_CODE}</span> al finalizar tu compra.
              </p>
            </div>
            <div className="flex flex-col items-center glass-card p-md rounded-lg min-w-[160px] text-primary relative z-10 bg-white/80">
              <span className="text-label-md font-bold uppercase tracking-wider mb-sm text-primary">
                Expira en:
              </span>
              <div className="flex gap-md font-headline-md font-bold text-primary">
                <div className="flex flex-col items-center">
                  <span>{pad(Math.floor(total / 3600))}</span>
                  <span className="text-[10px] uppercase">Hrs</span>
                </div>
                <span>:</span>
                <div className="flex flex-col items-center">
                  <span>{pad(minutes)}</span>
                  <span className="text-[10px] uppercase">Min</span>
                </div>
                <span>:</span>
                <div className="flex flex-col items-center">
                  <span>{pad(secs)}</span>
                  <span className="text-[10px] uppercase">Seg</span>
                </div>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          </section>

          <section className="space-y-md">
            <h3 className="font-headline-md text-headline-md text-primary">Productos en tu carrito</h3>
            {abandonedCartLines.map((line) => (
              <div
                key={line.product.id}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col sm:flex-row gap-lg group hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-surface-container shrink-0">
                  <img
                    src={line.product.image}
                    alt={line.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow flex flex-col justify-between py-xs">
                  <div>
                    <h4 className="font-headline-md text-body-lg font-bold text-primary">{line.product.name}</h4>
                    <p className="text-on-surface-variant text-body-md">{line.variant}</p>
                  </div>
                  <p className="font-headline-md text-primary mt-md">{formatPrice(line.product.price)}</p>
                </div>
              </div>
            ))}
          </section>
        </div>

        <aside className="lg:col-span-4 space-y-xl">
          <section className="bg-white rounded-xl shadow-lg p-lg border border-outline-variant sticky top-28">
            <h3 className="font-headline-md text-headline-md text-primary mb-lg">Resumen del pedido</h3>
            <div className="space-y-md mb-xl">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal ({abandonedCartLines.length} productos)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-error font-bold">
                <span>Descuento ({PROMO_CODE})</span>
                <span>-{formatPrice(discount)}</span>
              </div>
              <div className="border-t border-outline-variant pt-md flex justify-between items-center">
                <span className="font-headline-md text-headline-md text-primary">Total</span>
                <span className="font-headline-md text-headline-md text-primary">{formatPrice(totalAfter)}</span>
              </div>
            </div>
            <div className="space-y-md">
              <button
                type="button"
                onClick={restoreAll}
                className="w-full bg-primary text-white py-4 rounded-xl font-button hover:bg-primary-container transition-all shadow-md flex items-center justify-center gap-md focus-ring"
              >
                Finalizar compra <Icon name="arrow_forward" />
              </button>
              <Link
                to="/carrito"
                className="w-full border-2 border-primary text-primary py-4 rounded-xl font-button hover:bg-surface-container transition-all flex items-center justify-center focus-ring"
              >
                Volver al carrito
              </Link>
            </div>
            <p className="mt-lg pt-lg border-t border-outline-variant text-center text-xs text-on-surface-variant flex items-center justify-center gap-xs">
              <Icon name="lock" className="text-sm" />
              Transacción 100% segura y cifrada
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}
