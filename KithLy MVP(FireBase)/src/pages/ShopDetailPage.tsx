import React from 'react';

const ShopDetailPage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold text-center my-8">Shop Name</h1>
      {/* Shop details */}
      <div className="shop-details my-8">
        <img src="/placeholder-shop.jpg" alt="Shop" className="mx-auto" />
        <p className="text-lg text-center my-4">Shop address</p>
      </div>
      {/* Product list */}
      <div className="product-list">
        <h2 className="text-2xl font-semibold my-4">Products</h2>
        {/* Product card */}
        <div className="product-card border rounded-lg p-4 my-4">
          <img src="/placeholder-product.jpg" alt="Product" className="mx-auto" />
          <h3 className="text-xl font-semibold my-2">Product Name</h3>
          <p className="text-lg">K100</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg mt-2">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ShopDetailPage;
