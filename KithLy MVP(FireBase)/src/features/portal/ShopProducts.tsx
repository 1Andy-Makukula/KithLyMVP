import { useEffect, useState } from 'react';
import { ShopSidebar } from '../../components/layout/ShopSidebar';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { getProductsByShopId, addProduct, updateProduct, deleteProduct, Product } from '../../api/products';
import { useAuth } from '../../hooks/useAuth';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function ShopProducts() {
  const { userData } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price_zmw: '',
    description: '',
    image_url: ''
  });

  useEffect(() => {
    if (userData?.shop_id) {
      loadProducts(userData.shop_id);
    }
  }, [userData]);

  const loadProducts = async (shopId: string) => {
    setLoading(true);
    const data = await getProductsByShopId(shopId);
    setProducts(data);
    setLoading(false);
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price_zmw: product.price_zmw.toString(),
        description: product.description,
        image_url: product.image_url
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price_zmw: '',
        description: '',
        image_url: ''
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData?.shop_id) return;

    try {
      const productData = {
        shop_id: userData.shop_id,
        name: formData.name,
        price_zmw: parseFloat(formData.price_zmw),
        description: formData.description,
        image_url: formData.image_url,
        is_available: true
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast.success('Product updated successfully');
      } else {
        await addProduct(productData);
        toast.success('Product added successfully');
      }

      setIsDialogOpen(false);
      loadProducts(userData.shop_id);
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(productId);
      toast.success('Product deleted');
      if (userData?.shop_id) {
        loadProducts(userData.shop_id);
      }
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ShopSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl">Products</h1>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (ZMW)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price_zmw}
                      onChange={(e) => setFormData({ ...formData, price_zmw: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-sm text-gray-500">
                      Note: In production, you would upload images to Firebase Storage
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingProduct ? 'Update' : 'Add'} Product
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl text-gray-600 mb-2">No products yet</h2>
              <p className="text-gray-500 mb-6">Add your first product to start selling</p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
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
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl text-purple-600">
                        ZMW {product.price_zmw.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleOpenDialog(product)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
