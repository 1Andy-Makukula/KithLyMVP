import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/table';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { useAuth } from '../../hooks/useAuth';
import { Product } from '../../types';
import { getShopProducts, addProduct, updateProduct, deleteProduct } from '../../api/products';
import { toast } from "sonner";


export const ShopProducts: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (user?.shop_id) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    if (!user?.shop_id) return;
    setIsLoading(true);
    try {
      const fetchedProducts = await getShopProducts(user.shop_id);
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        toast.success('Product deleted successfully!');
        fetchProducts(); // Refresh list
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error('Failed to delete product.');
      }
    }
  };

  return (
    <PortalLayout title="Product Management">
      <div className="flex justify-end mb-6">
        <Button onClick={handleAddNew} className="bg-[#2ECC71] hover:bg-green-600 transition duration-300">
          <PlusCircle className="h-5 w-5 mr-2" />
          Add New Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-[#3498DB]">Your Current Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price (ZMW)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4}>Loading products...</TableCell></TableRow>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>K {product.price_zmw.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                        <Edit className="h-4 w-4 text-[#3498DB]" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={4} className="text-center">No products found. Add one to get started!</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ProductFormDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        product={editingProduct}
        shopId={user?.shop_id}
        onSave={fetchProducts}
      />
    </PortalLayout>
  );
};

// Sub-component for the Add/Edit Product Form
interface ProductFormDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  product: Product | null;
  shopId: string | undefined;
  onSave: () => void;
}

const ProductFormDialog: React.FC<ProductFormDialogProps> = ({ isOpen, setIsOpen, product, shopId, onSave }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(String(product.price_zmw));
      setImageUrl(product.image_url || '');
      setIsAvailable(product.is_available);
    } else {
      // Reset form for new product
      setName('');
      setPrice('');
      setImageUrl('');
      setIsAvailable(true);
    }
  }, [product, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopId) {
      toast.error("Cannot save product, shop not identified.");
      return;
    }
    setIsSubmitting(true);
    const productData = {
      name,
      price_zmw: parseFloat(price),
      image_url: imageUrl,
      is_available: isAvailable,
    };

    try {
      if (product) {
        await updateProduct(product.id, productData);
        toast.success("Product updated successfully!");
      } else {
        await addProduct(shopId, productData);
        toast.success("Product added successfully!");
      }
      onSave();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to save product:", error);
      toast.error("An error occurred while saving the product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            Fill in the details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Price (ZMW)</Label>
              <Input id="price" type="number" value={price} onChange={e => setPrice(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
              <Input id="imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isAvailable" className="text-right">Available</Label>
              <Switch id="isAvailable" checked={isAvailable} onCheckedChange={setIsAvailable} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="bg-[#2ECC71] hover:bg-green-600">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
