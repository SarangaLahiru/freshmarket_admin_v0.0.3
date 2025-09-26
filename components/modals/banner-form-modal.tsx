'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader as Loader2 } from 'lucide-react';
import { Banner, CreateBannerRequest } from '@/types/banners';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

interface BannerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  banner?: Banner | null;
  onSuccess: () => void;
}

export function BannerFormModal({ isOpen, onClose, banner, onSuccess }: BannerFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateBannerRequest>();

  const isEditing = !!banner;

  useEffect(() => {
    if (isOpen) {
      if (banner) {
        // Populate form with banner data
        setValue('title', banner.title);
        setValue('subtitle', banner.subtitle || '');
        setValue('description', banner.description || '');
        setValue('image', banner.image);
        setValue('image_alt', banner.image_alt || '');
        setValue('link_url', banner.link_url || '');
        setValue('sort_order', banner.sort_order);
      } else {
        reset();
      }
    }
  }, [isOpen, banner, setValue, reset]);

  const onSubmit = async (data: CreateBannerRequest) => {
    setIsLoading(true);
    try {
      if (isEditing && banner) {
        await apiClient.updateBanner({ ...data, id: banner.id });
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Banner updated successfully',
        });
      } else {
        await apiClient.createBanner(data);
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Banner created successfully',
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'create'} banner`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Banner' : 'Create New Banner'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update banner information' : 'Fill in the details to create a new promotional banner'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Banner Title *</Label>
              <Input
                id="title"
                {...register('title', { required: 'Banner title is required' })}
                placeholder="Enter banner title"
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                {...register('subtitle')}
                placeholder="Enter banner subtitle"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter banner description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="image">Image URL *</Label>
              <Input
                id="image"
                {...register('image', { required: 'Image URL is required' })}
                placeholder="https://example.com/banner.jpg"
              />
              {errors.image && (
                <p className="text-sm text-red-600">{errors.image.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_alt">Image Alt Text</Label>
              <Input
                id="image_alt"
                {...register('image_alt')}
                placeholder="Describe the image"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="link_url">Link URL</Label>
              <Input
                id="link_url"
                {...register('link_url')}
                placeholder="https://example.com/page"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                type="number"
                {...register('sort_order')}
                placeholder="1"
                defaultValue={1}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Banner' : 'Create Banner'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}