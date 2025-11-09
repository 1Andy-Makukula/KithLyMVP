import React from 'react';

const MyReceivedGiftsPage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold text-center my-8">My Received Gifts</h1>
      {/* Gift list */}
      <div className="gift-list">
        {/* Gift card */}
        <div className="gift-card border rounded-lg p-4 my-4">
          <h2 className="text-xl font-semibold">Gift from Aunt Diana</h2>
          <p className="text-lg">Status: Not redeemed</p>
        </div>
      </div>
    </div>
  );
};

export default MyReceivedGiftsPage;
