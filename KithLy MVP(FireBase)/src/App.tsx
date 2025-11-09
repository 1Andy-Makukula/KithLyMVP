import { Routes, Route } from 'react-router-dom';

// Layouts
import { MainLayout } from './components/layout/MainLayout';
import { PortalLayout } from './components/layout/PortalLayout';
import { PrivateRoute } from './components/PrivateRoute'; // Assuming you will implement this

// Features - Customer Pages
import { HomePage } from './features/customer/HomePage';
import { ShopDetailPage } from './features/customer/ShopDetailPage';
import { CheckoutPage } from './features/customer/CheckoutPage';
import { MyGiftsPage } from './features/customer/MyGiftsPage'; // Buyer's order history
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

// Features - Auth Pages
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';

// Features - Gift Pages (Recipient Flow)
import { PublicGiftPage } from './features/gift/PublicGiftPage';

// Features - Shop Portal Pages
import { ShopDashboard } from './features/portal/ShopDashboard';
import { ShopOrders } from './features/portal/ShopOrders';
import { ShopProducts } from './features/portal/ShopProducts';
import { ShopScan } from './features/portal/ShopScan';
import { ShopSettings } from './features/portal/ShopSettings';
// Shop Owner Portal Pages
import ShopDashboard from './pages/ShopDashboard';
import ShopProducts from './pages/ShopProducts';
import ShopOrders from './pages/ShopOrders';
import ShopScan from './pages/ShopScan';
import ShopSettings from './pages/ShopSettings';


function App() {
  return (
    <Routes>
      {/* =======================================================
         PUBLIC & CUSTOMER-FACING ROUTES (Wrapped in MainLayout)
         ======================================================= */}
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
      <Route path="/shop/:id" element={<MainLayout><ShopDetailPage /></MainLayout>} />

      {/* These should ideally be wrapped in <PrivateRoute roles={['customer']}> */}
      <Route path="/checkout" element={<MainLayout><CheckoutPage /></MainLayout>} />
      <Route path="/my-orders" element={<MainLayout><MyGiftsPage /></MainLayout>} />


      {/* PUBLIC RECIPIENT FLOW (Minimal UI) */}
      <Route path="/gift/:tokenId" element={<PublicGiftPage />} />


      {/* =======================================================
         AUTH ROUTES (Minimal Layout)
         ======================================================= */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* =======================================================
         SHOP OWNER PORTAL ROUTES (Wrapped in PortalLayout)
         ======================================================= */}
      {/* NOTE: You will wrap this in a <ShopOwnerRoute> later */}
      <Route path="/portal" element={<PortalLayout title="Kithly Shop Dashboard"><ShopDashboard /></PortalLayout>} />
      <Route path="/portal/dashboard" element={<PortalLayout title="Dashboard"><ShopDashboard /></PortalLayout>} />
      <Route path="/portal/orders" element={<PortalLayout title="Order Fulfillment"><ShopOrders /></PortalLayout>} />
      <Route path="/portal/products" element={<PortalLayout title="Inventory Management"><ShopProducts /></PortalLayout>} />
      <Route path="/portal/scan" element={<PortalLayout title="Scan Redemption"><ShopScan /></PortalLayout>} />
      <Route path="/portal/settings" element={<PortalLayout title="Settings & Payouts"><ShopSettings /></PortalLayout>} />

    </Routes>
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

export default App;
