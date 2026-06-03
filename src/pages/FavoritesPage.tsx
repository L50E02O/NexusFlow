import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/shared/ui/Icon';
import { useCart } from '@/shared/context/CartContext';
import {
  favoriteProducts,
  favoriteRecommendations,
  catalogProducts,
  formatPrice,
} from '@/shared/data/mock';

export function FavoritesPage() {
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState(favoriteProducts);

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAdd = (id: string) => {
    const product =
      favorites.find((p) => p.id === id) ??
      catalogProducts.find((p) => p.id === id) ??
      favoriteRecommendations.find((p) => p.id === id);
    if (product && product.stock !== 'out') addToCart(product);
  };

  return (
    <main className="max-w-container-max mx-auto px-lg py-xl">
      <header className="mb-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-primary mb-xs">Mis Favoritos</h1>
            <p className="text-on-surface-variant text-body-md">
              Tienes <span className="font-bold text-on-surface">{favorites.length} productos</span>{' '}
              guardados en tu lista de deseos.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-md">
            <button
              type="button"
              className="px-md py-sm bg-surface-container-high rounded-full font-label-md text-label-md hover:bg-primary hover:text-white transition-colors"
            >
              Categoría
            </button>
            <button
              type="button"
              className="px-md py-sm bg-surface-container-high rounded-full font-label-md text-label-md hover:bg-primary hover:text-white transition-colors"
            >
              Disponibilidad
            </button>
            <div className="relative min-w-[180px]">
              <select className="w-full h-11 bg-white border border-outline-variant rounded-lg px-md font-label-md text-label-md appearance-none focus:ring-2 focus:ring-primary outline-none">
                <option>Ordenar por: Relevancia</option>
                <option>Precio: Menor a Mayor</option>
                <option>Precio: Mayor a Menor</option>
                <option>Recientes</option>
              </select>
              <Icon
                name="expand_more"
                className="absolute right-md top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant"
              />
            </div>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter mb-xxl">
        {favorites.map((product) => {
          const outOfStock = product.stock === 'out';
          return (
            <div
              key={product.id}
              className={`bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col group ${
                outOfStock ? 'opacity-75' : ''
              }`}
            >
              <div className={`relative aspect-square overflow-hidden rounded-t-xl ${outOfStock ? 'grayscale' : ''}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-500 ${outOfStock ? '' : 'group-hover:scale-110'}`}
                />
                {product.originalPrice && (
                  <div className="absolute top-md left-md bg-error text-white px-sm py-xs rounded-md text-label-md font-bold">
                    -
                    {Math.round(
                      ((product.originalPrice - product.price) / product.originalPrice) * 100,
                    )}
                    %
                  </div>
                )}
                {outOfStock && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-bold bg-black/60 px-lg py-sm rounded-full text-label-md uppercase tracking-widest">
                      Agotado
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeFavorite(product.id)}
                  className="absolute top-md right-md w-11 h-11 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-error shadow-sm hover:bg-white transition-all"
                  aria-label="Quitar de favoritos"
                >
                  <Icon name="favorite" filled />
                </button>
              </div>
              <div className="p-lg flex flex-col flex-1">
                <div className="flex items-center gap-xs mb-sm">
                  <div className="flex text-tertiary-container">
                    {[1, 2, 3, 4].map((i) => (
                      <Icon key={i} name="star" className="text-[18px]" filled={i <= Math.floor(product.rating)} />
                    ))}
                  </div>
                  <span className="text-label-md text-on-surface-variant">({product.reviewCount})</span>
                </div>
                <h3 className="font-headline-md text-body-lg text-primary mb-xs">{product.name}</h3>
                <p className="text-label-md text-secondary font-bold mb-md uppercase tracking-wider">
                  {product.category}
                </p>
                <div className="mt-auto">
                  <div className="flex items-center gap-sm mb-md">
                    <span className="text-headline-md font-bold text-on-surface">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-body-md text-on-surface-variant line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  {!outOfStock ? (
                    <div className="flex items-center gap-xs text-green-600 mb-lg">
                      <Icon name="check_circle" className="text-base" />
                      <span className="text-label-md">En Stock</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-xs text-error mb-lg">
                      <Icon name="info" className="text-base" />
                      <span className="text-label-md">Sin Stock</span>
                    </div>
                  )}
                  <button
                    type="button"
                    disabled={outOfStock}
                    onClick={() => handleAdd(product.id)}
                    className={`w-full h-12 rounded-xl font-button text-button transition-all flex items-center justify-center gap-sm ${
                      outOfStock
                        ? 'bg-surface-container text-on-surface-variant cursor-not-allowed'
                        : 'bg-primary-container text-white hover:bg-primary group-hover:shadow-lg'
                    }`}
                  >
                    <Icon name={outOfStock ? 'notifications_active' : 'shopping_cart'} />
                    {outOfStock ? 'Avísame cuando vuelva' : 'Añadir al Carrito'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="bg-surface-container-low rounded-xxl p-xl md:p-xxl">
        <div className="flex items-center gap-md mb-xl">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <Icon name="auto_awesome" className="text-white" filled />
          </div>
          <div>
            <h2 className="font-headline-md text-headline-md text-primary">Recomendaciones para ti</h2>
            <p className="text-on-surface-variant text-body-md">
              Sugerencias inteligentes basadas en tus favoritos.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {favoriteRecommendations.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-md flex flex-col group">
              <div className="relative aspect-[4/3] mb-md overflow-hidden rounded-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <h4 className="font-label-md text-body-md text-primary truncate mb-xs">{item.name}</h4>
              <span className="text-label-md text-on-surface font-bold mb-md">{formatPrice(item.price)}</span>
              <button
                type="button"
                onClick={() => handleAdd(item.id)}
                className="w-full py-sm border-2 border-primary text-primary rounded-lg font-button text-label-md hover:bg-primary hover:text-white transition-all"
              >
                Ver detalle
              </button>
            </div>
          ))}
        </div>
      </section>

      {favorites.length === 0 && (
        <p className="text-center text-on-surface-variant py-xxl">
          No tienes favoritos.{' '}
          <Link to="/tienda" className="text-primary font-bold hover:underline">
            Explorar tienda
          </Link>
        </p>
      )}
    </main>
  );
}
