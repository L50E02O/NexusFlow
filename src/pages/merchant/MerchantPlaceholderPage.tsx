import { useLocation } from 'react-router-dom';
import { Icon } from '@/shared/ui/Icon';

const titles: Record<string, string> = {
  inventario: 'Gestión de Inventario',
  productos: 'Gestión de Productos',
  reportes: 'Reportes y Analíticas',
  devoluciones: 'Devoluciones y Reembolsos',
  seguridad: 'Seguridad y Detección de Fraude',
  asistente: 'Asistente IA Integrado',
};

export function MerchantPlaceholderPage() {
  const { pathname } = useLocation();
  const segment = pathname.split('/').pop() ?? '';
  const title = titles[segment] ?? 'Módulo Comerciante';

  return (
    <div className="p-xl max-w-container-max mx-auto text-center py-xxl">
      <Icon name="construction" className="text-primary text-5xl mb-lg" />
      <h1 className="text-headline-lg text-primary mb-md">{title}</h1>
      <p className="text-on-surface-variant text-body-lg max-w-lg mx-auto">
        Vista del portal comerciante en construcción. El panel principal ya incluye métricas, inventario bajo y pedidos
        recientes con datos de demostración.
      </p>
    </div>
  );
}
