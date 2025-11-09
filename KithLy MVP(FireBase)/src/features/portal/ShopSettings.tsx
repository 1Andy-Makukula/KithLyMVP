import { useState, useEffect } from 'react';
import { ShopSidebar } from '../../components/layout/ShopSidebar';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { getShopById, updateShopPayoutDetails, Shop } from '../../api/shops';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner@2.0.3';

export function ShopSettings() {
  const { userData } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData?.shop_id) {
      loadShopData(userData.shop_id);
    }
  }, [userData]);

  const loadShopData = async (shopId: string) => {
    const shopData = await getShopById(shopId);
    setShop(shopData);
    if (shopData?.payout_details?.number) {
      setMobileMoneyNumber(shopData.payout_details.number);
    }
  };

  const handleSavePayoutDetails = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userData?.shop_id) return;

    setLoading(true);

    try {
      await updateShopPayoutDetails(userData.shop_id, {
        type: 'mobile_money',
        number: mobileMoneyNumber
      });

      toast.success('Payout details updated successfully');
    } catch (error) {
      toast.error('Failed to update payout details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ShopSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl mb-8">Settings</h1>

          <div className="space-y-6">
            {/* Shop Information */}
            <Card>
              <CardHeader>
                <CardTitle>Shop Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Shop Name</Label>
                  <p className="text-lg">{shop?.shop_name || 'Loading...'}</p>
                </div>
                <div>
                  <Label>Address</Label>
                  <p className="text-gray-700">{shop?.address || 'Loading...'}</p>
                </div>
                <div>
                  <Label>Verification Status</Label>
                  <p className={shop?.is_verified ? 'text-green-600' : 'text-yellow-600'}>
                    {shop?.is_verified ? '✓ Verified' : '⏳ Pending Verification'}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  To update your shop information, please contact Kithly support.
                </p>
              </CardContent>
            </Card>

            {/* Payout Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Payout Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSavePayoutDetails} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobile-money">Mobile Money Number</Label>
                    <Input
                      id="mobile-money"
                      type="tel"
                      placeholder="+260XXXXXXXXX"
                      value={mobileMoneyNumber}
                      onChange={(e) => setMobileMoneyNumber(e.target.value)}
                    />
                    <p className="text-sm text-gray-500">
                      We'll send your earnings to this mobile money number
                    </p>
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Payout Details'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <p className="text-gray-700">{userData?.email || 'Loading...'}</p>
                </div>
                <div>
                  <Label>Name</Label>
                  <p className="text-gray-700">
                    {userData ? `${userData.first_name} ${userData.last_name}` : 'Loading...'}
                  </p>
                </div>
                <div>
                  <Label>User ID</Label>
                  <p className="text-sm text-gray-500 font-mono">{userData?.shop_id || 'Loading...'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-700">
                  If you need assistance with your account or have questions about the platform:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>📧 Email: support@kithly.com</li>
                  <li>📱 WhatsApp: +260 XXX XXX XXX</li>
                  <li>🕐 Business Hours: Mon-Fri, 9AM-5PM CAT</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
