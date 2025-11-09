import React from 'react';
import { QrScanner } from '@yudiel/react-qr-scanner';

const ShopScan: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold text-center my-8">Scan QR Code</h1>
      {/* QR scanner */}
      <div className="qr-scanner">
        <QrScanner
          onDecode={(result) => console.log(result)}
          onError={(error) => console.log(error?.message)}
        />
      </div>
      {/* Manual code input */}
      <div className="manual-code-input my-8">
        <h2 className="text-2xl font-semibold text-center">Or Enter Code Manually</h2>
        <form className="flex justify-center mt-4">
          <input type="text" className="border rounded-lg p-2" placeholder="KLY-8XN2P" />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2">Verify</button>
        </form>
      </div>
    </div>
  );
};

export default ShopScan;
