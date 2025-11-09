import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen">
      <div className="p-4">
        <h2 className="text-2xl font-bold">Shop Portal</h2>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/portal/dashboard" className="block p-4 hover:bg-gray-700">Dashboard</Link>
          </li>
          <li>
            <Link to="/portal/orders" className="block p-4 hover:bg-gray-700">Orders</Link>
          </li>
          <li>
            <Link to="/portal/products" className="block p-4 hover:bg-gray-700">Products</Link>
          </li>
          <li>
            <Link to="/portal/scan" className="block p-4 hover:bg-gray-700">Scan</Link>
          </li>
          <li>
            <Link to="/portal/settings" className="block p-4 hover:bg-gray-700">Settings</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
