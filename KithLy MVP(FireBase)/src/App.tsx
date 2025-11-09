import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { PrivateRoute } from './components/PrivateRoute';

// Layout
import MainLayout from './components/layout/MainLayout';
import PortalLayout from './components/layout/PortalLayout';

// Customer Pages
import HomePage from './pages/HomePage';
import ShopDetailPage from './pages/ShopDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';
import MyReceivedGiftsPage from './pages/MyReceivedGiftsPage';

// Gift Page
import PublicGiftPage from './pages/PublicGiftPage';

// Auth Pages
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';

// Shop Owner Portal Pages
import ShopDashboard from './pages/ShopDashboard';
import ShopProducts from './pages/ShopProducts';
import ShopOrders from './pages/ShopOrders';
import ShopScan from './pages/ShopScan';
import ShopSettings from './pages/ShopSettings';

export default function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        {/* Customer App */}
        <Route
          path="/*"
          element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop/:id" element={<ShopDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/gift/:tokenId" element={<PublicGiftPage />} />
                <Route element={<PrivateRoute roles={['customer', 'shop_owner']} />}>
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/my-orders" element={<MyOrdersPage />} />
                  <Route path="/my-gifts" element={<MyReceivedGiftsPage />} />
                </Route>
              </Routes>
            </MainLayout>
          }
        />

        {/* Shop Owner Portal */}
        <Route
          path="/portal/*"
          element={
            <PrivateRoute roles={['shop_owner']}>
              <PortalLayout>
                <Routes>
                  <Route path="/dashboard" element={<ShopDashboard />} />
                  <Route path="/products" element={<ShopProducts />} />
                  <Route path="/orders" element={<ShopOrders />} />
                  <Route path="/scan" element={<ShopScan />} />
                  <Route path="/settings" element={<ShopSettings />} />
                  <Route path="/" element={<Navigate to="/portal/dashboard" replace />} />
                </Routes>
              </PortalLayout>
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
