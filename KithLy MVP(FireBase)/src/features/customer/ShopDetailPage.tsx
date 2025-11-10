import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { getShopById } from '../../api/shops';
import { getShopProducts } from '../../api/products';
import { Shop, Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

export const ShopDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const shopData = await getShopById(id);
        setShop(shopData);
        if (shopData) {
          const productData = await getShopProducts(id);
          setProducts(productData);
        }
      } catch (error) {
        console.error("Error fetching shop details:", error);
        toast.error("Failed to load shop details.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return <MainLayout><div className="text-center p-10">Loading shop...</div></MainLayout>;
  }

  if (!shop) {
    return <MainLayout><div className="text-center p-10">Shop not found.</div></MainLayout>;
  }

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };


  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <img
            src={shop.logo_image_url || 'https://via.placeholder.com/1200x400/cccccc/FFFFFF?text=Welcome'}
            alt={`${shop.shop_name} banner`}
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h1 className="text-4xl font-bold text-gray-800">{shop.shop_name}</h1>
            <p className="text-lg text-gray-600 mt-2">{shop.address}</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mt-12 mb-6">Available Products</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.filter(p => p.is_available).map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
              <img
                src={product.image_url || 'https://via.placeholder.com/300x200/cccccc/FFFFFF?text=Product'}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="text-gray-600 mt-1 flex-grow">K {product.price_zmw.toFixed(2)}</p>
                <Button
                  onClick={() => handleAddToCart(product)}
                  className="w-full mt-4 bg-[#2ECC71] hover:bg-green-600"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
        {products.filter(p => p.is_available).length === 0 && (
          <p className="text-center text-gray-500 py-8">This shop has no products available at the moment.</p>
        )}
      </div>
    </MainLayout>
  );
};
