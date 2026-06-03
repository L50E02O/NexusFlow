import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CartProvider } from '@/shared/context/CartContext';
import { AppLayout } from '@/widgets/layout/AppLayout';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { HomePage } from '@/pages/HomePage';
import { ShopPage } from '@/pages/ShopPage';
import { CouponsPage } from '@/pages/CouponsPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { SupportPage } from '@/pages/SupportPage';
import { LoginPage } from '@/pages/LoginPage';
import { CartPage } from '@/pages/CartPage';
import { OffersPage } from '@/pages/OffersPage';
import { PlaceholderPage } from '@/pages/PlaceholderPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { PurchaseHistoryPage } from '@/pages/PurchaseHistoryPage';
import { CartRecoveryPage } from '@/pages/CartRecoveryPage';
import { InvoicesPage } from '@/pages/InvoicesPage';
import { AccessibilityProvider } from '@/shared/context/AccessibilityContext';
import { MerchantLayout } from '@/widgets/layout/MerchantLayout';
import { MerchantDashboardPage } from '@/pages/merchant/MerchantDashboardPage';
import { MerchantInventoryPage } from '@/pages/merchant/MerchantInventoryPage';
import { MerchantProductsPage } from '@/pages/merchant/MerchantProductsPage';
import { MerchantReportsPage } from '@/pages/merchant/MerchantReportsPage';
import { MerchantReturnsPage } from '@/pages/merchant/MerchantReturnsPage';
import { MerchantSecurityPage } from '@/pages/merchant/MerchantSecurityPage';
import { MerchantAssistantPage } from '@/pages/merchant/MerchantAssistantPage';

function App() {
  return (
    <BrowserRouter>
      <AccessibilityProvider>
      <CartProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/merchant" element={<MerchantLayout />}>
          <Route index element={<MerchantDashboardPage />} />
          <Route path="inventario" element={<MerchantInventoryPage />} />
          <Route path="productos" element={<MerchantProductsPage />} />
          <Route path="reportes" element={<MerchantReportsPage />} />
          <Route path="devoluciones" element={<MerchantReturnsPage />} />
          <Route path="seguridad" element={<MerchantSecurityPage />} />
          <Route path="asistente" element={<MerchantAssistantPage />} />
        </Route>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="tienda" element={<ShopPage />} />
          <Route path="categorias" element={<PlaceholderPage title="Categorías" description="Explora nuestras categorías desde la tienda principal." />} />
          <Route path="sostenibilidad" element={<PlaceholderPage title="Sostenibilidad" />} />
          <Route path="soporte" element={<SupportPage />} />
          <Route path="cupones" element={<CouponsPage />} />
          <Route path="notificaciones" element={<NotificationsPage />} />
          <Route path="ofertas" element={<OffersPage />} />
          <Route path="carrito" element={<CartPage />} />
          <Route path="favoritos" element={<FavoritesPage />} />
          <Route path="perfil" element={<ProfilePage />} />
          <Route path="configuracion" element={<SettingsPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="historial" element={<PurchaseHistoryPage />} />
          <Route path="recuperar-carrito" element={<CartRecoveryPage />} />
          <Route path="facturas" element={<InvoicesPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </CartProvider>
      </AccessibilityProvider>
    </BrowserRouter>
  );
}

export default App;
