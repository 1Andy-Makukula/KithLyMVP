import React from 'react';
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
