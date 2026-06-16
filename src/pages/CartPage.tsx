import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/shared/ui/Icon';
import { ProductCard } from '@/components/product/ProductCard';
import { useCart } from '@/shared/context/CartContext';
import { useProductos } from '@/shared/hooks/useProductos';
import { formatPrice } from '@/shared/data/mock';

export function CartPage() {
  const { items, updateQuantity, removeItem, addToCart } = useCart();
  const { products } = useProductos();

  const subtotal = useMemo(
    () => items.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
    [items],
  );
  const shipping = subtotal > 500 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const recommendations = products.slice(0, 4);

  return (
    <div className="max-w-container-max mx-auto px-lg py-xxl">
      <header className="mb-xl">
        <h1 className="font-headline-lg text-headline-lg text-primary">Carrito de Compras</h1>
        <p className="text-on-surface-variant mt-2">
          Tienes {items.length} {items.length === 1 ? 'artículo' : 'artículos'} en tu carrito.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl items-start">
        <div className="lg:col-span-8 space-y-md">
          {items.map((line) => (
            <div
              key={line.product.id}
              className="bg-surface-container-lowest rounded-lg p-md shadow-sm border border-outline-variant flex flex-col sm:flex-row gap-md items-center card-lift"
            >
              <div className="w-full sm:w-32 h-32 bg-surface-container rounded-lg overflow-hidden shrink-0">
                <img src={line.product.image} alt={line.product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow flex flex-col sm:flex-row justify-between w-full py-xs">
                <div>
                  <h3 className="font-headline-md text-primary">{line.product.name}</h3>
                  <p className="text-on-surface-variant text-body-md">{line.product.category}</p>
                  <div className="flex items-center gap-xl mt-md">
                    <div className="flex items-center border border-outline-variant rounded-lg p-1">
                      <button
                        type="button"
                        aria-label="Disminuir cantidad"
                        onClick={() => updateQuantity(line.product.id, -1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-surface-container rounded"
                      >
                        <Icon name="remove" className="text-sm" />
                      </button>
                      <span className="px-3 font-bold">{line.quantity}</span>
                      <button
                        type="button"
                        aria-label="Aumentar cantidad"
                        onClick={() => updateQuantity(line.product.id, 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-surface-container rounded"
                      >
                        <Icon name="add" className="text-sm" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(line.product.id)}
                      className="flex items-center gap-xs text-error font-label-md hover:underline"
                    >
                      <Icon name="delete" className="text-lg" />
                      Eliminar
                    </button>
                  </div>
                </div>
                <p className="font-headline-md text-primary sm:text-right mt-md sm:mt-0">
                  {formatPrice(line.product.price * line.quantity)}
                </p>
              </div>
            </div>
          ))}
          <Link
            to="/tienda"
            className="inline-flex items-center gap-2 text-primary font-button hover:underline focus-ring p-2"
          >
            <Icon name="arrow_back" />
            Continuar Comprando
          </Link>
        </div>

        <aside className="lg:col-span-4">
          <div className="bg-surface-container-lowest rounded-lg p-xl shadow-lg border border-outline-variant sticky top-24 space-y-lg">
            <h2 className="font-headline-md text-headline-md text-primary">Resumen del Pedido</h2>
            <div className="space-y-md border-b border-outline-variant pb-lg">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Envío (Est.)</span>
                <span className="font-semibold">{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Impuestos (Est.)</span>
                <span className="font-semibold">{formatPrice(tax)}</span>
              </div>
            </div>
            <div className="space-y-sm">
              <label className="font-label-md text-on-surface-variant" htmlFor="coupon">
                ¿Tienes un cupón?
              </label>
              <div className="flex gap-sm">
                <input
                  id="coupon"
                  type="text"
                  placeholder="Código de descuento"
                  className="flex-grow bg-surface border border-outline-variant rounded-lg px-md h-11 focus-ring"
                />
                <button
                  type="button"
                  className="bg-secondary-container text-on-secondary-container px-md rounded-lg font-button h-11 hover:opacity-90"
                >
                  Aplicar
                </button>
              </div>
            </div>
            <div className="flex justify-between items-baseline pt-md">
              <span className="font-headline-md text-headline-md text-primary">Total</span>
              <span className="font-display-lg text-headline-lg text-primary">{formatPrice(total)}</span>
            </div>
            <Link
              to="/checkout"
              className="w-full bg-primary text-on-primary py-xl rounded-lg font-button text-lg shadow-md hover:bg-primary-container transition-all active:scale-95 flex items-center justify-center gap-md focus-ring h-16"
            >
              Proceder al Pago
            </Link>
            <div className="flex items-center justify-center gap-md pt-sm">
              <Icon name="verified_user" className="text-primary" filled />
              <p className="text-label-md text-on-surface-variant">Pago seguro y encriptado SSL</p>
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-xxl pt-xxl border-t border-outline-variant">
        <div className="flex justify-between items-center mb-xl">
          <h2 className="font-headline-lg text-headline-lg text-primary">Recomendado para ti</h2>
          <Link to="/tienda" className="text-primary font-button hover:underline focus-ring">
            Ver todo
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
          {recommendations.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} onAddToCart={() => addToCart(p)} />
          ))}
        </div>
      </section>
    </div>
  );
}
