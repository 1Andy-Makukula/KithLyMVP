import { useEffect, useState } from 'react';
import { ShopSidebar } from '../../components/layout/ShopSidebar';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { getOrdersByShopId, Order } from '../../api/orders';
import { useAuth } from '../../hooks/useAuth';
import { ShoppingBag, Clock, CheckCircle } from 'lucide-react';

export function ShopOrders() {
  const { userData } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData?.shop_id) {
      loadOrders(userData.shop_id);
    }
  }, [userData]);

  const loadOrders = async (shopId: string) => {
    setLoading(true);
    const data = await getOrdersByShopId(shopId);
    setOrders(data);
    setLoading(false);
  };

  const getPendingOrders = () => orders.filter(o => o.status === 'paid');
  const getCollectedOrders = () => orders.filter(o => o.status === 'collected');

  const OrderCard = ({ order }: { order: Order }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg">Order #{order.id.slice(0, 8)}</h3>
              {order.status === 'paid' ? (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Clock className="h-3 w-3 mr-1" />
                  Pending
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Collected
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">
              Recipient: {order.recipient_phone_number}
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
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ShopSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl mb-8">Orders</h1>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl text-gray-600 mb-2">No orders yet</h2>
              <p className="text-gray-500">Orders will appear here when customers purchase from your shop</p>
            </div>
          ) : (
            <Tabs defaultValue="pending" className="space-y-6">
              <TabsList>
                <TabsTrigger value="pending">
                  Pending ({getPendingOrders().length})
                </TabsTrigger>
                <TabsTrigger value="collected">
                  Collected ({getCollectedOrders().length})
                </TabsTrigger>
                <TabsTrigger value="all">
                  All ({orders.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                {getPendingOrders().length === 0 ? (
                  <p className="text-center text-gray-500 py-12">No pending orders</p>
                ) : (
                  getPendingOrders().map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="collected" className="space-y-4">
                {getCollectedOrders().length === 0 ? (
                  <p className="text-center text-gray-500 py-12">No collected orders</p>
                ) : (
                  getCollectedOrders().map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="all" className="space-y-4">
                {orders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
}
