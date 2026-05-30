import { Link, useParams } from 'react-router-dom';
import { stitchDomains } from '../shared/lib/stitch-domains';
import { StitchShowcase } from '../widgets/stitch-showcase';
import { StitchFlow } from '../widgets/stitch-gallery';

export function UiDomainPage() {
	const { domain } = useParams<{ domain: string }>();
	const current = stitchDomains.find(d => d.anchor === domain);

	if (!domain) return (
		<main className="page">
			<p>Dominio no especificado. <Link to="/ui">Volver al hub</Link></p>
		</main>
	);

	return (
		<main
			className="app-shell ui-domain-page page"
			id="main-content"
			tabIndex={-1}
			data-route-announcement={current ? `Dominio Stitch: ${current.title}` : 'Dominio Stitch'}
			aria-labelledby="domain-page-title"
		>
			<aside className="domain-sidebar" aria-label="Navegación de dominios">
				<h2>Dominios</h2>
				<ul>
					{stitchDomains.map(d => (
						<li key={d.anchor} className={d.anchor === domain ? 'active' : ''}>
							<Link to={`/ui/domain/${d.anchor}`}>{d.title}</Link>
						</li>
					))}
				</ul>
				<div className="sidebar-actions">
					<Link to="/ui" className="button button-secondary">Volver al hub</Link>
				</div>
			</aside>

			<section className="domain-main">
				<header className="domain-header">
					<h1 id="domain-page-title" tabIndex={-1} data-route-focus>
						{current ? current.title : 'Dominio'}
					</h1>
					<p className="domain-summary">{current?.description}</p>
				</header>

				<section className="domain-showcase">
					<StitchShowcase domain={domain} />
				</section>

				<section className="domain-flow">
					<StitchFlow domain={domain} />
				</section>
			</section>
		</main>
	);
}