'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Banner } from '@/types/banners';
import { useAuth } from '@/hooks/use-auth';
import { PERMISSIONS } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BannerFormModal } from '@/components/modals/banner-form-modal';
import { DeleteConfirmationModal } from '@/components/modals/delete-confirmation-modal';
import { Plus, CreditCard as Edit, Trash2, Eye, Image as ImageIcon, ExternalLink, ArrowUp, ArrowDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const { toast } = useToast();
  
  const { hasPermission } = useAuth();
  
  const canView = hasPermission(PERMISSIONS.BANNERS_VIEW);
  const canCreate = hasPermission(PERMISSIONS.BANNERS_CREATE);
  const canUpdate = hasPermission(PERMISSIONS.BANNERS_UPDATE);
  const canDelete = hasPermission(PERMISSIONS.BANNERS_DELETE);

  useEffect(() => {
    if (!canView) return;
    
    const fetchBanners = async () => {
      try {
        const data = await apiClient.getBanners();
        setBanners(data.sort((a, b) => a.sort_order - b.sort_order));
      } catch (error) {
        console.error('Failed to fetch banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [canView]);

  const handleAddBanner = () => {
    setSelectedBanner(null);
    setShowBannerForm(true);
  };

  const handleEditBanner = (banner: Banner) => {
    setSelectedBanner(banner);
    setShowBannerForm(true);
  };

  const handleDeleteBanner = (banner: Banner) => {
    setSelectedBanner(banner);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedBanner) return;
    
    try {
      await apiClient.deleteBanner(selectedBanner.id);
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Banner deleted successfully',
      });
      fetchBanners();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete banner',
      });
    }
  };

  const fetchBanners = async () => {
    try {
      const data = await apiClient.getBanners();
      setBanners(data.sort((a, b) => a.sort_order - b.sort_order));
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to view banners.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Banners</h1>
          <p className="text-gray-600 mt-2">Manage promotional banners and hero sections</p>
        </div>
        {canCreate && (
          <Button onClick={handleAddBanner} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Banner
          </Button>
        )}
      </div>

      {/* Banners List */}
      <div className="space-y-6">
        {banners.map((banner, index) => (
          <Card key={banner.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="md:flex">
              {/* Banner Image */}
              <div className="md:w-1/3">
                <img
                  src={banner.image}
                  alt={banner.image_alt || banner.title}
                  className="w-full h-48 md:h-full object-cover"
                />
              </div>
              
              {/* Banner Content */}
              <div className="md:w-2/3 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline">#{banner.sort_order}</Badge>
                      <Badge
                        className={banner.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      >
                        {banner.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{banner.title}</h3>
                    {banner.subtitle && (
                      <p className="text-lg text-gray-600 mb-2">{banner.subtitle}</p>
                    )}
                    {banner.description && (
                      <p className="text-gray-600 mb-3 line-clamp-2">{banner.description}</p>
                    )}
                    {banner.link_url && (
                      <div className="flex items-center text-sm text-primary">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        <span>Links to: {banner.link_url}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {canUpdate && (
                      <div className="flex flex-col space-y-1">
                        <Button variant="outline" size="sm" disabled={index === 0}>
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" disabled={index === banners.length - 1}>
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {canUpdate && (
                          <>
                            <DropdownMenuItem onClick={() => handleEditBanner(banner)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Banner
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {banner.is_active ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        {canDelete && (
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteBanner(banner)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Banner
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                {/* Metadata */}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Created: {new Date(banner.created_at).toLocaleDateString()}</span>
                  <span>Updated: {new Date(banner.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {banners.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No banners found</h3>
              <p className="text-gray-600 mb-4">
                Create your first banner to showcase promotions and important announcements.
              </p>
              {canCreate && (
                <Button onClick={handleAddBanner} className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Banner
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <BannerFormModal
        isOpen={showBannerForm}
        onClose={() => setShowBannerForm(false)}
        banner={selectedBanner}
        onSuccess={fetchBanners}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Banner"
        description="Are you sure you want to delete this banner?"
        itemName={selectedBanner?.title || ''}
      />
    </div>
  );
}