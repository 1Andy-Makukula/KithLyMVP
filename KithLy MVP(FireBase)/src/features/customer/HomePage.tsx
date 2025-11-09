import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getVerifiedShops, Shop } from '../../api/shops';
import { CustomerHeader } from '../../components/layout/CustomerHeader';
import { Card, CardContent } from '../../components/ui/card';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { MapPin, Store } from 'lucide-react';

export function HomePage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = async () => {
    setLoading(true);
    const data = await getVerifiedShops();
    setShops(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl mb-4">Send Love from Anywhere</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Send authentic Zambian gifts to your loved ones. They collect from local shops.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : shops.length === 0 ? (
            <div className="text-center py-12">
              <Store className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl text-gray-600 mb-2">No shops available yet</h2>
              <p className="text-gray-500">Check back soon for verified shops!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shops.map((shop) => (
                <Link key={shop.id} to={`/shop/${shop.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className="h-48 bg-gray-100 relative">
                      <ImageWithFallback
                        src={shop.logo_image_url}
                        alt={shop.shop_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl mb-2">{shop.shop_name}</h3>
                      <div className="flex items-start gap-2 text-gray-600">
                        <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                        <p className="text-sm">{shop.address}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
