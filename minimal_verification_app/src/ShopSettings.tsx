import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './lib/firebaseConfig';
import { useAuth } from './hooks/useAuth';
import { PortalLayout } from './components/layout/PortalLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { toast } from "sonner";

type PayoutType = 'mobile_money' | 'bank';

export const ShopSettings: React.FC = () => {
  const { user } = useAuth();
  const [payoutType, setPayoutType] = useState<PayoutType>('mobile_money');

  // Mobile Money State
  const [mobileProvider, setMobileProvider] = useState('Airtel');
  const [mobileNumber, setMobileNumber] = useState('');

  // Bank State
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [branchCode, setBranchCode] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchPayoutDetails = async () => {
      if (!user?.shop_id) return;

      setIsLoading(true);
      try {
        const shopRef = doc(db, 'shops', user.shop_id);
        const shopSnap = await getDoc(shopRef);

        if (shopSnap.exists()) {
          const data = shopSnap.data();
          const details = data.payout_details;
          if (details) {
            setPayoutType(details.type || 'mobile_money');
            if (details.type === 'bank') {
              setBankName(details.bank_name || '');
              setAccountNumber(details.account_number || '');
              setBranchCode(details.branch_code || '');
            } else {
              setMobileProvider(details.provider || 'Airtel');
              setMobileNumber(details.number || '');
            }
          }
        }
      } catch (error) {
        console.error("Error fetching payout details:", error);
        toast.error("Failed to load your settings.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayoutDetails();
  }, [user]);

  const handleSave = async () => {
    if (!user?.shop_id) {
      toast.error("Authentication error. Cannot save settings.");
      return;
    }

    setIsSaving(true);
    let payoutDetails = {};
    if (payoutType === 'mobile_money') {
      payoutDetails = { type: 'mobile_money', provider: mobileProvider, number: mobileNumber };
    } else {
      payoutDetails = { type: 'bank', bank_name: bankName, account_number: accountNumber, branch_code: branchCode };
    }

    try {
      const shopRef = doc(db, 'shops', user.shop_id);
      await updateDoc(shopRef, { payout_details: payoutDetails });
      toast.success("Payout settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PortalLayout title="Settings & Payouts">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl text-[#3498DB]">Payout Information</CardTitle>
          <CardDescription>
            This is how you get paid. Please ensure these details are correct.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading your settings...</p>
          ) : (
            <Tabs value={payoutType} onValueChange={(value) => setPayoutType(value as PayoutType)} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="mobile_money">Mobile Money</TabsTrigger>
                <TabsTrigger value="bank">Bank Account</TabsTrigger>
              </TabsList>

              <TabsContent value="mobile_money">
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobile-provider">Provider</Label>
                    <Select value={mobileProvider} onValueChange={setMobileProvider}>
                      <SelectTrigger id="mobile-provider"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Airtel">Airtel Money</SelectItem>
                        <SelectItem value="MTN">MTN Mobile Money</SelectItem>
                        <SelectItem value="Zamtel">Zamtel Kwacha</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile-number">Phone Number</Label>
                    <Input id="mobile-number" placeholder="+260 97 7123456" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bank">
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank-name">Bank Name</Label>
                    <Input id="bank-name" placeholder="e.g., Stanbic Bank" value={bankName} onChange={(e) => setBankName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account-number">Account Number</Label>
                    <Input id="account-number" placeholder="9130001234567" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="branch-code">Branch Code (Sort Code)</Label>
                    <Input id="branch-code" placeholder="040002" value={branchCode} onChange={(e) => setBranchCode(e.target.value)} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <div className="flex justify-end mt-8">
            <Button onClick={handleSave} disabled={isLoading || isSaving} className="bg-[#2ECC71] hover:bg-green-600 transition duration-300">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </PortalLayout>
  );
};
