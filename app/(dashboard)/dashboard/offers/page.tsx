'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Offer } from '@/types/offers';
import { useAuth } from '@/hooks/use-auth';
import { PERMISSIONS } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { OfferFormModal } from '@/components/modals/offer-form-modal';
import { DeleteConfirmationModal } from '@/components/modals/delete-confirmation-modal';
import { Plus, CreditCard as Edit, Trash2, Eye, Calendar, Percent, DollarSign, Users, Target } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const { toast } = useToast();
  
  const { hasPermission } = useAuth();
  
  const canView = hasPermission(PERMISSIONS.OFFERS_VIEW);
  const canCreate = hasPermission(PERMISSIONS.OFFERS_CREATE);
  const canUpdate = hasPermission(PERMISSIONS.OFFERS_UPDATE);
  const canDelete = hasPermission(PERMISSIONS.OFFERS_DELETE);

  useEffect(() => {
    if (!canView) return;
    
    const fetchOffers = async () => {
      try {
        const data = await apiClient.getOffers();
        setOffers(data);
      } catch (error) {
        console.error('Failed to fetch offers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [canView]);

  const getOfferTypeLabel = (type: Offer['type']) => {
    const labels = {
      percentage: 'Percentage Off',
      fixed_amount: 'Fixed Amount',
      buy_one_get_one: 'Buy One Get One',
      flash_sale: 'Flash Sale',
      bundle: 'Bundle Deal',
    };
    return labels[type];
  };

  const getOfferTypeIcon = (type: Offer['type']) => {
    switch (type) {
      case 'percentage':
        return <Percent className="w-4 h-4" />;
      case 'fixed_amount':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const isOfferActive = (offer: Offer) => {
    return offer.is_active && new Date(offer.valid_until) > new Date();
  };

  const getUsagePercentage = (offer: Offer) => {
    if (!offer.usage_limit) return 0;
    return (offer.used_count / offer.usage_limit) * 100;
  };

  const handleAddOffer = () => {
    setSelectedOffer(null);
    setShowOfferForm(true);
  };

  const handleEditOffer = (offer: Offer) => {
    setSelectedOffer(offer);
    setShowOfferForm(true);
  };

  const handleDeleteOffer = (offer: Offer) => {
    setSelectedOffer(offer);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedOffer) return;
    
    try {
      await apiClient.deleteOffer(selectedOffer.id);
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Offer deleted successfully',
      });
      fetchOffers();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete offer',
      });
    }
  };

  const fetchOffers = async () => {
    try {
      const data = await apiClient.getOffers();
      setOffers(data);
    } catch (error) {
      console.error('Failed to fetch offers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to view offers.</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Offers</h1>
          <p className="text-gray-600 mt-2">Manage promotional offers and discounts</p>
        </div>
        {canCreate && (
          <Button onClick={handleAddOffer} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Offer
          </Button>
        )}
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <Card key={offer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getOfferTypeIcon(offer.type)}
                    <Badge variant="outline">
                      {getOfferTypeLabel(offer.type)}
                    </Badge>
                    <Badge
                      className={isOfferActive(offer) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    >
                      {isOfferActive(offer) ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{offer.title}</CardTitle>
                  {offer.description && (
                    <CardDescription className="mt-1 line-clamp-2">
                      {offer.description}
                    </CardDescription>
                  )}
                </div>
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
                      <DropdownMenuItem onClick={() => handleEditOffer(offer)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Offer
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {canDelete && (
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteOffer(offer)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Offer
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Offer Value */}
              <div className="bg-primary/5 rounded-lg p-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {offer.type === 'percentage' ? `${offer.value}%` : `$${offer.value}`}
                  </div>
                  <div className="text-sm text-gray-600">
                    {offer.type === 'percentage' ? 'OFF' : 'DISCOUNT'}
                  </div>
                </div>
              </div>

              {/* Usage Stats */}
              {offer.usage_limit && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Usage</span>
                    <span className="font-medium">
                      {offer.used_count} / {offer.usage_limit}
                    </span>
                  </div>
                  <Progress value={getUsagePercentage(offer)} className="h-2" />
                </div>
              )}

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Expires
                  </span>
                  <span className="font-medium">
                    {new Date(offer.valid_until).toLocaleDateString()}
                  </span>
                </div>

                {offer.min_purchase && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Min Purchase</span>
                    <span className="font-medium">${offer.min_purchase}</span>
                  </div>
                )}

                {offer.max_discount && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Max Discount</span>
                    <span className="font-medium">${offer.max_discount}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Used
                  </span>
                  <span className="font-medium">{offer.used_count} times</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {offers.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No offers found</h3>
              <p className="text-gray-600 mb-4">
                Create your first promotional offer to boost sales and attract customers.
              </p>
              {canCreate && (
                <Button onClick={handleAddOffer} className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Offer
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <OfferFormModal
        isOpen={showOfferForm}
        onClose={() => setShowOfferForm(false)}
        offer={selectedOffer}
        onSuccess={fetchOffers}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Offer"
        description="Are you sure you want to delete this offer?"
        itemName={selectedOffer?.title || ''}
      />
    </div>
  );
}