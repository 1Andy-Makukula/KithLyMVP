import React from 'react';

const ShopDashboard: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold text-center my-8">Shop Dashboard</h1>
      {/* Dashboard metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <h2 className="text-2xl font-semibold">Total Orders</h2>
          <p className="text-3xl font-bold">123</p>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-2xl font-semibold">Total Revenue</h2>
          <p className="text-3xl font-bold">K12,345</p>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-2xl font-semibold">Pending Payouts</h2>
          <p className="text-3xl font-bold">K1,234</p>
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;
