import React from 'react';

const ShopProducts: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold text-center my-8">Shop Products</h1>
      {/* Product list */}
      <div className="product-list">
        {/* Product table */}
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Product Name</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Available</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Product Name</td>
              <td className="border p-2">K100</td>
              <td className="border p-2">Yes</td>
              <td className="border p-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Edit</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg ml-2">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShopProducts;
