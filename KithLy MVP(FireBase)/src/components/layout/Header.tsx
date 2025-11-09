import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Kithly</Link>
        <nav>
          <Link to="/orders" className="text-lg mx-4">My Orders</Link>
          <Link to="/gifts" className="text-lg mx-4">My Gifts</Link>
          <Link to="/login" className="text-lg mx-4">Login</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
