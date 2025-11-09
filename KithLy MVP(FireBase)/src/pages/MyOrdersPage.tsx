import React from 'react';

const MyOrdersPage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold text-center my-8">My Orders</h1>
      {/* Order list */}
      <div className="order-list">
        {/* Order card */}
        <div className="order-card border rounded-lg p-4 my-4">
          <h2 className="text-xl font-semibold">Order #12345</h2>
          <p className="text-lg">Status: Paid</p>
          <p className="text-lg">Total: K500</p>
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;
