import { Link } from 'react-router-dom';

import { CommerceJourney } from '../widgets/commerce-journey';
import { DataReadiness } from '../widgets/data-readiness';
import { ProductCatalog } from '../widgets/product-catalog';
import { StitchFlow } from '../widgets/stitch-gallery';
import { commerceScreenPath } from '../shared/lib/commerce-screens';

export function CommercePage() {
	return (
		<main
			className="app-shell"
			id="main-content"
			tabIndex={-1}
			data-route-announcement="Comercio adaptativo NexusFlow"
			aria-labelledby="commerce-title"
		>
			<div className="page commerce-page">
				<header className="commerce-hero">
					<div>
						<p className="eyebrow">NexusFlow · comercio adaptativo</p>
						<h1 className="commerce-hero-title" id="commerce-title" tabIndex={-1} data-route-focus>
							Tu tienda adaptiva, prototipada y lista para Supabase.
						</h1>
						<p className="commerce-hero-copy">
							Explorá el flujo completo de compra con las 25 UIs Stitch, conectá el catálogo real cuando tengas las
							variables de entorno y mantené el mismo recorrido para usuarios y merchants.
						</p>
					</div>
					<div className="commerce-hero-actions">
						<Link className="button button-primary" to={commerceScreenPath('catalog')}>
							Catálogo Stitch
						</Link>
						<Link className="button button-secondary" to={commerceScreenPath('cart')}>
							Carrito
						</Link>
						<Link className="button button-secondary" to={commerceScreenPath('checkout')}>
							Checkout
						</Link>
						<Link className="button button-ghost" to="/ui/domain/compra">
							Dominio compra
						</Link>
					</div>
				</header>

				<CommerceJourney />
				<ProductCatalog />
				<StitchFlow domain="compra" />
				<DataReadiness />
			</div>
		</main>
	);
}
