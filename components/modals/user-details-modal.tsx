'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone, Calendar, CreditCard as Edit, Trash2, ShieldCheck, Shield } from 'lucide-react';
import { User } from '@/types/auth';
import { useAuth } from '@/hooks/use-auth';
import { PERMISSIONS } from '@/lib/auth';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserDetailsModal({ 
  isOpen, 
  onClose, 
  user, 
  onEdit, 
  onDelete 
}: UserDetailsModalProps) {
  const { hasPermission } = useAuth();
  const canUpdate = hasPermission(PERMISSIONS.USERS_UPDATE);
  const canDelete = hasPermission(PERMISSIONS.USERS_DELETE);

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Avatar and Basic Info */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-green-100 text-green-800 text-lg">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                {user.is_verified ? (
                  <Badge className="bg-green-100 text-green-800">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <Shield className="w-3 h-3 mr-1" />
                    Unverified
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              
              {user.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Account Information */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Account Information</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">User ID:</span>
                <span className="font-mono text-sm">{user.id}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Verification Status:</span>
                <Badge
                  className={user.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                >
                  {user.is_verified ? 'Verified' : 'Pending Verification'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Member Since:</span>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{new Date(user.updated_at).toLocaleDateString()}</span>
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
                onClick={() => onEdit(user)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit User
              </Button>
            )}
            {canDelete && (
              <Button 
                variant="destructive" 
                onClick={() => onDelete(user)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete User
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}