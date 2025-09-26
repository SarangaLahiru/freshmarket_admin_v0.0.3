'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader as Loader2 } from 'lucide-react';
import { User } from '@/types/auth';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

interface CreateUserRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
  is_verified?: boolean;
}

interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id: string;
}

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  onSuccess: () => void;
}

export function UserFormModal({ isOpen, onClose, user, onSuccess }: UserFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateUserRequest | UpdateUserRequest>();

  const isEditing = !!user;

  useEffect(() => {
    if (isOpen) {
      if (user) {
        // Populate form with user data
        setValue('name', user.name);
        setValue('email', user.email);
        setValue('phone', user.phone || '');
        setValue('is_verified', user.is_verified);
      } else {
        reset();
      }
    }
  }, [isOpen, user, setValue, reset]);

  const onSubmit = async (data: CreateUserRequest | UpdateUserRequest) => {
    setIsLoading(true);
    try {
      if (isEditing && user) {
        await apiClient.updateUser({ ...data, id: user.id } as UpdateUserRequest);
        toast({
          variant: 'success',
          title: 'Success',
          description: 'User updated successfully',
        });
      } else {
        await apiClient.createUser(data as CreateUserRequest);
        toast({
          variant: 'success',
          title: 'Success',
          description: 'User created successfully',
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'create'} user`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update user information' : 'Fill in the details to create a new user'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              {...register('name', { required: 'Name is required' })}
              placeholder="Enter full name"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="Enter phone number"
            />
          </div>

          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="is_verified"
              onCheckedChange={(checked) => setValue('is_verified', checked)}
              defaultChecked={user?.is_verified}
            />
            <Label htmlFor="is_verified">Verified User</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}