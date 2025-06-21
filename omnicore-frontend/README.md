# OmniCore Frontend

A modern, responsive frontend for the OmniCore Restaurant Management SaaS Platform built with Next.js, TypeScript, and Tailwind CSS.

## Technology Stack

- **Next.js 14+** - React framework with server-side rendering, API routes, and more
- **TypeScript** - Type safety for better development experience and fewer bugs
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Shadcn UI** - Beautifully designed components that you can copy and paste into your apps
- **React Query** - Data fetching, caching, and state management library
- **Zustand** - Lightweight state management solution
- **JWT Authentication** - Secure authentication flow with refresh tokens
- **Axios** - HTTP client for API communication
- **Web Audio API** - For sound effects in the POS module

## Features

### Authentication and User Management

- **Multi-tenant Login** - Login to multiple restaurant workspaces
- **Role-based Access Control** - Different permissions for owners, managers, and staff
- **Profile Management** - Update user profile and preferences
- **Password Reset** - Secure password reset flow

### Dashboard

- **Sales Overview** - Real-time sales data and trends
- **Revenue Analytics** - Visual charts for daily, weekly, monthly revenue
- **Popular Items** - Track and display best-selling menu items
- **Recent Orders** - Quick access to latest orders
- **Sales by Counter** - Performance metrics for each selling point

### Menu Management

- **Category Organization** - Group menu items by categories
- **Item Editor** - Create and edit menu items with descriptions and images
- **Pricing Controls** - Set and update item prices
- **Availability Toggle** - Quickly mark items as available/unavailable
- **Image Management** - Upload and crop item images with preview
- **Menu Search** - Quickly find menu items across all categories

### Point of Sale (POS)

- **Counter Selection** - Choose which counter/selling point to operate
- **Session Management** - Open and close sales sessions
- **Product Grid** - Visual display of available menu items
- **Cart Management** - Add, remove, adjust quantities with real-time calculation
- **Payment Processing** - Handle multiple payment methods
- **Order Status Tracking** - Follow orders through preparation and delivery
- **Receipt Generation** - Generate and print or email receipts
- **Cash Management** - Record cash in/out movements with reason tracking
- **Session Summary** - End-of-day reporting for sales sessions
- **Keyboard Shortcuts**:
  - F2: Quick checkout
  - F3: Clear cart
- **Sound Effects**: Audio feedback for adding products and checkout
- **Product Search**: Filter products by name or category
- **Auto-closing Notifications**: Progress bar shows time until dismissal

### Settings

- **Counter Management** - Create and manage selling points
- **VAT Tax Configuration** - Define and manage tax rates and rules
- **User Invitations** - Invite staff to join the platform
- **Workspace Settings** - Configure restaurant-specific settings
- **Theme Customization** - Light/dark mode and accent colors

### Responsive Design

- **Mobile-optimized** - Fully responsive for tablets and mobile phones
- **Touch-friendly** - Large touch targets for POS operations on tablets
- **Offline Support** - Basic functionality works without internet connection
- **PWA Ready** - Can be installed as a Progressive Web App

## Project Structure

```
omnicore-frontend/
├── public/
│   ├── avatars/        # User avatar images
│   ├── images/         # Static images and icons
│   └── ...
├── src/
│   ├── app/            # Next.js app directory
│   │   ├── api/        # API routes
│   │   ├── auth/       # Authentication pages
│   │   ├── dashboard/  # Dashboard pages
│   │   ├── menu/       # Menu management pages
│   │   ├── pos/        # Point of sale pages
│   │   ├── settings/   # Settings pages
│   │   └── ...
│   ├── components/     # Reusable React components
│   │   ├── ui/         # Base UI components
│   │   ├── layout/     # Layout components
│   │   ├── forms/      # Form components
│   │   ├── tables/     # Table components
│   │   ├── charts/     # Chart and data visualization
│   │   └── ...
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions and configs
│   │   ├── api/        # API client configuration
│   │   ├── auth/       # Authentication utilities
│   │   └── ...
│   └── ...
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see omnicore-backend directory)

### Installation

1. Clone the repository (if not already done)
   ```bash
   git clone https://github.com/yourusername/omnicore-web.git
   cd omnicore-web/omnicore-frontend
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   ```
   # Create a .env.local file with:
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_TENANT_HEADER=X-Tenant-Workspace
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

## API Integration

The frontend connects to the Django backend API using Axios and React Query:

- **Base URL** - All API calls are prefixed with the base URL from environment variables
- **Authentication** - JWT tokens are included in the Authorization header
- **Tenant Context** - X-Tenant-Workspace header is included in all tenant-specific requests
- **Error Handling** - Global error handling with notification system
- **Caching** - API responses are cached with React Query for performance

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with default Next.js settings

### Traditional Hosting

1. Build the application
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Start the production server
   ```bash
   npm start
   # or
   yarn start
   ```

## License

[MIT License](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
