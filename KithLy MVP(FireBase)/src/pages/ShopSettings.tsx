import React from 'react';

const ShopSettings: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold text-center my-8">Shop Settings</h1>
      {/* Settings form */}
      <div className="settings-form my-8">
        <form>
          <div className="mb-4">
            <label htmlFor="payout-type" className="block text-lg font-semibold mb-2">Payout Type</label>
            <select id="payout-type" className="w-full border rounded-lg p-2">
              <option value="mobile_money">Mobile Money</option>
              <option value="bank">Bank</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="payout-details" className="block text-lg font-semibold mb-2">Payout Details</label>
            <input type="text" id="payout-details" className="w-full border rounded-lg p-2" placeholder="Airtel Money Number or Bank Account" />
          </div>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg mt-2">Save Payout Info</button>
        </form>
      </div>
    </div>
  );
};

export default ShopSettings;
