import { HomeHero } from '../widgets/home-hero';
import { StitchShowcase } from '../widgets/stitch-showcase';
import { ProductCatalog } from '../widgets/product-catalog';
import { StitchFlow } from '../widgets/stitch-gallery';
import { LayerStack } from '../widgets/layer-stack';
import { AdoptionRoadmap } from '../widgets/adoption-roadmap';

export function HomePage() {
  return (
    <main className="app-shell">
      <div className="page">
        <HomeHero />

        <StitchShowcase />

        <ProductCatalog />

        {/* Integración directa del flujo Stitch para acceso natural desde el home */}
        <StitchFlow />

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