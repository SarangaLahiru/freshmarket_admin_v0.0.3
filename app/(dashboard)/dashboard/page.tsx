'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { DashboardStats, CustomerEngagement, ProductAnalytics, CustomerAnalytics } from '@/types/dashboard';
import { StatsCard } from '@/components/charts/stats-card';
import { CustomerEngagementChart } from '@/components/charts/customer-engagement-chart';
import { CategoryPerformanceChart } from '@/components/charts/category-performance-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Tag,
  Image,
  AlertTriangle,
} from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [customerEngagement, setCustomerEngagement] = useState<CustomerEngagement | null>(null);
  const [productAnalytics, setProductAnalytics] = useState<ProductAnalytics | null>(null);
  const [customerAnalytics, setCustomerAnalytics] = useState<CustomerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, engagementData, productData, customerData] = await Promise.all([
          apiClient.getDashboardStats(),
          apiClient.getCustomerEngagement(),
          apiClient.getProductAnalytics(),
          apiClient.getCustomerAnalytics(),
        ]);

        setStats(statsData);
        setCustomerEngagement(engagementData);
        setProductAnalytics(productData);
        setCustomerAnalytics(customerData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin dashboard overview</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Products"
            value={stats.totalProducts}
            change={5.2}
            icon={Package}
            iconColor="text-blue-600"
            trend="up"
          />
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            change={12.1}
            icon={Users}
            iconColor="text-green-600"
            trend="up"
          />
          <StatsCard
            title="Total Orders"
            value={stats.totalOrders}
            change={8.7}
            icon={ShoppingCart}
            iconColor="text-purple-600"
            trend="up"
          />
          <StatsCard
            title="Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            change={stats.growthRate}
            icon={DollarSign}
            iconColor="text-emerald-600"
            trend="up"
          />
        </div>
      )}

      {/* Additional Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Active Offers"
            value={stats.activeOffers}
            icon={Tag}
            iconColor="text-orange-600"
          />
          <StatsCard
            title="Active Banners"
            value={stats.activeBanners}
            icon={Image}
            iconColor="text-pink-600"
          />
          <StatsCard
            title="Low Stock Items"
            value={stats.lowStockProducts}
            icon={AlertTriangle}
            iconColor="text-red-600"
          />
          <StatsCard
            title="Growth Rate"
            value={`${stats.growthRate}%`}
            change={2.1}
            icon={TrendingUp}
            iconColor="text-indigo-600"
            trend="up"
          />
        </div>
      )}

      {/* Customer Engagement Charts */}
      {customerEngagement && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Engagement</CardTitle>
            <CardDescription>Track customer activity across different time periods</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="daily" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
              <TabsContent value="daily" className="mt-6">
                <CustomerEngagementChart
                  data={customerEngagement.daily}
                  title="Daily Customer Engagement"
                />
              </TabsContent>
              <TabsContent value="weekly" className="mt-6">
                <CustomerEngagementChart
                  data={customerEngagement.weekly}
                  title="Weekly Customer Engagement"
                />
              </TabsContent>
              <TabsContent value="monthly" className="mt-6">
                <CustomerEngagementChart
                  data={customerEngagement.monthly}
                  title="Monthly Customer Engagement"
                />
              </TabsContent>
              <TabsContent value="yearly" className="mt-6">
                <CustomerEngagementChart
                  data={customerEngagement.yearly}
                  title="Yearly Customer Engagement"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Performance */}
        {productAnalytics && (
          <CategoryPerformanceChart data={productAnalytics.categoryPerformance} />
        )}

        {/* Top Customers */}
        {customerAnalytics && (
          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
              <CardDescription>Your most valuable customers this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerAnalytics.topCustomers.slice(0, 5).map((customer, index) => (
                  <div key={customer.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${customer.total_spent.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{customer.total_orders} orders</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Top Selling Products */}
      {productAnalytics && (
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performing products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Sales</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {productAnalytics.topSellingProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-900">{product.name}</td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">{product.category}</Badge>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600">{product.sales}</td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900">
                        ${product.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stock Analysis */}
      {productAnalytics && (
        <Card>
          <CardHeader>
            <CardTitle>Stock Analysis</CardTitle>
            <CardDescription>Products requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {productAnalytics.stockAnalysis.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        item.status === 'critical' ? 'bg-red-500' :
                        item.status === 'low' ? 'bg-yellow-500' :
                        item.status === 'adequate' ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{item.product}</p>
                      <p className="text-sm text-gray-500">Threshold: {item.threshold}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{item.current_stock} units</p>
                    <Badge 
                      variant={item.status === 'critical' ? 'destructive' : 
                              item.status === 'low' ? 'destructive' : 'secondary'}
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}