import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';

// Layouts
import { MainLayout } from './components/layout/MainLayout';
import { PortalLayout } from './components/layout/PortalLayout';
import { PrivateRoute } from './components/PrivateRoute'; // Assuming you will implement this

// Features - Customer Pages
import { HomePage } from './features/customer/HomePage';
import { ShopDetailPage } from './features/customer/ShopDetailPage';
import { CheckoutPage } from './features/customer/CheckoutPage';
import { MyGiftsPage } from './features/customer/MyGiftsPage'; // Buyer's order history

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


function App() {
  return (
    <CartProvider>
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
    </CartProvider>
  );
}

export default App;
