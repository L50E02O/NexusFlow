import { HomeHero } from '../widgets/home-hero';
import { StitchFlow } from '../widgets/stitch-gallery';
import { DataReadiness } from '../widgets/data-readiness';
import { LayerStack } from '../widgets/layer-stack';
import { AdoptionRoadmap } from '../widgets/adoption-roadmap';

export function HomePage() {
  return (
    <main className="app-shell">
      <div className="page">
        <HomeHero />
        <StitchFlow />
        <LayerStack />
        <DataReadiness />
        <AdoptionRoadmap />

        <footer className="site-footer" aria-label="Pie de página">
          <span>NexusFlow · home, flujo Stitch y base de datos preparada</span>
          <span>Accesible, modular y lista para integrar datos reales.</span>
        </footer>
      </div>
    </main>
  );
}