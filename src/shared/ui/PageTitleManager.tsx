import { useLocation } from 'react-router-dom';
import { usePageTitle } from '@/shared/hooks/usePageTitle';

const titles: Record<string, string> = {
  '/': 'Inicio',
  '/tienda': 'Tienda',
  '/categorias': 'Categorías',
  '/sostenibilidad': 'Sostenibilidad',
  '/soporte': 'Soporte y accesibilidad',
  '/mensajeria': 'Mensajería',
  '/cupones': 'Cupones',
  '/notificaciones': 'Notificaciones',
  '/ofertas': 'Ofertas',
  '/carrito': 'Carrito',
  '/favoritos': 'Favoritos',
  '/perfil': 'Mi perfil',
  '/configuracion': 'Configuración',
  '/checkout': 'Finalizar compra',
  '/terminos': 'Términos de uso',
  '/privacidad': 'Política de privacidad',
  '/politicas-devoluciones': 'Política de devoluciones',
  '/metodos-pago': 'Métodos de pago',
  '/sobre-nosotros': 'Sobre nosotros',
  '/carreras': 'Carreras',
  '/historial': 'Historial de compras',
  '/recuperar-carrito': 'Recuperar carrito',
  '/facturas': 'Facturas',
  '/login': 'Iniciar sesión',
  '/merchant': 'Panel comerciante',
  '/merchant/inventario': 'Inventario',
  '/merchant/productos': 'Productos',
  '/merchant/reportes': 'Reportes',
  '/merchant/devoluciones': 'Devoluciones',
  '/merchant/seguridad': 'Seguridad',
  '/merchant/asistente': 'Asistente IA',
};

export function PageTitleManager() {
  const { pathname } = useLocation();
  const section = titles[pathname] ?? 'NexusFlow';
  usePageTitle(section);
  return null;
}
