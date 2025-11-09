import React, { useState } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

export const ShopSettings: React.FC = () => {
  const [payoutMethod, setPayoutMethod] = useState<'mobile' | 'bank'>('mobile');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    // TODO: Implement Firebase Function call to save payout_details on the 'shops' document
    setTimeout(() => {
      setLoading(false);
      alert('Payout details saved successfully!');
    }, 1500);
  };

  return (
    <PortalLayout title="Settings & Payouts">
      <div className="grid gap-6 max-w-3xl">
        {/* Payout Settings Card (The Core Trust Feature) */}
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
              <Select onValueChange={(value: 'mobile' | 'bank') => setPayoutMethod(value)} defaultValue="mobile">
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
                        <Select defaultValue="Airtel">
                            <SelectTrigger id="mobile-provider"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Airtel">Airtel Money</SelectItem>
                                <SelectItem value="MTN">MTN Money</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mobile-number">Phone Number</Label>
                        <Input id="mobile-number" placeholder="+260 977 123 456" required />
                    </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-1">Bank Account Details</h3>
                <div className="space-y-2">
                  <Label htmlFor="bank-name">Bank Name</Label>
                  <Input id="bank-name" placeholder="Zanaco, Stanbic, FNB, etc." required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input id="account-number" placeholder="1234567890" required />
                </div>
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
