import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { PrivateRoute, ShopOwnerRoute } from './components/PrivateRoute';

// Customer Pages
import { HomePage } from './features/customer/HomePage';
import { ShopDetailPage } from './features/customer/ShopDetailPage';
import { CheckoutPage } from './features/customer/CheckoutPage';
import { MyGiftsPage } from './features/customer/MyGiftsPage';

// Gift Page
import { PublicGiftPage } from './features/gift/PublicGiftPage';

// Auth Pages
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';

// Shop Owner Portal Pages
import { ShopDashboard } from './features/portal/ShopDashboard';
import { ShopProducts } from './features/portal/ShopProducts';
import { ShopOrders } from './features/portal/ShopOrders';
import { ShopScan } from './features/portal/ShopScan';
import { ShopSettings } from './features/portal/ShopSettings';

export default function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/shop/:id" element={<ShopDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/gift/:tokenId" element={<PublicGiftPage />} />

        {/* Customer Private Routes */}
        <Route element={<PrivateRoute roles={['customer', 'shop_owner']} />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/my-gifts" element={<MyGiftsPage />} />
        </Route>

        {/* Shop Owner Private Routes */}
        <Route element={<ShopOwnerRoute />}>
          <Route path="/portal/dashboard" element={<ShopDashboard />} />
          <Route path="/portal/products" element={<ShopProducts />} />
          <Route path="/portal/orders" element={<ShopOrders />} />
          <Route path="/portal/scan" element={<ShopScan />} />
          <Route path="/portal/settings" element={<ShopSettings />} />
          <Route path="/portal" element={<Navigate to="/portal/dashboard" replace />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
