'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Product } from '@/types/products';
import { useAuth } from '@/hooks/use-auth';
import { PERMISSIONS } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ProductFormModal } from '@/components/modals/product-form-modal';
import { ProductDetailsModal } from '@/components/modals/product-details-modal';
import { DeleteConfirmationModal } from '@/components/modals/delete-confirmation-modal';
import { Plus, Search, CreditCard as Edit, Trash2, Eye, Package, Star, Tag } from 'lucide-react';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [showProductForm, setShowProductForm] = useState(false);
    const [showProductDetails, setShowProductDetails] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const { toast } = useToast();
    const { hasPermission } = useAuth();

    const canView = hasPermission(PERMISSIONS.PRODUCTS_VIEW);
    const canCreate = hasPermission(PERMISSIONS.PRODUCTS_CREATE);
    const canUpdate = hasPermission(PERMISSIONS.PRODUCTS_UPDATE);
    const canDelete = hasPermission(PERMISSIONS.PRODUCTS_DELETE);

    const fetchProducts = async (page = 1) => {
        try {
            const { products: data, pages } = await apiClient.getProducts(page, 12);
            setProducts(data);
            setTotalPages(pages);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!canView) return;
        setLoading(true);
        fetchProducts(currentPage);
    }, [canView, currentPage]);

    const filteredProducts = useMemo(() => {
        if (!searchTerm) return products;
        const term = searchTerm.toLowerCase();
        return products.filter((p) =>
            p.name.toLowerCase().includes(term) ||
            (p.description || '').toLowerCase().includes(term) ||
            (p.category?.name || '').toLowerCase().includes(term)
        );
    }, [products, searchTerm]);

    const handleAddProduct = () => {
        setSelectedProduct(null);
        setShowProductForm(true);
    };

    const handleViewProduct = (product: Product) => {
        setSelectedProduct(product);
        setShowProductDetails(true);
    };

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        setShowProductForm(true);
    };

    const handleDeleteProduct = (product: Product) => {
        setSelectedProduct(product);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!selectedProduct) return;
        try {
            await apiClient.deleteProduct(selectedProduct.id);
            toast({ variant: 'success', title: 'Deleted', description: 'Product deleted successfully' });
            fetchProducts(currentPage);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete product' });
        } finally {
            setShowDeleteConfirm(false);
            setSelectedProduct(null);
        }
    };

    if (!canView) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600">You don't have permission to view products.</p>
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
                    <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600 mt-2">Manage your catalog of products</p>
                </div>
                {canCreate && (
                    <Button onClick={handleAddProduct} className="bg-green-600 hover:bg-green-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                    </Button>
                )}
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search products by name, category or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                    <Card key={product.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={product.image || 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'}
                                        alt={product.name}
                                        className="w-14 h-14 object-cover rounded-md border"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            {product.category?.name && <Badge variant="secondary">{product.category.name}</Badge>}
                                            {product.is_on_sale && (
                                                <Badge className="bg-red-100 text-red-800">
                                                    <Tag className="w-3 h-3 mr-1" />
                                                    On Sale
                                                </Badge>
                                            )}
                                            {product.is_featured && (
                                                <Badge className="bg-yellow-100 text-yellow-800">
                                                    <Star className="w-3 h-3 mr-1" />
                                                    Featured
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => handleViewProduct(product)}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Details
                                        </DropdownMenuItem>
                                        {canUpdate && (
                                            <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit Product
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator />
                                        {canDelete && (
                                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteProduct(product)}>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete Product
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">Price</div>
                                <div className="font-medium text-gray-900">${product.price.toFixed(2)}</div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">Stock</div>
                                <div className="font-medium text-gray-900">{product.stock_count} {product.unit}</div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <Card>
                    <CardContent className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                            <p className="text-gray-600">
                                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first product.'}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = i + 1;
                            return (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </Button>
                            );
                        })}
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* Modals */}
            <ProductFormModal
                isOpen={showProductForm}
                onClose={() => setShowProductForm(false)}
                product={selectedProduct}
                onSuccess={() => fetchProducts(currentPage)}
            />

            <ProductDetailsModal
                isOpen={showProductDetails}
                onClose={() => setShowProductDetails(false)}
                product={selectedProduct}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
            />

            <DeleteConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDelete}
                title="Delete Product"
                description="Are you sure you want to delete this product?"
                itemName={selectedProduct?.name || ''}
            />
        </div>
    );
}

