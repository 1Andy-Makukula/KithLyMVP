import React, { useState } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/table';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

// Mock Product Data
const mockProducts = [
  { id: 1, name: 'Red Velvet Cake', price: 850.00, stock: 15, isAvailable: true },
  { id: 2, name: 'Assorted Fruit Basket', price: 350.00, stock: 5, isAvailable: true },
  { id: 3, name: 'Custom Birthday Package', price: 1200.00, stock: 0, isAvailable: false },
];

export const ShopProducts: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null); // Used for editing a product

  const handleEdit = (product: any) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  const handleNewProduct = () => {
    setCurrentProduct(null);
    setIsEditing(true);
  };

  return (
    <PortalLayout title="Product Management">
      <div className="flex justify-end mb-6">
        <Button
            onClick={handleNewProduct}
            className="bg-[#2ECC71] hover:bg-green-600 transition duration-300"
        >
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
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>K {product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.isAvailable ? 'bg-[#2ECC71]/20 text-[#2ECC71]' : 'bg-red-500/20 text-red-700'
                        }`}
                    >
                      {product.isAvailable ? 'Available' : 'Sold Out'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                      <Edit className="h-4 w-4 text-[#3498DB]" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => alert(`Delete ${product.name}?`)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* TODO: Add a Dialog/Sheet component here for the Product Edit form */}
      {isEditing && <div>Product Edit Form Placeholder for {currentProduct?.name || 'New Product'}</div>}
    </PortalLayout>
  );
};
