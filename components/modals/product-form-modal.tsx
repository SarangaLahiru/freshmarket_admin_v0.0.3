'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader as Loader2 } from 'lucide-react';
import { Product, Category, CreateProductRequest, UpdateProductRequest } from '@/types/products';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSuccess: () => void;
}

export function ProductFormModal({ isOpen, onClose, product, onSuccess }: ProductFormModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProductRequest | UpdateProductRequest>();

  const isEditing = !!product;

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (product) {
        // Populate form with product data
        setValue('name', product.name);
        setValue('description', product.description || '');
        setValue('price', product.price);
        setValue('original_price', product.original_price || product.price);
        setValue('category_id', product.category_id);
        setValue('image', product.image || '');
        setValue('unit', product.unit);
        setValue('stock_count', product.stock_count);
        setValue('is_featured', product.is_featured);
        setValue('is_on_sale', product.is_on_sale);
      } else {
        reset();
      }
    }
  }, [isOpen, product, setValue, reset]);

  const fetchCategories = async () => {
    try {
      const data = await apiClient.getCategories();
      setCategories(data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch categories',
      });
    }
  };

  const onSubmit = async (data: CreateProductRequest | UpdateProductRequest) => {
    setIsLoading(true);
    try {
      if (isEditing && product) {
        await apiClient.updateProduct({ ...data, id: product.id } as UpdateProductRequest);
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Product updated successfully',
        });
      } else {
        await apiClient.createProduct(data as CreateProductRequest);
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Product created successfully',
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'create'} product`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update product information' : 'Fill in the details to create a new product'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Product name is required' })}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id">Category *</Label>
              <Select onValueChange={(value) => setValue('category_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category_id && (
                <p className="text-sm text-red-600">{errors.category_id.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', { 
                  required: 'Price is required',
                  min: { value: 0, message: 'Price must be positive' }
                })}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="original_price">Original Price</Label>
              <Input
                id="original_price"
                type="number"
                step="0.01"
                {...register('original_price')}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select onValueChange={(value) => setValue('unit', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilogram (kg)</SelectItem>
                  <SelectItem value="piece">Piece</SelectItem>
                  <SelectItem value="liter">Liter</SelectItem>
                  <SelectItem value="dozen">Dozen</SelectItem>
                  <SelectItem value="pack">Pack</SelectItem>
                </SelectContent>
              </Select>
              {errors.unit && (
                <p className="text-sm text-red-600">{errors.unit.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock_count">Stock Count *</Label>
              <Input
                id="stock_count"
                type="number"
                {...register('stock_count', { 
                  required: 'Stock count is required',
                  min: { value: 0, message: 'Stock count must be positive' }
                })}
                placeholder="0"
              />
              {errors.stock_count && (
                <p className="text-sm text-red-600">{errors.stock_count.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                {...register('image')}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                onCheckedChange={(checked) => setValue('is_featured', checked)}
                defaultChecked={product?.is_featured}
              />
              <Label htmlFor="is_featured">Featured Product</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_on_sale"
                onCheckedChange={(checked) => setValue('is_on_sale', checked)}
                defaultChecked={product?.is_on_sale}
              />
              <Label htmlFor="is_on_sale">On Sale</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}