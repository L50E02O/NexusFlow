import { Icon } from '@/shared/ui/Icon';
import type { Product } from '@/shared/data/mock';
import { formatPrice } from '@/shared/data/mock';

type ProductCardProps = {
  product: Product;
  variant?: 'grid' | 'compact';
  onAddToCart?: (id: string) => void;
};

export function ProductCard({ product, variant = 'grid', onAddToCart }: ProductCardProps) {
  const stockLabel =
    product.stock === 'low'
      ? 'Poco stock'
      : product.stock === 'out'
        ? 'Agotado'
        : 'En stock';

  if (variant === 'compact') {
    return (
      <div className="group cursor-pointer">
        <div className="aspect-[3/4] rounded-xl overflow-hidden mb-md shadow-sm">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <h3 className="font-label-md text-label-md text-on-surface">{product.name}</h3>
        <p className="text-primary font-bold">{formatPrice(product.price)}</p>
      </div>
    );
  }

  return (
    <div className="bg-surface group rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col border border-outline-variant/30">
      <div className="relative aspect-square overflow-hidden bg-surface-container">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.stock && (
          <span
            className={`absolute top-md left-md px-md py-xs rounded-full text-label-md shadow-sm text-white ${
              product.stock === 'low' ? 'bg-error' : product.stock === 'out' ? 'bg-outline' : 'bg-secondary'
            }`}
          >
            {stockLabel}
          </span>
        )}
        <button
          type="button"
          aria-label={`Añadir ${product.name} a favoritos`}
          className="absolute top-md right-md min-w-11 min-h-11 bg-white/80 backdrop-blur-md p-xs rounded-full text-primary hover:bg-white transition-colors focus-ring"
        >
          <Icon name="favorite" />
        </button>
      </div>
      <div className="p-lg flex flex-col flex-grow space-y-sm">
        <h3 className="font-headline-md text-primary leading-tight">{product.name}</h3>
        <div className="flex items-center gap-xs text-tertiary">
          <div className="flex">
            {[1, 2, 3, 4].map((i) => (
              <Icon key={i} name="star" className="text-[18px]" filled />
            ))}
          </div>
          <span className="text-label-md text-on-surface-variant">({product.reviewCount})</span>
        </div>
        <p className="font-headline-md text-primary pt-xs">{formatPrice(product.price)}</p>
        <div className="pt-md mt-auto">
          <button
            type="button"
            onClick={() => onAddToCart?.(product.id)}
            className="w-full bg-primary text-white py-md px-lg rounded-xl font-button hover:bg-primary-container transition-all shadow-md active:scale-95 flex justify-center items-center gap-sm h-12"
          >
            <Icon name="add_shopping_cart" className="text-xl" />
            Añadir rápido
          </button>
        </div>
      </div>
    </div>
  );
}
