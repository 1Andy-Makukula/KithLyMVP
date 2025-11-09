import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';

// Mock data to simulate rich shop cards
const mockShops = [
  { id: 'shoprite-mvs', name: 'Shoprite (Novare Mall)', category: 'Groceries', imageUrl: 'https://via.placeholder.com/400x200/3498DB/FFFFFF?text=Shoprite+Lusaka', description: 'Your essential weekly groceries, now available for your family.', verified: true },
  { id: 'cakebar-lusaka', name: 'The Cake Bar', category: 'Bakery', imageUrl: 'https://via.placeholder.com/400x200/F7F7F7/2ECC71?text=The+Cake+Bar', description: 'Custom cakes and fresh bakes for birthdays and celebrations.', verified: true },
  { id: 'butcher-manda', name: 'Manda Hill Butchery', category: 'Meat & Protein', imageUrl: 'https://via.placeholder.com/400x200/2ECC71/FFFFFF?text=Butchery+Fresh', description: 'High-quality meats and fresh cuts for family meals.', verified: true },
];

export const HomePage: React.FC = () => {
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
        {mockShops.map((shop) => (
          <Link to={`/shop/${shop.id}`} key={shop.id}>
            <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
              {/* Image section for visual connection */}
              <div className="h-48 overflow-hidden">
                 <img
                  src={shop.imageUrl}
                  alt={shop.name}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl text-gray-900">{shop.name}</CardTitle>
                  {shop.verified && (
                    <span className="text-xs font-semibold text-[#2ECC71] border border-[#2ECC71] rounded-full px-3 py-0.5">
                      VERIFIED
                    </span>
                  )}
                </div>
                <CardDescription className="text-gray-600 mb-4">
                  {shop.description}
                </CardDescription>
                <Button className="w-full bg-[#3498DB] hover:bg-blue-600">
                  Browse Shop
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </MainLayout>
  );
};
