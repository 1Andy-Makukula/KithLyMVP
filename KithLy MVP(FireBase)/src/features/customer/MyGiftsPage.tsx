import { useEffect, useState } from 'react';
import { CustomerHeader } from '../../components/layout/CustomerHeader';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { getOrdersByUserId, Order } from '../../api/orders';
import { useAuth } from '../../hooks/useAuth';
import { Package, Clock, CheckCircle } from 'lucide-react';

export function MyGiftsPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;
    setLoading(true);
    const data = await getOrdersByUserId(user.uid);
    setOrders(data);
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Clock className="h-3 w-3 mr-1" />
          Pending Collection
        </Badge>;
      case 'collected':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Collected
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl mb-8">My Sent Gifts</h1>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl text-gray-600 mb-2">No gifts sent yet</h2>
              <p className="text-gray-500">Start sending love to your family in Zambia!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg">Order #{order.id.slice(0, 8)}</h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-gray-600">
                          Sent to: {order.recipient_phone_number}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.created_at?.toDate?.()?.toLocaleDateString() || 'Recent'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl text-purple-600">
                          ZMW {order.total_amount_zmw.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="text-sm text-gray-600 mb-2">Items:</h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.name}</span>
                            <span className="text-gray-600">
                              ZMW {(item.price_at_purchase * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
