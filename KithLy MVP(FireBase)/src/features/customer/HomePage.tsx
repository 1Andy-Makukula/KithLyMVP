import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';
import { getVerifiedShops } from '../../api/shops';
import { Shop } from '../../types';
import { toast } from "sonner";


export const HomePage: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const fetchedShops = await getVerifiedShops();
        setShops(fetchedShops);
      } catch (error) {
        console.error("Error fetching shops:", error);
        toast.error("Failed to load shops. Please try refreshing the page.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchShops();
  }, []);

  return (
    <MainLayout>
      {/* --- Emotional Header (Design Mandate 2.5) --- */}
      <div className="bg-[#3498DB]/10 rounded-xl p-8 mb-12 shadow-inner">
        <h1 className="text-4xl font-extrabold text-[#3498DB] mb-2">
          Send Love, Not Just Money.
        </h1>
        <p className="text-xl text-gray-700 max-w-2xl">
          Instantly connect with your family in Lusaka by sending the exact, locally-sourced gifts they need, securely and reliably.
        </p>
      </div>

      {/* --- Shop Grid --- */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Verified Local Shops</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          <p>Loading shops...</p>
        ) : shops.length > 0 ? (
          shops.map((shop) => (
            <Link to={`/shop/${shop.id}`} key={shop.id}>
              <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
                <div className="h-48 overflow-hidden">
                   <img
                    src={shop.logo_image_url || 'https://via.placeholder.com/400x200/cccccc/FFFFFF?text=No+Image'}
                    alt={shop.shop_name}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl text-gray-900">{shop.shop_name}</CardTitle>
                    {shop.is_verified && (
                      <span className="text-xs font-semibold text-[#2ECC71] border border-[#2ECC71] rounded-full px-3 py-0.5">
                        VERIFIED
                      </span>
                    )}
                  </div>
                  <CardDescription className="text-gray-600 mb-4 h-12 overflow-hidden">
                    {shop.address}
                  </CardDescription>
                  <Button className="w-full bg-[#3498DB] hover:bg-blue-600">
                    Browse Shop
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <p>No shops are available at the moment. Please check back later.</p>
        )}
      </div>
    </MainLayout>
  );
};
