import { useSearchParams } from 'react-router-dom';

import { CommerceJourney } from '../widgets/commerce-journey';
import { HomeHero } from '../widgets/home-hero';
import { StitchShowcase } from '../widgets/stitch-showcase';
import { ProductCatalog } from '../widgets/product-catalog';
import { StitchFlow } from '../widgets/stitch-gallery';
import { LayerStack } from '../widgets/layer-stack';
import { AdoptionRoadmap } from '../widgets/adoption-roadmap';

export function HomePage() {
	const [searchParams] = useSearchParams();
	const query = searchParams.get('q') ?? '';
	const domain = searchParams.get('domain') ?? '';

  return (
    <main className="app-shell" id="main-content" tabIndex={-1} data-route-announcement="Inicio de NexusFlow" aria-labelledby="hero-title">
      <div className="page">
        <HomeHero />

        <StitchShowcase query={query} domain={domain} />

        <CommerceJourney />

        <ProductCatalog query={query} />

        {/* Integración directa del flujo Stitch para acceso natural desde el home */}
        <StitchFlow query={query} domain={domain} />

        <LayerStack />

        <AdoptionRoadmap />

        <footer className="site-footer" aria-label="Pie de página">
          <span>NexusFlow · home, flujo Stitch y base de datos preparada</span>
          <span>Accesible, modular y lista para integrar datos reales.</span>
        </footer>
      </div>
    </main>
  );
}