import React from 'react';
import { ShopSidebar } from './ShopSidebar';

interface PortalLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({ children, title }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <ShopSidebar />
      <div className="flex-grow flex flex-col">
        <header className="p-6 bg-white border-b shadow-sm">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        </header>
        <main className="flex-grow p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
import Sidebar from './Sidebar';

interface PortalLayoutProps {
  children: React.ReactNode;
}

const PortalLayout: React.FC<PortalLayoutProps> = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-grow p-8">{children}</main>
    </div>
  );
};

export default PortalLayout;
