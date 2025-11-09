import React, { useState } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Camera, CheckCircle, XCircle } from 'lucide-react';
// import { Scanner } from '@yudiel/react-qr-scanner'; // Replace with real library

export const ShopScan: React.FC = () => {
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'verified' | 'failed'>('idle');
  const [manualCode, setManualCode] = useState('');
  const [verificationData, setVerificationData] = useState<any>(null);

  // Mock redemption logic
  const handleRedeem = (code: string) => {
    setScanStatus('scanning');
    setVerificationData(null);

    // TODO: Implement Firebase Callable Function call to redeemToken(code)
    setTimeout(() => {
      if (code.includes('KLY-8XN2P') || code.includes('SUCCESS')) {
        setScanStatus('verified');
        setVerificationData({ orderId: 'ORD-12345', customer: 'Diana Phiri (UK)', items: ['Red Velvet Cake'] });
      } else {
        setScanStatus('failed');
        setVerificationData({ error: 'Token not found or already redeemed.' });
      }
    }, 2000);
  };

  const statusMap = {
    idle: { color: 'text-gray-500', icon: Camera, text: 'Ready to Scan or Enter Code' },
    scanning: { color: 'text-yellow-500', icon: Camera, text: 'Verifying...' },
    verified: { color: 'text-[#2ECC71]', icon: CheckCircle, text: 'VERIFIED! Hand Over Gift.' },
    failed: { color: 'text-red-500', icon: XCircle, text: 'Verification FAILED. Do NOT hand over.' },
  };

  return (
    <PortalLayout title="Gift Redemption">
      <Card className="max-w-xl mx-auto border-4 shadow-xl border-t-0" style={{ borderColor: statusMap[scanStatus].color }}>
        <CardHeader>
          <CardTitle className={`text-3xl flex items-center justify-center font-bold ${statusMap[scanStatus].color}`}>
            <statusMap.icon className="h-8 w-8 mr-3" />
            {statusMap[scanStatus].text}
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Use this page to confirm collection and trigger payout.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="scan" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-200 mb-4">
              <TabsTrigger value="scan">Scan QR Code</TabsTrigger>
              <TabsTrigger value="manual">Enter Manual Code</TabsTrigger>
            </TabsList>

            <TabsContent value="scan">
              {/* Replace with real QR scanner library: <Scanner onScan={handleRedeem} /> */}
              <div className="bg-gray-200 h-64 flex items-center justify-center rounded-lg">
                <Camera className="h-16 w-16 text-gray-500" />
                <p className="ml-4 text-gray-700">Camera Active: Scan QR Code Here</p>
              </div>
            </TabsContent>

            <TabsContent value="manual">
              <div className="space-y-4">
                <Input
                    placeholder="Enter 8-digit Manual Code (e.g., KLY-8XN2P)"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    className="text-lg tracking-widest text-center"
                />
                <Button 
                    onClick={() => handleRedeem(manualCode)}
                    disabled={manualCode.length < 5 || scanStatus === 'scanning'}
                    className="w-full bg-[#3498DB] hover:bg-blue-600 transition duration-300"
                >
                    Verify Code
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Verification Result Display */}
          {verificationData && scanStatus !== 'idle' && (
            <div className={`mt-6 p-4 rounded-lg ${scanStatus === 'verified' ? 'bg-[#2ECC71]/10 border-l-4 border-[#2ECC71]' : 'bg-red-500/10 border-l-4 border-red-500'}`}>
              <h4 className="font-bold mb-2">Order Details</h4>
              {scanStatus === 'verified' ? (
                <ul className="list-disc list-inside text-sm">
                  <li>**Order ID:** {verificationData.orderId}</li>
                  <li>**Buyer:** {verificationData.customer}</li>
                  <li>**Items:** {verificationData.items.join(', ')}</li>
                </ul>
              ) : (
                <p className="text-red-700 text-sm">Error: {verificationData.error}</p>
              )}
            </div>
          )}

        </CardContent>
      </Card>
    </PortalLayout>
  );
};
