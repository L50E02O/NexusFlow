import fs from 'node:fs/promises';
import path from 'node:path';
import { stitch } from '@google/stitch-sdk';

const projectId = process.env.STITCH_PROJECT_ID ?? '7960131065642474682';
const outputDir = path.join(
  process.cwd(),
  'public',
  'stitch',
  'adaptive-ecommerce-auth-interface',
  'requested',
);
const manifestPath = path.join(process.cwd(), 'src', 'shared', 'lib', 'stitch-screens.generated.json');

const requestedScreens = [
  { id: '4b9d8d751fdb4d4eaf42022fb6ee1d75', title: 'Inicio de Sesión Inteligente - NexusFlow', folder: 'inicio_de_sesion_inteligente_nexusflow' },
  { id: 'b3c2cd83f7c04846bf78ba94d01806b5', title: 'Inicio Personalizado - LuxeCommerce', folder: 'inicio_personalizado_luxecommerce' },
  { id: 'fa89914bca2745f3bc5e0459da904050', title: 'Registro Inteligente Adaptativo - NexusFlow', folder: 'registro_inteligente_adaptativo_nexusflow' },
  { id: '1aeafcb11646440fa0a58dddb826afaf', title: 'Cupones y Promociones - NexusFlow', folder: 'cupones_y_promociones_nexusflow' },
  { id: '5140887d60c24146b6cdcaa93b352bc2', title: 'Configuración General - NexusFlow', folder: 'configuracion_general_nexusflow' },
  { id: '9e614e96b8e6464195d0cf4a7f3979de', title: 'Panel de Accesibilidad - NexusFlow', folder: 'panel_de_accesibilidad_nexusflow' },
  { id: 'a6140fc39bcb4357b8e3c1bcea71e3c9', title: 'Ofertas Personalizadas - NexusFlow', folder: 'ofertas_personalizadas_nexusflow' },
  { id: 'd9d9d5109f394bc28be1da9fd45fdfab', title: 'Perfil de Usuario - NexusFlow', folder: 'perfil_de_usuario_nexusflow' },
  { id: 'e9792abe8ba64c4fac08518453b52289', title: 'Historial de Compras - NexusFlow (ES)', folder: 'historial_de_compras_nexusflow_es' },
  { id: '289430bfdbd04aa2b1a409289a928198', title: 'Centro de Notificaciones - NexusFlow', folder: 'centro_de_notificaciones_nexusflow' },
  { id: '2e9a9a775c98455da26d9e9109195503', title: 'Soporte y Ayuda - NexusFlow', folder: 'soporte_y_ayuda_nexusflow' },
  { id: '65fa3adafbdc44d9a751ae8f6c940c47', title: 'Catálogo de Productos (ES) - LuxeCommerce', folder: 'catalogo_de_productos_es_luxecommerce' },
  { id: 'a53cbfe6606e42f9b3922dfabd6676d8', title: 'Mis Favoritos - NexusFlow', folder: 'mis_favoritos_nexusflow' },
  { id: '9eb080fc762142ccaa0cac3cb7f76684', title: 'Recuperación de Carrito - NexusFlow', folder: 'recuperacion_de_carrito_nexusflow' },
  { id: 'd5ac51f69e234f4481d25d2728f8603f', title: 'Carrito de Compras Integrado - NexusFlow', folder: 'carrito_de_compras_integrado_nexusflow' },
  { id: '38461b26fbdd4385877a064a93c1c747', title: 'Checkout Seguro (ES) - LuxeCommerce', folder: 'checkout_seguro_es_luxecommerce' },
  { id: '69cd149f38214844be2e5390be9240c3', title: 'Merchant Dashboard - LuxeCommerce', folder: 'merchant_dashboard_luxecommerce' },
  { id: 'b9f54a0a54084e93b0220213bc449bb7', title: 'Reportes y Analíticas - NexusFlow Merchant', folder: 'reportes_y_analiticas_nexusflow_merchant' },
  { id: 'ef748792352042fd8b250a770bf2b579', title: 'Gestión de Productos - NexusFlow Merchant', folder: 'gestion_de_productos_nexusflow_merchant' },
  { id: 'f1da2da7da9e4817b481778410a12cd4', title: 'Asistente IA Integrado - NexusFlow Merchant', folder: 'asistente_ia_integrado_nexusflow_merchant' },
  { id: '19b68716e75048aab9a97a7bdc086dae', title: 'Gestión de Devoluciones y Reembolsos - NexusFlow Admin', folder: 'gestion_de_devoluciones_y_reembolsos_nexusflow_admin' },
  { id: 'a4bcf0670b574e7dbf1a55b0c61617cd', title: 'Gestión de Inventario - NexusFlow Merchant Premium', folder: 'gestion_de_inventario_nexusflow_merchant_premium' },
  { id: 'f468ae1e48b04f59b20ad14781a86010', title: 'Seguridad y Detección de Fraude - NexusFlow Merchant Premium', folder: 'seguridad_y_deteccion_de_fraude_nexusflow_merchant_premium' },
  { id: '497e06e699434a08a2f36fd427dafc7c', title: 'Facturas y Pagos - NexusFlow', folder: 'facturas_y_pagos_nexusflow' },
  { id: '18129e25f8be4d0a86687ec2992386a0', title: 'Mensajería y Comunicación - NexusFlow', folder: 'mensajeria_y_comunicacion_nexusflow' },
];

const project = stitch.project(projectId);
await fs.mkdir(outputDir, { recursive: true });

const manifest = [];

for (const screenRef of requestedScreens) {
  const screen = await project.getScreen(screenRef.id);
  const htmlUrl = await screen.getHtml();
  const imageUrl = await screen.getImage();
  const screenDir = path.join(outputDir, screenRef.folder);
  await fs.mkdir(path.join(screenDir, 'assets'), { recursive: true });

  if (htmlUrl) {
    const htmlResponse = await fetch(htmlUrl);
    let htmlText = await htmlResponse.text();
    const bridgeTag =
      '<script src="/stitch-bridge-boot.js" defer data-nf-screen="' +
      screenRef.id +
      '"></script>';
    if (!htmlText.includes('stitch-bridge-boot')) {
      if (htmlText.includes('</body>')) {
        htmlText = htmlText.replace('</body>', `${bridgeTag}\n</body>`);
      } else {
        htmlText += bridgeTag;
      }
    }
    await fs.writeFile(path.join(screenDir, 'code.html'), htmlText, 'utf8');
  }

  if (imageUrl) {
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    await fs.writeFile(path.join(screenDir, 'screen.png'), imageBuffer);
  }

  manifest.push({
    id: screenRef.id,
    title: screenRef.title,
    slug: screenRef.folder,
    htmlPath: `/${path.posix.join('stitch', 'adaptive-ecommerce-auth-interface', 'requested', screenRef.folder, 'code.html')}`,
    imagePath: `/${path.posix.join('stitch', 'adaptive-ecommerce-auth-interface', 'requested', screenRef.folder, 'screen.png')}`,
  });
}

await fs.writeFile(manifestPath, JSON.stringify({ projectId, screens: manifest }, null, 2) + '\n');

console.log(JSON.stringify({
  projectId,
  downloadedScreens: manifest.length,
  manifestPath,
  outputDir,
}, null, 2));
