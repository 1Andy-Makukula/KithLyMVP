import React from 'react';

const PublicGiftPage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold text-center my-8">You've received a gift!</h1>
      {/* Gift details */}
      <div className="gift-details text-center my-8">
        <img src="/placeholder-qr.png" alt="QR Code" className="mx-auto" />
        <p className="text-lg my-4">Manual code: KLY-8XN2P</p>
        <p className="text-lg">Want to see all your gifts in one place? <a href="/signup" className="text-blue-500">Sign up with your phone number.</a></p>
      </div>
    </div>
  );
};

export default PublicGiftPage;
