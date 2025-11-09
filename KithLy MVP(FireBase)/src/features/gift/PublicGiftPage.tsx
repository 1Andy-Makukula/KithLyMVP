import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCollectionToken, CollectionToken } from '../../api/orders';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { QRCodeSVG } from 'qrcode.react';
import { MapPin, Package, CheckCircle } from 'lucide-react';

export function PublicGiftPage() {
  const { tokenId } = useParams<{ tokenId: string }>();
  const [token, setToken] = useState<CollectionToken | null>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [shopData, setShopData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tokenId) {
      loadGiftData(tokenId);
    }
  }, [tokenId]);

  const loadGiftData = async (id: string) => {
    setLoading(true);
    
    try {
      // Get collection token
      const tokenData = await getCollectionToken(id);
      setToken(tokenData);

      if (tokenData) {
        // Get order details
        const orderRef = doc(db, 'orders', tokenData.order_id);
        const orderDoc = await getDoc(orderRef);
        if (orderDoc.exists()) {
          setOrderData({ id: orderDoc.id, ...orderDoc.data() });
        }

        // Get shop details
        const shopRef = doc(db, 'shops', tokenData.shop_id);
        const shopDoc = await getDoc(shopRef);
        if (shopDoc.exists()) {
          setShopData({ id: shopDoc.id, ...shopDoc.data() });
        }
      }
    } catch (error) {
      console.error('Error loading gift data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!token || !orderData || !shopData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl mb-2">Gift not found</h2>
            <p className="text-gray-500">This gift link may be invalid or expired.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const qrCodeUrl = `https://kithly.com/gift/${tokenId}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg"></div>
            <span className="text-3xl">Kithly</span>
          </div>
          <h1 className="text-2xl mb-2">You've Received a Gift! 🎁</h1>
          <p className="text-gray-600">Show this QR code at the shop to collect</p>
        </div>

        {/* QR Code Card */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle>
              {token.is_redeemed ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Already Collected
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Ready to Collect
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* QR Code */}
            <div className="bg-white p-8 rounded-lg flex items-center justify-center mb-6">
              <QRCodeSVG 
                value={qrCodeUrl} 
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>

            {/* Gift Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-gray-600 mb-2">Your Gift Items:</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {orderData.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="text-gray-600">
                        ZMW {(item.price_at_purchase * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 flex justify-between">
                    <span>Total Value</span>
                    <span className="text-purple-600">
                      ZMW {orderData.total_amount_zmw.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Collection Location */}
              <div>
                <h3 className="text-sm text-gray-600 mb-2">Collection Location:</h3>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="mb-2">{shopData.shop_name}</h4>
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p>{shopData.address}</p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm mb-2">How to collect:</h4>
                <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                  <li>Visit the shop at the address above</li>
                  <li>Show this QR code on your phone</li>
                  <li>The shop will scan and verify your gift</li>
                  <li>Collect your items!</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500">
          Sent with love via Kithly 💜
        </p>
      </div>
    </div>
  );
}
