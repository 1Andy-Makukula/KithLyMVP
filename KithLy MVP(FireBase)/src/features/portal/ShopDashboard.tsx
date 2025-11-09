import { useEffect, useState } from 'react';
import { ShopSidebar } from '../../components/layout/ShopSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { getOrdersByShopId, Order } from '../../api/orders';
import { getProductsByShopId, Product } from '../../api/products';
import { useAuth } from '../../hooks/useAuth';
import { Package, ShoppingBag, DollarSign, Clock } from 'lucide-react';

export function ShopDashboard() {
  const { userData } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData?.shop_id) {
      loadDashboardData(userData.shop_id);
    }
  }, [userData]);

  const loadDashboardData = async (shopId: string) => {
    setLoading(true);
    const [ordersData, productsData] = await Promise.all([
      getOrdersByShopId(shopId),
      getProductsByShopId(shopId)
    ]);
    setOrders(ordersData);
    setProducts(productsData);
    setLoading(false);
  };

  const getPendingOrders = () => orders.filter(o => o.status === 'paid');
  const getCollectedOrders = () => orders.filter(o => o.status === 'collected');
  const getTotalRevenue = () => {
    return getCollectedOrders().reduce((sum, order) => sum + order.total_amount_zmw, 0);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ShopSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl mb-8">Dashboard</h1>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm text-gray-600">Total Products</CardTitle>
                    <Package className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl">{products.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm text-gray-600">Pending Orders</CardTitle>
                    <Clock className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl">{getPendingOrders().length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm text-gray-600">Completed Orders</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl">{getCollectedOrders().length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm text-gray-600">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl">ZMW {getTotalRevenue().toFixed(2)}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No orders yet</p>
                  ) : (
                    <div className="space-y-4">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="mb-1">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-sm text-gray-500">
                              {order.items.length} item(s) • {order.recipient_phone_number}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="mb-1">ZMW {order.total_amount_zmw.toFixed(2)}</p>
                            <p className={`text-sm ${
                              order.status === 'paid' ? 'text-blue-600' : 'text-green-600'
                            }`}>
                              {order.status === 'paid' ? 'Pending' : 'Collected'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
