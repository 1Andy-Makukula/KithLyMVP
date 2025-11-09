import { Link } from 'react-router-dom';
import { LayoutDashboard, Package, ListChecks, QrCode, Settings, LogOut } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/portal/dashboard', icon: LayoutDashboard },
  { name: 'Orders', href: '/portal/orders', icon: ListChecks },
  { name: 'Products', href: '/portal/products', icon: Package },
  { name: 'Scan Gift', href: '/portal/scan', icon: QrCode },
  { name: 'Settings', href: '/portal/settings', icon: Settings },
];

export const ShopSidebar: React.FC = () => {
  // Simple check for the current path for active state
  const currentPath = window.location.pathname;

  return (
    <div className="w-64 bg-[#3498DB] text-white flex flex-col h-full shadow-lg">
      <div className="p-6 text-2xl font-bold border-b border-blue-400">
        Kithly Portal
      </div>
      <nav className="flex-grow p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            // Use the Accent Green for the active tab (Visual Hierarchy)
            className={`flex items-center p-3 rounded-lg transition duration-200
              ${currentPath.startsWith(item.href)
                ? 'bg-white text-[#2ECC71] font-semibold'
                : 'hover:bg-blue-600'
              }`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-blue-400">
        <button className="flex items-center w-full p-3 rounded-lg text-red-100 hover:bg-red-600 transition duration-200">
          <LogOut className="h-5 w-5 mr-3" />
          Log Out
        </button>
      </div>
    </div>
  );
};
