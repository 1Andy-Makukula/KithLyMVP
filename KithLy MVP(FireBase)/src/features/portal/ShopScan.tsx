import { useState } from 'react';
import { ShopSidebar } from '../../components/layout/ShopSidebar';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { redeemToken, getCollectionToken } from '../../api/orders';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';
import { QrCode, CheckCircle, XCircle, Camera } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Scanner } from '@yudiel/react-qr-scanner';

export function ShopScan() {
  const [manualCode, setManualCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async (tokenId: string) => {
    setLoading(true);
    setVerificationResult(null);

    try {
      // Get token data
      const token = await getCollectionToken(tokenId);

      if (!token) {
        setVerificationResult({
          success: false,
          message: 'Invalid QR code'
        });
        return;
      }

      if (token.is_redeemed) {
        setVerificationResult({
          success: false,
          message: 'This gift has already been collected',
          data: token
        });
        return;
      }

      // Get order details
      const orderRef = doc(db, 'orders', token.order_id);
      const orderDoc = await getDoc(orderRef);
      const orderData = orderDoc.exists() ? orderDoc.data() : null;

      // Redeem the token
      await redeemToken(tokenId);

      setVerificationResult({
        success: true,
        message: 'Gift verified and marked as collected!',
        data: {
          token,
          order: orderData
        }
      });

      toast.success('Gift successfully collected!');
    } catch (error) {
      console.error('Scan error:', error);
      setVerificationResult({
        success: false,
        message: 'Failed to verify gift. Please try again.'
      });
      toast.error('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleManualEntry = () => {
    if (!manualCode.trim()) {
      toast.error('Please enter a code');
      return;
    }

    // Extract token ID from URL or use as-is
    let tokenId = manualCode.trim();
    if (tokenId.includes('/gift/')) {
      tokenId = tokenId.split('/gift/')[1];
    }

    handleScan(tokenId);
  };

  const handleQRCodeDetected = (result: any) => {
    if (result && result[0]?.rawValue) {
      const url = result[0].rawValue;
      // Extract token ID from URL
      if (url.includes('/gift/')) {
        const tokenId = url.split('/gift/')[1];
        setScanning(false);
        handleScan(tokenId);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ShopSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl mb-8">Scan QR Code</h1>

          <div className="space-y-6">
            {/* QR Scanner */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Camera Scanner
                </CardTitle>
              </CardHeader>
              <CardContent>
                {scanning ? (
                  <div>
                    <div className="bg-black rounded-lg overflow-hidden mb-4">
                      <Scanner
                        onScan={handleQRCodeDetected}
                        constraints={{ facingMode: 'environment' }}
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setScanning(false)}
                      className="w-full"
                    >
                      Stop Scanning
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => setScanning(true)} 
                    className="w-full"
                    size="lg"
                  >
                    <QrCode className="h-5 w-5 mr-2" />
                    Start Camera Scanner
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Manual Entry */}
            <Card>
              <CardHeader>
                <CardTitle>Manual Entry</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Enter Gift Code or URL</Label>
                  <Input
                    id="code"
                    placeholder="https://kithly.com/gift/abc123 or abc123"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleManualEntry()}
                  />
                </div>
                <Button 
                  onClick={handleManualEntry} 
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify Gift'}
                </Button>
              </CardContent>
            </Card>

            {/* Verification Result */}
            {verificationResult && (
              <Card className={
                verificationResult.success 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-red-200 bg-red-50'
              }>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {verificationResult.success ? (
                      <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-600 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg mb-2">
                        {verificationResult.success ? 'Success!' : 'Verification Failed'}
                      </h3>
                      <p className="text-sm mb-4">{verificationResult.message}</p>

                      {verificationResult.success && verificationResult.data?.order && (
                        <div className="bg-white rounded-lg p-4 border">
                          <h4 className="text-sm mb-2">Order Details:</h4>
                          <div className="space-y-1 text-sm">
                            {verificationResult.data.order.items?.map((item: any, index: number) => (
                              <div key={index} className="flex justify-between">
                                <span>{item.quantity}x {item.name}</span>
                                <span>ZMW {(item.price_at_purchase * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                            <div className="border-t pt-1 mt-2 flex justify-between">
                              <span>Total</span>
                              <span className="text-purple-600">
                                ZMW {verificationResult.data.order.total_amount_zmw?.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>How to use</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="text-sm space-y-2 list-decimal list-inside text-gray-700">
                  <li>Ask the customer to show their QR code</li>
                  <li>Use the camera scanner to scan the QR code, or enter the code manually</li>
                  <li>Verify the order details match what you're giving</li>
                  <li>Once verified, the system will mark the gift as collected</li>
                  <li>Give the items to the customer</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
