import { Link } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';
import { Button } from '../ui/button';

export const CustomerHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Branding (Soft Blue) */}
        <Link to="/" className="text-3xl font-extrabold text-[#3498DB] transition duration-300 hover:opacity-90">
          Kithly
        </Link>

        {/* Navigation & Actions */}
        <nav className="flex items-center space-x-4">
          <Link to="/my-orders" className="text-gray-600 hover:text-[#3498DB] transition duration-300">
            My Orders
          </Link>
          <Link to="/portal/dashboard" className="text-gray-600 hover:text-[#3498DB] transition duration-300">
            Shop Portal
          </Link>

          {/* Cart Icon */}
          <Button variant="ghost" className="relative h-9 w-9 p-0 text-gray-600 hover:bg-gray-100">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-[#2ECC71] text-xs text-white">3</span>
          </Button>

          {/* User Icon */}
          <Link to="/login">
            <Button variant="ghost" className="h-9 w-9 p-0 rounded-full text-gray-600 hover:bg-gray-100">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};
