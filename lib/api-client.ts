import { AuthResponse, LoginCredentials, User } from '@/types/auth';
import { DashboardStats, CustomerEngagement, ProductAnalytics, CustomerAnalytics } from '@/types/dashboard';
import { Product, Category, CreateProductRequest, UpdateProductRequest } from '@/types/products';
import { Offer, CreateOfferRequest } from '@/types/offers';
import { Banner, CreateBannerRequest } from '@/types/banners';

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

interface UpdateOfferRequest extends CreateOfferRequest {
  id: string;
}

interface UpdateBannerRequest extends CreateBannerRequest {
  id: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api') {
    this.baseUrl = baseUrl;
    
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${url}:`, error);
      throw error;
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Dummy response for now
    return {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYWRtaW4tMTIzIiwib3JnYW5pemF0aW9uX2lkIjoib3JnLTEyMyIsInJvbGUiOiJhZG1pbiIsInBlcm1pc3Npb25zIjpbInByb2R1Y3RzOnZpZXciLCJwcm9kdWN0czpjcmVhdGUiLCJwcm9kdWN0czp1cGRhdGUiLCJwcm9kdWN0czpkZWxldGUiLCJ1c2Vyczp2aWV3IiwidXNlcnM6Y3JlYXRlIiwidXNlcnM6dXBkYXRlIiwidXNlcnM6ZGVsZXRlIiwib2ZmZXJzOnZpZXciLCJvZmZlcnM6Y3JlYXRlIiwib2ZmZXJzOnVwZGF0ZSIsIm9mZmVyczpkZWxldGUiLCJiYW5uZXJzOnZpZXciLCJiYW5uZXJzOmNyZWF0ZSIsImJhbm5lcnM6dXBkYXRlIiwiYmFubmVyczpkZWxldGUiLCJhbmFseXRpY3M6dmlidyIsImFuYWx5dGljczpleHBvcnQiLCJvcmc6c2V0dGluZ3MiXSwiaWF0IjoxNzI3MjU3MjAwLCJleHAiOjE3NTg3OTMyMDB9.xyz12',
      user: {
        id: 'admin-123',
        name: 'Admin User',
        email: credentials.email,
        phone: '+1234567890',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        is_verified: true,
        organization_id: 'org-123',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      organization: {
        id: 'org-123',
        name: 'Fresh Market Store',
        slug: 'fresh-market',
        description: 'Premium grocery store chain',
        logo: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        is_active: true,
      },
      role: {
        id: 'role-admin',
        name: 'admin',
        description: 'Administrator with full access',
      },
      permissions: [
        'products:view', 'products:create', 'products:update', 'products:delete',
        'users:view', 'users:create', 'users:update', 'users:delete',
        'offers:view', 'offers:create', 'offers:update', 'offers:delete',
        'banners:view', 'banners:create', 'banners:update', 'banners:delete',
        'analytics:view', 'analytics:export', 'org:settings'
      ],
    };
  }

  async logout(): Promise<void> {
    this.clearToken();
  }

  // Dashboard endpoints
  async getDashboardStats(): Promise<DashboardStats> {
    return {
      totalProducts: 1248,
      totalUsers: 15672,
      totalOrders: 8945,
      totalRevenue: 125630.50,
      growthRate: 12.5,
      activeOffers: 8,
      activeBanners: 5,
      lowStockProducts: 23,
    };
  }

  async getCustomerEngagement(): Promise<CustomerEngagement> {
    return {
      daily: [
        { name: 'Mon', value: 240 },
        { name: 'Tue', value: 320 },
        { name: 'Wed', value: 180 },
        { name: 'Thu', value: 420 },
        { name: 'Fri', value: 380 },
        { name: 'Sat', value: 520 },
        { name: 'Sun', value: 490 },
      ],
      weekly: [
        { name: 'Week 1', value: 2100 },
        { name: 'Week 2', value: 2400 },
        { name: 'Week 3', value: 1800 },
        { name: 'Week 4', value: 2800 },
      ],
      monthly: [
        { name: 'Jan', value: 8500 },
        { name: 'Feb', value: 9200 },
        { name: 'Mar', value: 7800 },
        { name: 'Apr', value: 10400 },
        { name: 'May', value: 9800 },
        { name: 'Jun', value: 11200 },
      ],
      yearly: [
        { name: '2021', value: 85000 },
        { name: '2022', value: 102000 },
        { name: '2023', value: 118000 },
        { name: '2024', value: 125000 },
      ],
    };
  }

  async getProductAnalytics(): Promise<ProductAnalytics> {
    return {
      topSellingProducts: [
        { id: '1', name: 'Organic Bananas', category: 'Fruits', sales: 856, revenue: 4280 },
        { id: '2', name: 'Free-Range Eggs', category: 'Dairy', sales: 742, revenue: 3710 },
        { id: '3', name: 'Whole Wheat Bread', category: 'Bakery', sales: 698, revenue: 2792 },
        { id: '4', name: 'Greek Yogurt', category: 'Dairy', sales: 634, revenue: 3804 },
        { id: '5', name: 'Avocados', category: 'Fruits', sales: 589, revenue: 3534 },
      ],
      categoryPerformance: [
        { category: 'Fruits', products: 156, sales: 4820, revenue: 28920 },
        { category: 'Vegetables', products: 203, sales: 4156, revenue: 22858 },
        { category: 'Dairy', products: 89, sales: 3945, revenue: 25967 },
        { category: 'Bakery', products: 67, sales: 2834, revenue: 17004 },
        { category: 'Meat', products: 78, sales: 1956, revenue: 29340 },
      ],
      stockAnalysis: [
        { product: 'Organic Bananas', current_stock: 45, threshold: 50, status: 'critical' },
        { product: 'Whole Wheat Bread', current_stock: 78, threshold: 100, status: 'low' },
        { product: 'Greek Yogurt', current_stock: 156, threshold: 150, status: 'adequate' },
        { product: 'Avocados', current_stock: 234, threshold: 200, status: 'high' },
      ],
    };
  }

  async getCustomerAnalytics(): Promise<CustomerAnalytics> {
    return {
      topCustomers: [
        { id: '1', name: 'Sarah Johnson', email: 'sarah@email.com', total_orders: 45, total_spent: 2850.75, last_order: '2024-01-15' },
        { id: '2', name: 'Mike Chen', email: 'mike@email.com', total_orders: 38, total_spent: 2345.20, last_order: '2024-01-14' },
        { id: '3', name: 'Emily Davis', email: 'emily@email.com', total_orders: 42, total_spent: 2156.80, last_order: '2024-01-13' },
        { id: '4', name: 'John Smith', email: 'john@email.com', total_orders: 33, total_spent: 1985.45, last_order: '2024-01-12' },
        { id: '5', name: 'Lisa Brown', email: 'lisa@email.com', total_orders: 29, total_spent: 1834.90, last_order: '2024-01-11' },
      ],
      customerGrowth: [
        { name: 'Jan', value: 1200 },
        { name: 'Feb', value: 1350 },
        { name: 'Mar', value: 1180 },
        { name: 'Apr', value: 1520 },
        { name: 'May', value: 1680 },
        { name: 'Jun', value: 1890 },
      ],
      customerSegmentation: [
        { segment: 'Premium Customers', count: 1250, percentage: 8 },
        { segment: 'Regular Customers', count: 8450, percentage: 54 },
        { segment: 'Occasional Customers', count: 4670, percentage: 30 },
        { segment: 'New Customers', count: 1302, percentage: 8 },
      ],
    };
  }

  // Product endpoints
  async getProducts(page = 1, limit = 10, category?: string, search?: string): Promise<{ products: Product[]; total: number; pages: number }> {
    const products: Product[] = Array.from({ length: limit }, (_, i) => ({
      id: `prod-${page * limit + i}`,
      organization_id: 'org-123',
      name: `Product ${page * limit + i + 1}`,
      slug: `product-${page * limit + i + 1}`,
      description: `High-quality product description for item ${page * limit + i + 1}`,
      price: Math.round((Math.random() * 50 + 10) * 100) / 100,
      original_price: Math.round((Math.random() * 60 + 15) * 100) / 100,
      category_id: `cat-${Math.floor(Math.random() * 5) + 1}`,
      category: {
        id: `cat-${Math.floor(Math.random() * 5) + 1}`,
        organization_id: 'org-123',
        name: ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat'][Math.floor(Math.random() * 5)],
        slug: 'category-slug',
        product_count: 0,
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      image: `https://images.pexels.com/photos/${200 + (page * limit + i)}/pexels-photo-${200 + (page * limit + i)}.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1`,
      unit: ['kg', 'piece', 'liter', 'dozen'][Math.floor(Math.random() * 4)],
      stock_count: Math.floor(Math.random() * 200) + 10,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      review_count: Math.floor(Math.random() * 100) + 5,
      is_featured: Math.random() > 0.7,
      is_on_sale: Math.random() > 0.8,
      in_stock: Math.random() > 0.1,
      is_active: Math.random() > 0.05,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    }));

    return {
      products,
      total: 1248,
      pages: Math.ceil(1248 / limit),
    };
  }

  async getCategories(): Promise<Category[]> {
    return [
      { id: 'cat-1', organization_id: 'org-123', name: 'Fruits', slug: 'fruits', image: 'https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1', product_count: 156, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
      { id: 'cat-2', organization_id: 'org-123', name: 'Vegetables', slug: 'vegetables', image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1', product_count: 203, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
      { id: 'cat-3', organization_id: 'org-123', name: 'Dairy', slug: 'dairy', image: 'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1', product_count: 89, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
      { id: 'cat-4', organization_id: 'org-123', name: 'Bakery', slug: 'bakery', image: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1', product_count: 67, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
      { id: 'cat-5', organization_id: 'org-123', name: 'Meat', slug: 'meat', image: 'https://images.pexels.com/photos/616401/pexels-photo-616401.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1', product_count: 78, is_active: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
    ];
  }

  async createProduct(product: CreateProductRequest): Promise<Product> {
    return {
      id: `prod-${Date.now()}`,
      organization_id: 'org-123',
      ...product,
      slug: product.name.toLowerCase().replace(/\s+/g, '-'),
      rating: 0,
      review_count: 0,
      is_featured: product.is_featured || false,
      is_on_sale: product.is_on_sale || false,
      in_stock: product.stock_count > 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  async updateProduct(product: UpdateProductRequest): Promise<Product> {
    const existing = await this.getProducts(1, 1);
    return {
      ...existing.products[0],
      ...product,
      updated_at: new Date().toISOString(),
    };
  }

  async deleteProduct(id: string): Promise<void> {
    // Dummy implementation
    console.log(`Product ${id} deleted`);
  }

  // User management endpoints
  async getUsers(page = 1, limit = 10): Promise<{ users: User[]; total: number; pages: number }> {
    const users: User[] = Array.from({ length: limit }, (_, i) => ({
      id: `user-${page * limit + i}`,
      name: `User ${page * limit + i + 1}`,
      email: `user${page * limit + i + 1}@example.com`,
      phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      avatar: `https://images.pexels.com/photos/${220453 + (page * limit + i)}/pexels-photo-${220453 + (page * limit + i)}.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1`,
      is_verified: Math.random() > 0.3,
      organization_id: 'org-123',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    }));

    return {
      users,
      total: 15672,
      pages: Math.ceil(15672 / limit),
    };
  }

  async createUser(user: CreateUserRequest): Promise<User> {
    return {
      id: `user-${Date.now()}`,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1`,
      is_verified: user.is_verified || false,
      organization_id: 'org-123',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  async updateUser(user: UpdateUserRequest): Promise<User> {
    const existing = await this.getUsers(1, 1);
    return {
      ...existing.users[0],
      ...user,
      updated_at: new Date().toISOString(),
    };
  }

  async deleteUser(id: string): Promise<void> {
    console.log(`User ${id} deleted`);
  }

  // Offer endpoints
  async getOffers(): Promise<Offer[]> {
    return [
      {
        id: 'offer-1',
        organization_id: 'org-123',
        type: 'percentage',
        title: '20% Off All Fruits',
        description: 'Get 20% discount on all fresh fruits this week',
        value: 20,
        valid_until: '2024-02-01T23:59:59Z',
        usage_limit: 1000,
        used_count: 156,
        is_active: true,
        min_purchase: 25.00,
        max_discount: 50.00,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 'offer-2',
        organization_id: 'org-123',
        type: 'fixed_amount',
        title: '$10 Off Orders Over $50',
        description: 'Save $10 on orders over $50',
        value: 10,
        valid_until: '2024-01-31T23:59:59Z',
        usage_limit: 500,
        used_count: 89,
        is_active: true,
        min_purchase: 50.00,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];
  }

  async createOffer(offer: CreateOfferRequest): Promise<Offer> {
    return {
      id: `offer-${Date.now()}`,
      organization_id: 'org-123',
      ...offer,
      used_count: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  async updateOffer(offer: UpdateOfferRequest): Promise<Offer> {
    const existing = await this.getOffers();
    return {
      ...existing[0],
      ...offer,
      updated_at: new Date().toISOString(),
    };
  }

  async deleteOffer(id: string): Promise<void> {
    console.log(`Offer ${id} deleted`);
  }

  // Banner endpoints
  async getBanners(): Promise<Banner[]> {
    return [
      {
        id: 'banner-1',
        organization_id: 'org-123',
        title: 'Fresh Organic Produce',
        subtitle: 'Farm to Table',
        description: 'Get the freshest organic fruits and vegetables delivered to your door',
        image: 'https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
        image_alt: 'Fresh organic produce',
        is_active: true,
        sort_order: 1,
        link_url: '/products/fruits',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 'banner-2',
        organization_id: 'org-123',
        title: 'Weekly Specials',
        subtitle: 'Save Big This Week',
        description: 'Dont miss out on our amazing weekly deals and special offers',
        image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
        image_alt: 'Weekly specials',
        is_active: true,
        sort_order: 2,
        link_url: '/offers',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];
  }

  async createBanner(banner: CreateBannerRequest): Promise<Banner> {
    return {
      id: `banner-${Date.now()}`,
      organization_id: 'org-123',
      ...banner,
      sort_order: banner.sort_order || 999,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  async updateBanner(banner: UpdateBannerRequest): Promise<Banner> {
    const existing = await this.getBanners();
    return {
      ...existing[0],
      ...banner,
      updated_at: new Date().toISOString(),
    };
  }

  async deleteBanner(id: string): Promise<void> {
    console.log(`Banner ${id} deleted`);
  }
}

export const apiClient = new ApiClient();