import { Link } from 'react-router-dom';
import { Icon } from '@/shared/ui/Icon';
import { ProductCard } from '@/components/product/ProductCard';
import { useCart } from '@/shared/context/CartContext';
import { useCountdown } from '@/shared/hooks/useCountdown';
import {
  categories,
  featuredProduct,
  aiPicks,
  trendingProducts,
  heroImage,
  flashSaleProduct,
  recentlyViewed,
  formatPrice,
} from '@/shared/data/mock';

export function HomePage() {
  const { addToCart } = useCart();
  const countdown = useCountdown(4 * 3600 + 12 * 60 + 45);

  return (
    <div className="max-w-container-max mx-auto px-lg space-y-xxl pb-xxl">
      <section className="mt-lg rounded-xl overflow-hidden relative min-h-[500px] flex items-center shadow-sm">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent" />
        </div>
        <div className="relative z-10 p-xxl max-w-2xl text-on-primary">
          <div className="inline-flex items-center gap-sm bg-primary-container/50 backdrop-blur-md px-md py-xs rounded-full mb-md border border-white/20">
            <Icon name="auto_awesome" className="text-lg" />
            <span className="font-label-md text-label-md uppercase tracking-wider">IA Curada para Ti</span>
          </div>
          <h1 className="font-display-lg text-display-lg mb-md">
            Perfección a medida para tu estilo de vida.
          </h1>
          <p className="font-body-lg text-body-lg mb-xl opacity-90">
            Basado en tu reciente interés en diseño sostenible y minimalista, hemos preparado una
            nueva colección estacional.
          </p>
          <div className="flex flex-wrap gap-md">
            <Link
              to="/tienda"
              className="bg-on-primary text-primary px-xl py-md rounded-lg font-button hover:bg-primary-fixed transition-all shadow-lg active:scale-95 focus-ring"
            >
              Explorar Selección
            </Link>
            <Link
              to="/ofertas"
              className="bg-transparent border-2 border-on-primary text-on-primary px-xl py-md rounded-lg font-button hover:bg-white/10 transition-all focus-ring"
            >
              Ver Tendencias
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-end mb-lg">
          <h2 className="font-headline-lg text-headline-lg text-primary">Descubrir por Categoría</h2>
          <Link to="/categorias" className="text-primary font-label-md hover:underline flex items-center gap-xs focus-ring">
            Ver Todo <Icon name="arrow_forward" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-lg">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/tienda?cat=${cat.id}`}
              className="group text-center space-y-md"
            >
              <div className="aspect-square bg-surface-container flex items-center justify-center rounded-xl transition-all group-hover:bg-primary-container group-hover:text-on-primary-fixed shadow-sm">
                <Icon name={cat.icon} className="text-[48px] transition-transform group-hover:scale-110" />
              </div>
              <p className="font-label-md text-label-md text-on-surface">{cat.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-secondary-fixed/10 p-xl rounded-xl">
        <div className="flex items-center gap-md mb-xl">
          <Icon name="auto_awesome" className="text-primary text-[32px]" />
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary">Seleccionado Para Ti</h2>
            <p className="text-on-surface-variant font-body-md">Se adapta a tu estilo y compras anteriores.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-lg">
          <div className="md:col-span-2 bg-surface-container-lowest rounded-lg p-lg shadow-sm flex flex-col group hover:-translate-y-1 transition-all">
            <div className="relative rounded-lg overflow-hidden flex-1 mb-md aspect-video md:aspect-auto md:min-h-[200px]">
              <img src={featuredProduct.image} alt={featuredProduct.name} className="w-full h-full object-cover" />
              {featuredProduct.badge && (
                <div className="absolute top-4 left-4 bg-primary text-on-primary px-sm py-xs rounded font-label-md text-xs flex items-center gap-xs">
                  <Icon name="star" className="text-sm" filled /> {featuredProduct.badge}
                </div>
              )}
            </div>
            <div className="space-y-sm">
              <h3 className="font-headline-md text-headline-md text-primary">{featuredProduct.name}</h3>
              <p className="text-on-surface-variant line-clamp-1">Se adapta a tu estilo y compras anteriores.</p>
              <div className="flex justify-between items-center pt-md">
                <span className="text-primary font-bold text-headline-md">{formatPrice(featuredProduct.price)}</span>
                <button
                  type="button"
                  onClick={() => addToCart(featuredProduct)}
                  className="bg-primary text-on-primary px-lg py-sm rounded-lg font-button flex items-center gap-sm hover:opacity-90 focus-ring"
                >
                  <Icon name="add_shopping_cart" /> Añadir
                </button>
              </div>
            </div>
          </div>
          {aiPicks.map((p) => (
            <div
              key={p.id}
              className="bg-surface-container-lowest rounded-lg p-lg shadow-sm group hover:-translate-y-1 transition-all flex flex-col"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden mb-md">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="bg-secondary-container/30 text-primary-container px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-xs w-fit">
                  {p.category}
                </div>
                <h3 className="font-label-md text-label-md text-primary">{p.name}</h3>
                <p className="text-primary font-bold mt-xs">{formatPrice(p.price)}</p>
              </div>
              <button
                type="button"
                onClick={() => addToCart(p)}
                className="mt-md w-full border border-primary text-primary py-sm rounded-lg font-button hover:bg-primary hover:text-on-primary transition-all focus-ring"
              >
                Compra Rápida
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
        <div className="lg:col-span-1 bg-primary text-on-primary p-xl rounded-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-sm mb-md text-secondary-fixed">
              <Icon name="timer" />
              <span className="font-label-md tracking-widest uppercase">Oferta Relámpago</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg mb-md">La Venta de Medianoche termina en:</h2>
            <div className="flex gap-md mb-xl">
              <div className="text-center">
                <span className="block text-[32px] font-bold">{countdown.pad(countdown.hours)}</span>
                <span className="text-xs opacity-70 uppercase">HOR</span>
              </div>
              <span className="text-[32px] font-bold">:</span>
              <div className="text-center">
                <span className="block text-[32px] font-bold">{countdown.pad(countdown.minutes)}</span>
                <span className="text-xs opacity-70 uppercase">MIN</span>
              </div>
              <span className="text-[32px] font-bold">:</span>
              <div className="text-center">
                <span className="block text-[32px] font-bold">{countdown.pad(countdown.secs)}</span>
                <span className="text-xs opacity-70 uppercase">SEG</span>
              </div>
            </div>
            <div className="space-y-md">
              <div className="flex items-center gap-md bg-white/10 p-md rounded-lg">
                <img src={flashSaleProduct.image} alt={flashSaleProduct.name} className="w-16 h-16 object-cover rounded" />
                <div>
                  <p className="font-bold">{flashSaleProduct.name}</p>
                  <p className="text-secondary-fixed font-bold">
                    {formatPrice(flashSaleProduct.price)}{' '}
                    <span className="line-through text-on-primary/50 text-sm ml-sm">
                      {formatPrice(flashSaleProduct.originalPrice!)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <Link
              to="/ofertas"
              className="mt-xl w-full bg-on-primary text-primary py-md rounded-lg font-button hover:bg-secondary-fixed transition-all focus-ring block text-center"
            >
              Reclamar Descuento
            </Link>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-lg">
            <h2 className="font-headline-lg text-headline-lg text-primary">Tendencias Actuales</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {trendingProducts.map((p) => (
              <ProductCard key={p.id} product={p} variant="compact" />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-outline-variant pt-xxl">
        <h2 className="font-headline-md text-headline-md text-on-surface-variant mb-lg">Continuar Navegando</h2>
        <div className="flex gap-lg overflow-x-auto pb-md">
          {recentlyViewed.map((item) => (
            <div
              key={item.name}
              className="min-w-[120px] flex flex-col gap-sm grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
            >
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
              <p className="text-xs font-medium truncate">{item.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface-container-low py-xl rounded-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-xl text-center">
          {[
            { icon: 'verified_user', title: 'Pago Seguro SSL', desc: 'Sus datos siempre están encriptados.' },
            { icon: 'local_shipping', title: 'Envío Global Express', desc: 'Envío con seguimiento a más de 50 países.' },
            { icon: 'published_with_changes', title: 'Devoluciones Fáciles', desc: 'Política de devolución de 30 días.' },
            { icon: 'eco', title: 'Origen Ético', desc: 'Compromiso con la sostenibilidad.' },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center gap-sm">
              <Icon name={item.icon} className="text-primary text-[40px]" />
              <p className="font-bold text-primary">{item.title}</p>
              <p className="text-xs text-on-surface-variant">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
