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
import { Offer, CreateOfferRequest } from '@/types/offers';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

interface OfferFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer?: Offer | null;
  onSuccess: () => void;
}

export function OfferFormModal({ isOpen, onClose, offer, onSuccess }: OfferFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateOfferRequest>();

  const isEditing = !!offer;
  const offerType = watch('type');

  useEffect(() => {
    if (isOpen) {
      if (offer) {
        // Populate form with offer data
        setValue('type', offer.type);
        setValue('title', offer.title);
        setValue('description', offer.description || '');
        setValue('value', offer.value);
        setValue('valid_until', offer.valid_until.split('T')[0]); // Format for date input
        setValue('usage_limit', offer.usage_limit || undefined);
        setValue('min_purchase', offer.min_purchase || undefined);
        setValue('max_discount', offer.max_discount || undefined);
      } else {
        reset();
      }
    }
  }, [isOpen, offer, setValue, reset]);

  const onSubmit = async (data: CreateOfferRequest) => {
    setIsLoading(true);
    try {
      // Format the date properly
      const formattedData = {
        ...data,
        valid_until: new Date(data.valid_until).toISOString(),
      };

      if (isEditing && offer) {
        await apiClient.updateOffer({ ...formattedData, id: offer.id });
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Offer updated successfully',
        });
      } else {
        await apiClient.createOffer(formattedData);
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Offer created successfully',
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'create'} offer`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Offer' : 'Create New Offer'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update offer information' : 'Fill in the details to create a new promotional offer'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Offer Title *</Label>
              <Input
                id="title"
                {...register('title', { required: 'Offer title is required' })}
                placeholder="Enter offer title"
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Offer Type *</Label>
              <Select onValueChange={(value) => setValue('type', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select offer type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage Off</SelectItem>
                  <SelectItem value="fixed_amount">Fixed Amount Off</SelectItem>
                  <SelectItem value="buy_one_get_one">Buy One Get One</SelectItem>
                  <SelectItem value="flash_sale">Flash Sale</SelectItem>
                  <SelectItem value="bundle">Bundle Deal</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter offer description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value">
                {offerType === 'percentage' ? 'Discount Percentage *' : 'Discount Amount *'}
              </Label>
              <Input
                id="value"
                type="number"
                step={offerType === 'percentage' ? '1' : '0.01'}
                {...register('value', { 
                  required: 'Value is required',
                  min: { value: 0, message: 'Value must be positive' }
                })}
                placeholder={offerType === 'percentage' ? '10' : '5.00'}
              />
              {errors.value && (
                <p className="text-sm text-red-600">{errors.value.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="valid_until">Valid Until *</Label>
              <Input
                id="valid_until"
                type="date"
                {...register('valid_until', { required: 'Expiry date is required' })}
              />
              {errors.valid_until && (
                <p className="text-sm text-red-600">{errors.valid_until.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="usage_limit">Usage Limit</Label>
              <Input
                id="usage_limit"
                type="number"
                {...register('usage_limit')}
                placeholder="Unlimited"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="min_purchase">Minimum Purchase</Label>
              <Input
                id="min_purchase"
                type="number"
                step="0.01"
                {...register('min_purchase')}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_discount">Maximum Discount</Label>
              <Input
                id="max_discount"
                type="number"
                step="0.01"
                {...register('max_discount')}
                placeholder="No limit"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Offer' : 'Create Offer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}