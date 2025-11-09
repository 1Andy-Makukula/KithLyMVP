import React from 'react';

const CheckoutPage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold text-center my-8">Checkout</h1>
      {/* Checkout form */}
      <div className="checkout-form my-8">
        <form>
          <div className="mb-4">
            <label htmlFor="recipient-phone" className="block text-lg font-semibold mb-2">Recipient's Phone Number</label>
            <input type="text" id="recipient-phone" className="w-full border rounded-lg p-2" placeholder="+260..." />
          </div>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg mt-2">Pay Now</button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
