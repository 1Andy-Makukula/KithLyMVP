import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';
import { useAuth } from '../../hooks/useAuth';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

export const ShopSettings: React.FC = () => {
  const { user } = useAuth();
  const [payoutMethod, setPayoutMethod] = useState<'mobile' | 'bank'>('mobile');
  const [mobileProvider, setMobileProvider] = useState('Airtel');
  const [mobileNumber, setMobileNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const fetchPayoutDetails = async () => {
      if (user?.shop_id) {
        const shopRef = doc(db, 'shops', user.shop_id);
        const shopSnap = await getDoc(shopRef);
        if (shopSnap.exists()) {
          const data = shopSnap.data();
          if (data.payout_details) {
            setPayoutMethod(data.payout_details.type || 'mobile');
            if (data.payout_details.type === 'mobile') {
              setMobileProvider(data.payout_details.provider || 'Airtel');
              setMobileNumber(data.payout_details.number || '');
            } else if (data.payout_details.type === 'bank') {
              setBankName(data.payout_details.bank_name || '');
              setAccountNumber(data.payout_details.account || '');
            }
          }
        }
      }
    };
    fetchPayoutDetails();
  }, [user]);

  const handleSave = async () => {
    if (!user || !user.shop_id) {
      setFeedback({ type: 'error', message: 'You must be a shop owner to set payout details.' });
      return;
    }

    setLoading(true);
    setFeedback(null);

    let payoutDetails = {};
    if (payoutMethod === 'mobile') {
      if (!mobileProvider || !mobileNumber) {
        setFeedback({ type: 'error', message: 'Please fill in all mobile money fields.' });
        setLoading(false);
        return;
      }
      payoutDetails = { type: 'mobile_money', provider: mobileProvider, number: mobileNumber };
    } else {
      if (!bankName || !accountNumber) {
        setFeedback({ type: 'error', message: 'Please fill in all bank account fields.' });
        setLoading(false);
        return;
      }
      payoutDetails = { type: 'bank', bank_name: bankName, account: accountNumber };
    }

    try {
      const shopRef = doc(db, 'shops', user.shop_id);
      await updateDoc(shopRef, { payout_details: payoutDetails });
      setFeedback({ type: 'success', message: 'Payout details saved successfully!' });
    } catch (error) {
      console.error("Error updating payout details: ", error);
      setFeedback({ type: 'error', message: 'Failed to save payout details. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalLayout title="Settings & Payouts">
      <div className="grid gap-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#3498DB]">Payout Information</CardTitle>
            <CardDescription>
              This is where Kithly sends your earnings. Ensure this information is accurate.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Select Payout Method</Label>
              <Select onValueChange={(value: 'mobile' | 'bank') => setPayoutMethod(value)} value={payoutMethod}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mobile">Mobile Money (Airtel/MTN)</SelectItem>
                  <SelectItem value="bank">Local Bank Account</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {payoutMethod === 'mobile' ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-1">Mobile Money Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="mobile-provider">Provider</Label>
                        <Select value={mobileProvider} onValueChange={setMobileProvider}>
                            <SelectTrigger id="mobile-provider"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Airtel">Airtel Money</SelectItem>
                                <SelectItem value="MTN">MTN Money</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mobile-number">Phone Number</Label>
                        <Input id="mobile-number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="+260 977 123 456" required />
                    </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-1">Bank Account Details</h3>
                <div className="space-y-2">
                  <Label htmlFor="bank-name">Bank Name</Label>
                  <Input id="bank-name" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Zanaco, Stanbic, FNB, etc." required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input id="account-number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="1234567890" required />
                </div>
              </div>
            )}

            {feedback && (
              <div className={`p-3 rounded-md text-sm ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {feedback.message}
              </div>
            )}

            <Button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-[#2ECC71] hover:bg-green-600 transition duration-300"
            >
              {loading ? 'Saving...' : 'Save Payout Information'}
            </Button>
          </CardContent>
        </Card>

        {/* General Shop Info Card */}
        <Card>
            <CardHeader>
                <CardTitle>Shop Profile</CardTitle>
                <CardDescription>Update your shop name and contact details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="shop-name">Shop Name</Label>
                    <Input id="shop-name" defaultValue="The Cake Bar" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="shop-address">Physical Address (For Collection)</Label>
                    <Input id="shop-address" defaultValue="Novare Mall, Lusaka" />
                </div>
                <Button className="bg-[#3498DB] hover:bg-blue-600">Update Profile</Button>
            </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
};
