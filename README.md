# FreshMarket Admin Dashboard

A comprehensive, production-ready admin dashboard for grocery store management built with Next.js, TypeScript, and modern web technologies.

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with role-based access control
- Admin and Employee roles with granular permissions
- Token-based session management
- Secure login/logout functionality

### 📊 Analytics Dashboard
- Real-time dashboard with key metrics
- Customer engagement analytics (Daily, Weekly, Monthly, Yearly)
- Product performance analysis
- Category-wise sales tracking
- Top customers analysis
- Stock level monitoring with alerts
- Interactive charts using Recharts

### 🛍️ Product Management
- Complete CRUD operations for products
- Category-based filtering
- Search functionality
- Stock management with low-stock alerts
- Image management
- Pricing and discount management
- Featured product handling

### 👥 User Management (Admin Only)
- User list with detailed profiles
- User verification status
- Account activation/deactivation
- Role assignment
- User activity tracking

### 🎯 Offers & Promotions
- Create and manage discount offers
- Multiple offer types (Percentage, Fixed amount, BOGO, etc.)
- Usage tracking and limits
- Expiration management
- Category and product-specific offers

### 🖼️ Banner Management
- Dynamic banner creation and management
- Image upload and optimization
- Priority ordering
- Active/inactive status control
- Link management for CTAs

### 🎨 Modern UI/UX
- Responsive design for all devices
- Dark/Light theme support (via shadcn/ui)
- Smooth animations and transitions
- Intuitive navigation with collapsible sidebar
- Professional design following Apple-level aesthetics

## 🛠️ Technology Stack

- **Frontend**: Next.js 13+ with App Router
- **Language**: TypeScript
- **UI Library**: shadcn/ui + Tailwind CSS
- **Charts**: Recharts
- **Authentication**: JWT with custom hooks
- **State Management**: React Hooks + Context API
- **Icons**: Lucide React
- **Build Tool**: Next.js built-in bundler
- **Deployment**: Docker + Docker Compose ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker (optional)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd freshmarket_admin_v0.0.3

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` and login with:
- **Email**: `admin@freshmarket.com`
- **Password**: `admin123`

### Using Make Commands

```bash
# Show all available commands
make help

# Development
make dev              # Start development server
make build           # Build for production
make start           # Start production server

# Docker
make docker-build    # Build Docker image
make docker-run      # Run container
make docker-stop     # Stop container

# Code Quality
make lint            # Run linter
make format          # Format code
make audit           # Security audit

# Utilities
make clean           # Clean build artifacts
make info            # Show project information
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# JWT Secret (change in production)
JWT_SECRET=your-super-secret-jwt-key

# Database (for future backend integration)
DATABASE_URL=mysql://grocery:grocery123@localhost:3306/grocery_store

# Optional: Redis for caching
REDIS_URL=redis://localhost:6379
```

## 📱 Responsive Design

The dashboard is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🔐 Role-Based Access Control

### Admin Permissions
- Full access to all features
- User management
- System settings
- All CRUD operations

### Employee Permissions  
- Limited product management
- View-only analytics
- Basic order management
- No user management access

## 🎯 API Integration

The application includes a complete API client (`lib/api-client.ts`) with dummy responses. Replace with your actual backend endpoints:

```typescript
// Example: Update base URL
const apiClient = new ApiClient('https://your-api-url.com/api');
```

### Available Endpoints

```typescript
// Authentication
POST /api/auth/login
POST /api/auth/logout

// Dashboard
GET /api/dashboard/stats
GET /api/analytics/customer-engagement
GET /api/analytics/products
GET /api/analytics/customers

// Products
GET /api/products
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id

// Users (Admin only)
GET /api/users
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id

// Offers
GET /api/offers
POST /api/offers
PUT /api/offers/:id
DELETE /api/offers/:id

// Banners
GET /api/banners
POST /api/banners
PUT /api/banners/:id
DELETE /api/banners/:id
```

## 🐳 Docker Deployment

### Build and Run

```bash
# Using Make
make docker-build
make docker-run

# Using Docker directly
docker build -t freshmarket-admin .
docker run -p 3000:3000 freshmarket-admin
```

### Docker Compose

```bash
# Start all services
docker-compose up -d

# Stop all services  
docker-compose down
```

Services included:
- Admin Dashboard (Port 3000)
- API Gateway/Nginx (Port 3001)  
- MariaDB (Port 3306)
- Redis (Port 6379)

## 📊 Database Schema

The application is designed to work with your existing MariaDB grocery store database schema including:

- `organizations` - Multi-tenant support
- `users` - User management with roles
- `products` - Product catalog
- `categories` - Product categorization
- `offers` - Promotional offers
- `banners` - Marketing banners
- `cart_items` - Shopping cart
- `product_reviews` - Customer reviews
- And more...

## 🔒 Security Features

- JWT token-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- XSS protection
- CSRF protection
- Secure HTTP headers
- SQL injection prevention (when backend is implemented)

## 📈 Performance Optimizations

- Next.js automatic code splitting
- Image optimization with Next.js Image component
- Lazy loading for routes and components
- Memoized components to prevent unnecessary re-renders
- Efficient state management
- Optimized bundle size

## 🧪 Testing (Future Implementation)

```bash
# Unit tests
npm run test

# E2E tests  
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Authentication routes
│   ├── (dashboard)/             # Dashboard routes
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                  # Reusable components
│   ├── charts/                  # Chart components
│   ├── layout/                  # Layout components
│   └── ui/                      # shadcn/ui components
├── hooks/                       # Custom React hooks
├── lib/                         # Utilities and configurations
├── types/                       # TypeScript type definitions
├── docker/                      # Docker configuration
├── Dockerfile                   # Docker build file
├── docker-compose.yml          # Multi-container setup
├── Makefile                    # Development commands
└── README.md                   # Documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the Make commands (`make help`)
- Open an issue on the repository

## 🚧 Roadmap

- [ ] Backend API implementation
- [ ] Real-time notifications
- [ ] Advanced analytics with more charts
- [ ] Export functionality (PDF, Excel)
- [ ] Multi-language support
- [ ] Mobile app version
- [ ] Advanced search and filtering
- [ ] Automated testing suite
- [ ] CI/CD pipeline setup

---

**Built with ❤️ for modern grocery store management**