import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/shared/context/AuthContext';
import { CartProvider } from '@/shared/context/CartContext';
import { FavoritesProvider } from '@/shared/context/FavoritesContext';
import { ChatProvider } from '@/shared/context/ChatContext';
import { I18nProvider } from '@/shared/i18n/I18nContext';
import { ProtectedRoute } from '@/shared/ui/ProtectedRoute';
import { MerchantRoute } from '@/shared/ui/MerchantRoute';
import { AppLayout } from '@/widgets/layout/AppLayout';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { HomePage } from '@/pages/HomePage';
import { ShopPage } from '@/pages/ShopPage';
import { CategoriesPage } from '@/pages/CategoriesPage';
import { SustainabilityPage } from '@/pages/SustainabilityPage';
import { CouponsPage } from '@/pages/CouponsPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { SupportPage } from '@/pages/SupportPage';
import { LoginPage } from '@/pages/LoginPage';
import { CartPage } from '@/pages/CartPage';
import { OffersPage } from '@/pages/OffersPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { PurchaseHistoryPage } from '@/pages/PurchaseHistoryPage';
import { CartRecoveryPage } from '@/pages/CartRecoveryPage';
import { InvoicesPage } from '@/pages/InvoicesPage';
import { InfoPage } from '@/pages/InfoPage';
import { AccessibilityProvider } from '@/shared/context/AccessibilityContext';
import { MerchantLayout } from '@/widgets/layout/MerchantLayout';
import { MerchantDashboardPage } from '@/pages/merchant/MerchantDashboardPage';
import { MerchantInventoryPage } from '@/pages/merchant/MerchantInventoryPage';
import { MerchantProductsPage } from '@/pages/merchant/MerchantProductsPage';
import { MerchantReportsPage } from '@/pages/merchant/MerchantReportsPage';
import { MerchantReturnsPage } from '@/pages/merchant/MerchantReturnsPage';
import { MerchantSecurityPage } from '@/pages/merchant/MerchantSecurityPage';
import { MerchantAssistantPage } from '@/pages/merchant/MerchantAssistantPage';
import { MessagingPage } from '@/pages/MessagingPage';
import { PageTitleManager } from '@/shared/ui/PageTitleManager';
import { MerchantHomeRedirect } from '@/shared/ui/MerchantHomeRedirect';
import { ShortcutsProvider } from '@/shared/context/ShortcutsContext';
import { GlobalShortcuts } from '@/components/shortcuts/GlobalShortcuts';
import { NavigationShortcuts } from '@/components/shortcuts/NavigationShortcuts';
import { ShortcutsModal } from '@/components/shortcuts/ShortcutsModal';

function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <PageTitleManager />
        <ShortcutsProvider>
          <AuthProvider>
            <AccessibilityProvider>
              <GlobalShortcuts />
              <NavigationShortcuts />
              <ShortcutsModal />
              <CartProvider>
                <FavoritesProvider>
                  <ChatProvider>
                    <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                      path="/merchant"
                      element={
                        <MerchantRoute>
                          <MerchantLayout />
                        </MerchantRoute>
                      }
                    >
                      <Route index element={<MerchantDashboardPage />} />
                      <Route path="inventario" element={<MerchantInventoryPage />} />
                      <Route path="productos" element={<MerchantProductsPage />} />
                      <Route path="reportes" element={<MerchantReportsPage />} />
                      <Route path="devoluciones" element={<MerchantReturnsPage />} />
                      <Route path="seguridad" element={<MerchantSecurityPage />} />
                      <Route path="asistente" element={<MerchantAssistantPage />} />
                    </Route>
                    <Route element={<AppLayout />}>
                      <Route index element={<MerchantHomeRedirect />} />
                      <Route path="tienda" element={<ShopPage />} />
                      <Route path="categorias" element={<CategoriesPage />} />
                      <Route path="sostenibilidad" element={<SustainabilityPage />} />
                      <Route path="soporte" element={<SupportPage />} />
                      <Route path="mensajeria" element={<MessagingPage />} />
                      <Route path="cupones" element={<CouponsPage />} />
                      <Route path="notificaciones" element={<NotificationsPage />} />
                      <Route path="ofertas" element={<OffersPage />} />
                      <Route path="carrito" element={<CartPage />} />
                      <Route
                        path="terminos"
                        element={
                          <InfoPage
                            title="Términos de uso"
                            subtitle="Condiciones generales para el uso de la plataforma NexusFlow."
                            sections={[
                              {
                                title: 'Aceptación de términos',
                                paragraphs: [
                                  'Al acceder y utilizar NexusFlow, aceptas cumplir con estos términos de uso y todas las leyes aplicables.',
                                  'Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestros servicios.',
                                ],
                              },
                              {
                                title: 'Uso del servicio',
                                paragraphs: [
                                  'NexusFlow proporciona una plataforma de comercio electrónico. Te comprometes a utilizar el servicio de forma lícita y responsable.',
                                  'Está prohibido el uso fraudulento, la reventa no autorizada o cualquier actividad que perjudique a otros usuarios.',
                                ],
                              },
                            ]}
                          />
                        }
                      />
                      <Route
                        path="privacidad"
                        element={
                          <InfoPage
                            title="Política de privacidad"
                            subtitle="Cómo recopilamos, usamos y protegemos tu información personal."
                            sections={[
                              {
                                title: 'Datos que recopilamos',
                                paragraphs: [
                                  'Recopilamos información de cuenta, historial de compras y preferencias para personalizar tu experiencia.',
                                  'Los datos de pago se procesan de forma segura a través de proveedores certificados.',
                                ],
                              },
                              {
                                title: 'Tus derechos',
                                paragraphs: [
                                  'Puedes solicitar acceso, rectificación o eliminación de tus datos desde Configuración o contactando a soporte.',
                                  'No vendemos tu información personal a terceros.',
                                ],
                              },
                            ]}
                          />
                        }
                      />
                      <Route
                        path="politicas-devoluciones"
                        element={
                          <InfoPage
                            title="Política de devoluciones"
                            subtitle="Información sobre plazos, condiciones y proceso de devolución."
                            sections={[
                              {
                                title: 'Plazo de devolución',
                                paragraphs: [
                                  'Dispones de 30 días naturales desde la recepción del pedido para solicitar una devolución.',
                                  'Los productos deben estar en su estado original, sin uso y con el embalaje completo.',
                                ],
                              },
                              {
                                title: 'Proceso',
                                paragraphs: [
                                  'Inicia la devolución desde Historial de compras o el Centro de soporte.',
                                  'Una vez aprobada, recibirás una etiqueta de envío y el reembolso se procesará en 5-10 días hábiles.',
                                ],
                              },
                            ]}
                          />
                        }
                      />
                      <Route
                        path="metodos-pago"
                        element={
                          <InfoPage
                            title="Métodos de pago"
                            subtitle="Opciones de pago disponibles en NexusFlow."
                            sections={[
                              {
                                title: 'Tarjetas y billeteras',
                                paragraphs: [
                                  'Aceptamos tarjetas de crédito y débito Visa, Mastercard y American Express.',
                                  'También puedes pagar con Apple Pay, Google Pay y PayPal.',
                                ],
                              },
                              {
                                title: 'Seguridad',
                                paragraphs: [
                                  'Todas las transacciones están protegidas con cifrado SSL y cumplimiento PCI DSS.',
                                ],
                              },
                            ]}
                          />
                        }
                      />
                      <Route
                        path="sobre-nosotros"
                        element={
                          <InfoPage
                            title="Sobre nosotros"
                            subtitle="La visión detrás de NexusFlow."
                            sections={[
                              {
                                title: 'Nuestra misión',
                                paragraphs: [
                                  'NexusFlow nace para ofrecer comercio electrónico de lujo personalizado, accesible e impulsado por inteligencia artificial.',
                                  'Combinamos diseño excepcional con tecnología que se adapta a cada usuario.',
                                ],
                              },
                            ]}
                          />
                        }
                      />
                      <Route
                        path="carreras"
                        element={
                          <InfoPage
                            title="Carreras"
                            subtitle="Únete al equipo NexusFlow."
                            sections={[
                              {
                                title: 'Oportunidades',
                                paragraphs: [
                                  'Buscamos talento en ingeniería, diseño, operaciones y atención al cliente.',
                                  'Ofrecemos trabajo remoto híbrido, beneficios competitivos y un entorno inclusivo.',
                                ],
                              },
                              {
                                title: 'Cómo aplicar',
                                paragraphs: [
                                  'Envía tu currículum a carreras@nexusflow.com indicando el área de interés.',
                                ],
                              },
                            ]}
                          />
                        }
                      />
                      <Route
                        path="favoritos"
                        element={
                          <ProtectedRoute>
                            <FavoritesPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="perfil"
                        element={
                          <ProtectedRoute>
                            <ProfilePage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="configuracion"
                        element={
                          <ProtectedRoute>
                            <SettingsPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="checkout"
                        element={
                          <ProtectedRoute>
                            <CheckoutPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="historial"
                        element={
                          <ProtectedRoute>
                            <PurchaseHistoryPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="recuperar-carrito"
                        element={
                          <ProtectedRoute>
                            <CartRecoveryPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="facturas"
                        element={
                          <ProtectedRoute>
                            <InvoicesPage />
                          </ProtectedRoute>
                        }
                      />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </ChatProvider>
              </FavoritesProvider>
            </CartProvider>
          </AccessibilityProvider>
        </AuthProvider>
      </ShortcutsProvider>
    </I18nProvider>
  </BrowserRouter>
  );
}

export default App;
