import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { commerceScreenPath } from '../shared/lib/commerce-screens';
import { isSupabaseConfigured } from '../shared/lib/supabase';

type ProductRow = {
	id_producto?: string;
	id?: string;
	nombre?: string;
	descripcion?: string;
	precio?: number | string;
	stock?: number;
	categoria?: string;
	id_categoria?: string;
	url?: string;
	imagen?: string;
	name?: string;
	summary?: string;
};

interface ProductCatalogProps {
	readonly query?: string;
}

function normalizeSearchText(value: string) {
	return value
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.trim();
}

export function ProductCatalog({ query }: ProductCatalogProps) {
	const [products, setProducts] = useState<ProductRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [dbConfigured, setDbConfigured] = useState<boolean | null>(null);

	const normalizedQuery = normalizeSearchText(query ?? '');
	const filteredProducts = products.filter(product => {
		if (!normalizedQuery) return true;

		const searchable = normalizeSearchText(
			[product.nombre, product.descripcion, product.categoria, product.id_categoria, product.name, product.summary]
				.filter(Boolean)
				.join(' '),
		);

		return searchable.includes(normalizedQuery);
	});

	useEffect(() => {
		let mounted = true;

		(async () => {
			try {
				const configured = isSupabaseConfigured();

				if (!mounted) return;
				setDbConfigured(configured);

				if (!configured) {
					setProducts([]);
					return;
				}

				const { productosRepository } = await import('../entities/productos/api/productos.repository');
				const res = await productosRepository.list();
				const data = res?.data ?? res?.body ?? res ?? [];

				if (!mounted) return;
				setProducts(Array.isArray(data) ? data : []);
			} catch {
				if (!mounted) return;
				setDbConfigured(false);
				setProducts([]);
			} finally {
				if (mounted) setLoading(false);
			}
		})();

		return () => {
			mounted = false;
		};
	}, []);

	return (
		<section className="section product-catalog" id="catalogo" aria-labelledby="catalogo-title">
			<div className="section-heading">
				<div>
					<p className="eyebrow">Catálogo</p>
					<h2 id="catalogo-title">Catálogo de productos</h2>
				</div>
				<p>
					Mientras conectas Supabase, el prototipo Stitch del catálogo cubre el recorrido visual. Con las variables de
					entorno, esta sección consume la tabla <strong>productos</strong> automáticamente.
				</p>
			</div>

			{dbConfigured === false ? (
				<div className="empty-state product-catalog-setup" role="status" aria-live="polite">
					<h3>Conexión a Supabase pendiente</h3>
					<p>
						Copia <code>.env.example</code> a <code>.env</code> y define <strong>VITE_SUPABASE_URL</strong> y{' '}
						<strong>VITE_SUPABASE_ANON_KEY</strong>. Los repositorios ya están listos.
					</p>
					<div className="atlas-card-actions">
						<Link className="button button-primary" to={commerceScreenPath('catalog')}>
							Ver catálogo Stitch
						</Link>
						<a className="button button-secondary" href="#datos">
							Guía de conexión
						</a>
					</div>
				</div>
			) : null}

			{loading && dbConfigured ? <p role="status">Cargando productos…</p> : null}

			{!loading && dbConfigured && products.length === 0 ? (
				<div className="empty-state" role="status" aria-live="polite">
					<h3>No hay productos en la base</h3>
					<p>
						La conexión está activa. Inserta registros en <strong>productos</strong> desde Supabase o revisa las
						políticas RLS.
					</p>
					<Link className="button button-secondary" to={commerceScreenPath('catalog')}>
						Abrir catálogo Stitch
					</Link>
				</div>
			) : null}

			{!loading && filteredProducts.length > 0 ? (
				<ul className="atlas-grid" aria-label="Listado de productos">
					{filteredProducts.map(product => {
						const id = product.id_producto ?? product.id ?? String(product.name ?? Math.random());
						const imageUrl = product.url ?? product.imagen ?? '';
						const categoryLabel = product.categoria ?? product.id_categoria ?? 'general';
						const price = Number(product.precio ?? 0);
						const productName = product.nombre ?? product.name ?? 'Producto sin nombre';

						return (
							<li className="atlas-card" key={id}>
								<div className="atlas-card-media" aria-hidden={imageUrl ? 'false' : 'true'}>
									{imageUrl ? (
										<img src={imageUrl} alt={`Imagen de ${productName}`} />
									) : (
										<div className="atlas-card-placeholder">Sin imagen</div>
									)}
								</div>

								<div className="atlas-card-body">
									<div className="atlas-card-topline">
										<span className="atlas-chip">Producto</span>
										<span className="atlas-folder">/{categoryLabel}</span>
									</div>

									<h3>{productName}</h3>
									<p>{product.descripcion ?? product.summary ?? ''}</p>

									<p className="atlas-screen-id">Precio: ${price.toLocaleString('es-ES')}</p>
									<p className="atlas-screen-id">Stock: {product.stock ?? 0}</p>

									<div className="atlas-card-actions">
										<Link
											className="button button-primary"
											to={commerceScreenPath('catalog')}
											aria-label={`Ver catálogo Stitch para ${productName}`}
										>
											Ver en UI Stitch
										</Link>
										<Link
											className="button button-secondary"
											to={commerceScreenPath('cart')}
											aria-label={`Ir al carrito desde ${productName}`}
										>
											Ir al carrito
										</Link>
									</div>
								</div>
							</li>
						);
					})}
				</ul>
			) : null}

			{!loading && dbConfigured && products.length > 0 && filteredProducts.length === 0 ? (
				<div className="empty-state" role="status" aria-live="polite">
					<h3>No encontramos coincidencias</h3>
					<p>
						La búsqueda <strong>{query}</strong> no coincide con productos cargados.
					</p>
				</div>
			) : null}
		</section>
	);
}
