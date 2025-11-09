import React from 'react';

const ShopOrders: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold text-center my-8">Shop Orders</h1>
      {/* Order list */}
      <div className="order-list">
        {/* Order table */}
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">12345</td>
              <td className="border p-2">2024-01-01</td>
              <td className="border p-2">Paid</td>
              <td className="border p-2">K500</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShopOrders;
