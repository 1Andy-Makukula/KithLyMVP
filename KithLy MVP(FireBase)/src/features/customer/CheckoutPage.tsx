import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CustomerHeader } from '../../components/layout/CustomerHeader';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { processPayment } from '../../api/orders';
import { toast } from 'sonner@2.0.3';
import { ArrowLeft } from 'lucide-react';

export function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, shop } = location.state || {};
  
  const [recipientPhone, setRecipientPhone] = useState('');
  const [loading, setLoading] = useState(false);

  if (!cart || !shop) {
    navigate('/');
    return null;
  }

  const getTotalAmount = () => {
    return cart.reduce((sum: number, item: any) => sum + (item.price_zmw * item.quantity), 0);
  };

  const handlePayment = async () => {
    if (!recipientPhone.trim()) {
      toast.error('Please enter recipient phone number');
      return;
    }

    // Validate Zambian phone format (+260...)
    if (!recipientPhone.match(/^\+260\d{9}$/)) {
      toast.error('Please enter a valid Zambian phone number (+260XXXXXXXXX)');
      return;
    }

    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        shop_id: shop.id,
        recipient_phone_number: recipientPhone,
        items: cart.map((item: any) => ({
          product_id: item.id,
          name: item.name,
          price_at_purchase: item.price_zmw,
          quantity: item.quantity
        }))
      };

      // Call the Cloud Function to process payment
      // In a real implementation, this would:
      // 1. Create a Flutterwave payment link
      // 2. Redirect user to payment
      // 3. Handle callback
      // 4. Send SMS to recipient
      
      // For MVP demo, we'll simulate success
      await processPayment(orderData);
      
      toast.success('Payment successful! SMS sent to recipient.');
      navigate('/my-gifts');
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Button>

          <h1 className="text-3xl mb-8">Checkout</h1>

          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shop:</span>
                    <span>{shop.shop_name}</span>
                  </div>
                  
                  {cart.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm pb-3 border-b">
                      <span>{item.name} x {item.quantity}</span>
                      <span>ZMW {(item.price_zmw * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}

                  <div className="flex justify-between pt-3 border-t">
                    <span className="text-lg">Total</span>
                    <span className="text-2xl text-purple-600">
                      ZMW {getTotalAmount().toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recipient Details */}
            <Card>
              <CardHeader>
                <CardTitle>Recipient Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Recipient Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+260XXXXXXXXX"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                    />
                    <p className="text-sm text-gray-500">
                      The recipient will receive an SMS with a QR code to collect the gift at {shop.shop_name}
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm mb-2">How it works:</h4>
                    <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                      <li>Enter the recipient's phone number</li>
                      <li>Complete the payment</li>
                      <li>Recipient receives an SMS with a QR code</li>
                      <li>They visit {shop.shop_name} to collect their gift</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Button */}
            <Button 
              onClick={handlePayment} 
              size="lg" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Processing...' : `Pay ZMW ${getTotalAmount().toFixed(2)}`}
            </Button>

            <p className="text-center text-sm text-gray-500">
              Secure payment powered by Flutterwave
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
