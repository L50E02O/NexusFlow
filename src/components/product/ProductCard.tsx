import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@/shared/ui/Icon';
import type { Product } from '@/shared/data/mock';
import { formatPrice } from '@/shared/data/mock';
import { useFavorites } from '@/shared/context/FavoritesContext';
import { useAuth } from '@/shared/context/AuthContext';

type ProductCardProps = {
  product: Product;
  variant?: 'grid' | 'compact';
  onAddToCart?: (id: string) => void;
};

export function ProductCard({ product, variant = 'grid', onAddToCart }: ProductCardProps) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { session } = useAuth();
  const favorited = isFavorite(product.id);

  const stockLabel =
    product.stock === 'low'
      ? 'Poco stock'
      : product.stock === 'out'
        ? 'Agotado'
        : 'En stock';

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      navigate('/login', { state: { from: { pathname: window.location.pathname } } });
      return;
    }
    toggleFavorite(product.id);
  };

  const filledStars = Math.min(5, Math.round(product.rating));

  if (variant === 'compact') {
    return (
      <Link to={`/tienda?q=${encodeURIComponent(product.name)}`} className="group cursor-pointer block">
        <div className="aspect-[3/4] rounded-xl overflow-hidden mb-md shadow-sm">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <h3 className="font-label-md text-label-md text-on-surface">{product.name}</h3>
        <p className="text-primary font-bold">{formatPrice(product.price)}</p>
      </Link>
    );
  }

  return (
    <div className="bg-surface group rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col border border-outline-variant/30">
      <div className="relative aspect-square overflow-hidden bg-surface-container">
        <Link to={`/tienda?q=${encodeURIComponent(product.name)}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
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
          aria-label={
            favorited
              ? `Quitar ${product.name} de favoritos`
              : `Añadir ${product.name} a favoritos`
          }
          aria-pressed={favorited}
          onClick={handleFavorite}
          className={`absolute top-md right-md min-w-11 min-h-11 backdrop-blur-md p-xs rounded-full transition-colors focus-ring ${
            favorited
              ? 'bg-error/90 text-white'
              : 'bg-white/80 text-primary hover:bg-white'
          }`}
        >
          <Icon name="favorite" filled={favorited} />
        </button>
      </div>
      <div className="p-lg flex flex-col flex-grow space-y-sm">
        <Link to={`/tienda?q=${encodeURIComponent(product.name)}`}>
          <h3 className="font-headline-md text-primary leading-tight hover:underline">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-xs text-tertiary">
          <div className="flex" aria-label={`Valoración: ${product.rating} de 5`}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Icon key={i} name="star" className="text-[18px]" filled={i <= filledStars} />
            ))}
          </div>
          <span className="text-label-md text-on-surface-variant">({product.reviewCount})</span>
        </div>
        <p className="font-headline-md text-primary pt-xs">{formatPrice(product.price)}</p>
        <div className="pt-md mt-auto">
          <button
            type="button"
            onClick={() => onAddToCart?.(product.id)}
            disabled={product.stock === 'out'}
            className="w-full bg-primary text-white py-md px-lg rounded-xl font-button hover:bg-primary-container transition-all shadow-md active:scale-95 flex justify-center items-center gap-sm h-12 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="add_shopping_cart" className="text-xl" />
            Añadir rápido
          </button>
        </div>
      </div>
    </div>
  );
}
