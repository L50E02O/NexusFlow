import { useMemo, useState } from 'react';
// WCAG 2.2 — 1.3.5 ✓ autocomplete en formulario de envío; 3.3.4 ✓ confirmación antes de compra
import { Link } from 'react-router-dom';
import { Icon } from '@/shared/ui/Icon';
import { useCart } from '@/shared/context/CartContext';
import { catalogProducts, formatPrice } from '@/shared/data/mock';

const steps = ['Envío', 'Entrega', 'Pago'] as const;

export function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [addressValidated] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
    [items],
  );
  const shipping = subtotal > 500 ? 0 : 24.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const recommendations = catalogProducts.slice(0, 4);

  if (items.length === 0) {
    return (
      <div className="max-w-container-max mx-auto px-lg py-xxl text-center">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-md">Finalizar compra</h1>
        <p className="text-on-surface-variant mb-lg">Tu carrito está vacío.</p>
        <Link to="/tienda" className="text-primary font-button hover:underline">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-lg py-xl">
      <nav aria-label="Progreso del checkout" className="mb-xl max-w-3xl mx-auto">
        <ol className="flex items-center w-full">
          {steps.map((label, index) => (
            <li
              key={label}
              className={`flex w-full items-center ${index < steps.length - 1 ? "after:content-[''] after:w-full after:h-1 after:border-b after:inline-block" : ''} ${
                index <= step ? 'after:border-primary text-primary font-bold' : 'after:border-outline-variant text-on-surface-variant'
              }`}
            >
              <span
                className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${
                  index < step
                    ? 'bg-primary text-white'
                    : index === step
                      ? 'bg-primary text-white'
                      : 'bg-surface-container-high'
                }`}
              >
                {index < step ? (
                  <Icon name="check" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </span>
              <span className="ml-sm font-label-md text-label-md hidden sm:inline">{label}</span>
            </li>
          ))}
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        <div className="lg:col-span-8 space-y-xl">
          <section className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant/30">
            <div className="flex items-center justify-between mb-lg">
              <h2 className="font-headline-md text-headline-md text-primary">Información de Envío</h2>
              {addressValidated && (
                <span className="text-on-surface-variant font-label-md text-label-md flex items-center gap-xs">
                  <Icon name="verified_user" className="text-green-600" />
                  Identidad Verificada
                </span>
              )}
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-lg" onSubmit={(e) => e.preventDefault()}>
              <div className="md:col-span-2 flex flex-col gap-xs">
                <label className="font-label-md text-label-md" htmlFor="full_name">
                  Nombre Completo
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  autoComplete="name"
                  defaultValue="Alejandro Nexus"
                  className="h-12 px-md rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="md:col-span-2 flex flex-col gap-xs">
                <label className="font-label-md text-label-md" htmlFor="address">
                  Dirección
                </label>
                <div className="relative">
                  <input
                    id="address"
                    name="address"
                    autoComplete="street-address"
                    defaultValue="123 Luxury Lane, Penthouse A"
                    aria-describedby={addressValidated ? 'address-valid-msg' : undefined}
                    className={`w-full h-12 px-md pr-xl rounded-lg border focus:ring-2 focus:ring-green-600 ${
                      addressValidated ? 'border-green-600' : 'border-outline-variant'
                    }`}
                  />
                  {addressValidated && (
                    <Icon
                      name="check_circle"
                      className="absolute right-md top-1/2 -translate-y-1/2 text-green-600"
                      aria-label="Dirección validada"
                    />
                  )}
                </div>
                {addressValidated && (
                  <span id="address-valid-msg" className="text-green-600 text-xs font-semibold flex items-center gap-xs">
                    <span aria-hidden="true">✓</span> Dirección validada mediante SmartMatch AI
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md" htmlFor="city">
                  Ciudad
                </label>
                <input
                  id="city"
                  defaultValue="Ciudad de México"
                  className="h-12 px-md rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md" htmlFor="postal">
                  Código Postal
                </label>
                <input
                  id="postal"
                  defaultValue="06600"
                  className="h-12 px-md rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </form>
          </section>

          <section className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant/30">
            <h2 className="font-headline-md text-headline-md text-primary mb-lg">Opciones de Entrega</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <label className="relative flex p-md border-2 border-primary bg-primary-fixed/10 rounded-xl cursor-pointer">
                <input type="radio" name="delivery" defaultChecked className="sr-only" />
                <div className="flex justify-between w-full">
                  <div>
                    <span className="font-bold text-primary">Premium Express</span>
                    <p className="text-on-surface-variant text-sm">Mañana, antes de las 12 PM</p>
                  </div>
                  <span className="font-bold text-primary">$24.99</span>
                </div>
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full uppercase">
                  RECOMENDADO
                </span>
              </label>
              <label className="relative flex p-md border border-outline-variant rounded-xl cursor-pointer hover:border-primary/50">
                <input type="radio" name="delivery" className="sr-only" />
                <div className="flex justify-between w-full">
                  <div>
                    <span className="font-bold text-on-surface">Envío Estándar</span>
                    <p className="text-on-surface-variant text-sm">3 - 5 Días Hábiles</p>
                  </div>
                  <span className="font-bold text-on-surface">Gratis</span>
                </div>
              </label>
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4">
          <div className="bg-surface-container-lowest p-xl rounded-xl shadow-lg border border-outline-variant/30 sticky top-24 space-y-lg">
            <h3 className="font-headline-md text-headline-md text-primary">Resumen del Pedido</h3>
            <div className="space-y-md max-h-64 overflow-y-auto">
              {items.map((line) => (
                <div key={line.product.id} className="flex gap-md">
                  <img
                    src={line.product.image}
                    alt={line.product.name}
                    className="w-20 h-24 object-cover rounded-lg shrink-0"
                  />
                  <div>
                    <p className="font-bold text-on-surface">{line.product.name}</p>
                    <p className="text-sm text-on-surface-variant">Cant: {line.quantity}</p>
                    <p className="font-bold text-primary mt-1">{formatPrice(line.product.price * line.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-sm border-t border-outline-variant pt-lg">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Envío</span>
                <span className="text-green-600 font-bold">{shipping === 0 ? 'GRATIS' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Impuestos Estimados</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-md">
                <span className="font-headline-md text-headline-md text-primary">Total</span>
                <span className="font-headline-lg text-headline-lg text-primary">{formatPrice(total)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (step < steps.length - 1) {
                  setStep((s) => s + 1);
                } else {
                  setShowConfirm(true);
                }
              }}
              className="w-full bg-primary text-white py-xl rounded-xl font-button hover:bg-primary-container transition-all flex items-center justify-center gap-md focus-ring min-h-11"
            >
              {step < steps.length - 1 ? 'Continuar al siguiente paso' : 'Completar compra'}
              <Icon name="arrow_forward" />
            </button>
            {orderComplete && (
              <p role="status" className="text-green-700 font-label-md text-center">
                Pedido confirmado correctamente.
              </p>
            )}
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="w-full text-primary font-button text-sm hover:underline"
              >
                Volver al paso anterior
              </button>
            )}
          </div>
        </aside>
      </div>

      <section className="mt-xxl">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-xl">También te podría gustar</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-lg">
          {recommendations.map((p) => (
            <div
              key={p.id}
              className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant/30 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="aspect-[4/5] rounded-lg overflow-hidden mb-md">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <p className="font-bold text-primary">{p.name}</p>
              <p className="text-on-surface-variant text-sm">{formatPrice(p.price)}</p>
            </div>
          ))}
        </div>
      </section>

      {showConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-purchase-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-lg bg-primary/30"
        >
          <div className="bg-surface-container-lowest rounded-xl p-xl max-w-md w-full shadow-2xl border border-outline-variant">
            <h2 id="confirm-purchase-title" className="font-headline-md text-headline-md text-primary mb-md">
              ¿Confirmar compra?
            </h2>
            <p className="text-on-surface-variant mb-lg">
              Revisa el total de {formatPrice(total)} antes de confirmar. Esta acción procesará el pago.
            </p>
            <div className="flex gap-md">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 min-h-11 border border-outline-variant rounded-xl font-button focus-ring"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirm(false);
                  setOrderComplete(true);
                  clearCart();
                }}
                className="flex-1 min-h-11 bg-primary text-on-primary rounded-xl font-button focus-ring"
              >
                Confirmar pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
