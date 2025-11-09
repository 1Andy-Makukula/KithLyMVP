import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, QrCode, Settings, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { cn } from '../ui/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/portal/dashboard' },
  { icon: Package, label: 'Products', path: '/portal/products' },
  { icon: ShoppingBag, label: 'Orders', path: '/portal/orders' },
  { icon: QrCode, label: 'Scan QR', path: '/portal/scan' },
  { icon: Settings, label: 'Settings', path: '/portal/settings' },
];

export function ShopSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <aside className="w-64 bg-white border-r min-h-screen flex flex-col">
      <div className="p-6 border-b">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg"></div>
          <div>
            <div className="text-xl">Kithly</div>
            <div className="text-sm text-gray-500">Shop Portal</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  location.pathname === item.path
                    ? "bg-purple-50 text-purple-600"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 w-full transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
