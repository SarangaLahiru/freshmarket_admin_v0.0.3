export interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  growthRate: number;
  activeOffers: number;
  activeBanners: number;
  lowStockProducts: number;
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
}

export interface CustomerEngagement {
  daily: ChartData[];
  weekly: ChartData[];
  monthly: ChartData[];
  yearly: ChartData[];
}

export interface ProductAnalytics {
  topSellingProducts: Array<{
    id: string;
    name: string;
    category: string;
    sales: number;
    revenue: number;
  }>;
  categoryPerformance: Array<{
    category: string;
    products: number;
    sales: number;
    revenue: number;
  }>;
  stockAnalysis: Array<{
    product: string;
    current_stock: number;
    threshold: number;
    status: 'critical' | 'low' | 'adequate' | 'high';
  }>;
}

export interface CustomerAnalytics {
  topCustomers: Array<{
    id: string;
    name: string;
    email: string;
    total_orders: number;
    total_spent: number;
    last_order: string;
  }>;
  customerGrowth: ChartData[];
  customerSegmentation: Array<{
    segment: string;
    count: number;
    percentage: number;
  }>;
}