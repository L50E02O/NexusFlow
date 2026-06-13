import { HomeHero } from '../widgets/home-hero';
import { LayerStack } from '../widgets/layer-stack';
import { AdoptionRoadmap } from '../widgets/adoption-roadmap';

export function HomePage() {
  return (
    <main className="app-shell">
      <div className="page">
        <HomeHero />
        <LayerStack />
        <AdoptionRoadmap />

        <footer className="site-footer" aria-label="Pie de página">
          <span>NexusFlow · plantilla adaptada para Vite</span>
          <span>Accesible, modular y preparada para crecer.</span>
        </footer>
      </div>
    </main>
  );
}