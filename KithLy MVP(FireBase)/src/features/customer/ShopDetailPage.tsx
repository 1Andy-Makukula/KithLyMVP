import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShopById, Shop } from '../../api/shops';
import { getProductsByShopId, Product } from '../../api/products';
import { CustomerHeader } from '../../components/layout/CustomerHeader';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../components/ui/sheet';
import { Badge } from '../../components/ui/badge';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { MapPin, ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../../hooks/useAuth';

interface CartItem extends Product {
  quantity: number;
}

export function ShopDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadShopData(id);
    }
  }, [id]);

  const loadShopData = async (shopId: string) => {
    setLoading(true);
    const [shopData, productsData] = await Promise.all([
      getShopById(shopId),
      getProductsByShopId(shopId)
    ]);
    setShop(shopData);
    setProducts(productsData);
    setLoading(false);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success('Added to cart');
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === productId) {
          const newQuantity = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + (item.price_zmw * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Pass cart data to checkout page via state
    setCartOpen(false);
    navigate('/checkout', { state: { cart, shop } });
  };

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerHeader />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerHeader />
        <div className="text-center py-20">
          <h2 className="text-2xl text-gray-600">Shop not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Shop Header */}
          <div className="bg-white rounded-lg p-8 mb-8 shadow-sm">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={shop.logo_image_url}
                  alt={shop.shop_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl mb-2">{shop.shop_name}</h1>
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="h-5 w-5 mt-0.5" />
                  <p>{shop.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">Available Products</h2>
              
              {/* Floating Cart Button */}
              <Sheet open={cartOpen} onOpenChange={setCartOpen}>
                <SheetTrigger asChild>
                  <Button size="lg" className="relative">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    View Cart
                    {cart.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 bg-pink-600">
                        {getCartCount()}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Your Cart
                    </SheetTitle>
                  </SheetHeader>

                  <div className="mt-8">
                    {cart.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingCart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">Your cart is empty</p>
                        <p className="text-sm text-gray-400 mt-2">Add some delicious items!</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4 mb-6">
                          {cart.map((item) => (
                            <div key={item.id} className="flex items-start gap-3 pb-4 border-b">
                              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <ImageWithFallback
                                  src={item.image_url}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                  <h4 className="truncate pr-2">{item.name}</h4>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 -mt-1"
                                    onClick={() => updateQuantity(item.id, -item.quantity)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                                <p className="text-sm text-purple-600 mb-3">
                                  ZMW {item.price_zmw.toFixed(2)}
                                </p>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.id, -1)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="text-sm w-10 text-center">{item.quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.id, 1)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                  <span className="text-sm text-gray-500 ml-auto">
                                    ZMW {(item.price_zmw * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t pt-4 mb-6">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="text-lg">
                              ZMW {getTotalAmount().toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-lg">Total</span>
                            <span className="text-2xl text-purple-600">
                              ZMW {getTotalAmount().toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <Button onClick={handleCheckout} className="w-full" size="lg">
                          Proceed to Checkout
                        </Button>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            {products.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500">No products available at the moment</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="h-48 bg-gray-100">
                      <ImageWithFallback
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl text-purple-600">
                          ZMW {product.price_zmw.toFixed(2)}
                        </span>
                        <Button onClick={() => addToCart(product)} size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
