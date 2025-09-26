'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Star, Package, Calendar, CreditCard as Edit, Trash2 } from 'lucide-react';
import { Product } from '@/types/products';
import { useAuth } from '@/hooks/use-auth';
import { PERMISSIONS } from '@/lib/auth';

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductDetailsModal({ 
  isOpen, 
  onClose, 
  product, 
  onEdit, 
  onDelete 
}: ProductDetailsModalProps) {
  const { hasPermission } = useAuth();
  const canUpdate = hasPermission(PERMISSIONS.PRODUCTS_UPDATE);
  const canDelete = hasPermission(PERMISSIONS.PRODUCTS_DELETE);

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Image and Basic Info */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <img
                src={product.image || 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            
            <div className="md:w-2/3 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
                <p className="text-gray-600 mt-1">{product.category?.name}</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-3xl font-bold text-green-600">
                  ${product.price}
                </div>
                {product.original_price && product.original_price > product.price && (
                  <div className="text-lg text-gray-500 line-through">
                    ${product.original_price}
                  </div>
                )}
                <div className="text-gray-500">
                  per {product.unit}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-gray-500">({product.review_count} reviews)</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.is_featured && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {product.is_on_sale && (
                  <Badge variant="destructive">On Sale</Badge>
                )}
                <Badge
                  className={product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                >
                  {product.in_stock ? 'In Stock' : 'Out of Stock'}
                </Badge>
                <Badge
                  className={product.is_active ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}
                >
                  {product.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          {product.description && (
            <div>
              <h4 className="text-lg font-semibold mb-2">Description</h4>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}

          <Separator />

          {/* Stock and Inventory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-3">Inventory</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Stock Count:</span>
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{product.stock_count} {product.unit}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Stock Status:</span>
                  <Badge
                    className={
                      product.stock_count < 20 ? 'bg-red-100 text-red-800' :
                      product.stock_count < 50 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }
                  >
                    {product.stock_count < 20 ? 'Critical' :
                     product.stock_count < 50 ? 'Low' : 'Good'}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3">Timestamps</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Created:</span>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{new Date(product.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Updated:</span>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{new Date(product.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {canUpdate && (
              <Button 
                onClick={() => onEdit(product)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Product
              </Button>
            )}
            {canDelete && (
              <Button 
                variant="destructive" 
                onClick={() => onDelete(product)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Product
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}