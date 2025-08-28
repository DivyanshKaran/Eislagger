# 🍦 EisLager - Ice Cream Inventory & Sales Management Platform

A full-stack SaaS platform designed specifically for the ice cream industry, combining inventory tracking, order management, real-time communication, and location insights.

## 🎯 Core Objective

EisLager enables ice cream executives, manufacturers, clerks, and patrons to interact within a single ecosystem. The platform tracks supply, demand, manufacturing budgets, and retail operations while providing real-time communication and analytics.

## 👥 User Roles & Features

### 1. Executive (CEO)

**Role**: Platform founder/manager

**Features**:

- 📊 **Dashboard Analytics**: Sales charts (30 days, weekly, daily), flavor popularity
- 💰 **Budget Allocation**: Allocate manufacturing budgets to different factories
- 💬 **Chat Interface**: Pinned messages highlighted in gold (🟡)
- 📧 **Email Interface**: Approve requests, handle communications
- 🗺️ **Map Interface**: View shops and factories locations

### 2. Manufacturer (Factory Owner)

**Role**: Produces ice cream stock

**Features**:

- 📈 **Dashboard**: Stock history, production efficiency, budget usage
- 📦 **Stock Registration**: Register flavors, quantities, expiry dates
- 💬 **Chat Interface**: Direct communication with Executive and Clerks
- 📧 **Email Interface**: Send invoices and reports
- 🚚 **Delivery Pipeline**: Visual shipment tracking and status

### 3. Clerk (Shop Operator)

**Role**: Sells ice cream to Patrons

**Features**:

- 🏪 **Store Dashboard**: Today's sales, most sold flavors, expiring stock warnings
- 📦 **Stock View**: Real-time inventory with replenishment requests
- 💳 **Point of Sale (POS)**: Sell ice cream, apply discounts, generate receipts
- 💬 **Chat Interface**: Report shortages, get support
- 📧 **Email Interface**: Daily summaries, incident reports

### 4. Patron (Customer)

**Role**: Buys ice cream

**Features**:

- 🛍️ **Shop Interface**: Browse flavors with dietary filters
- 🛒 **Purchase Flow**: Add to cart, checkout, pickup/delivery options
- ⭐ **Feedback System**: Review flavors, report issues
- 📍 **Location Awareness**: Find nearest shops with stock

## 🏗️ Technical Stack

| Layer            | Technology                         |
| ---------------- | ---------------------------------- |
| Frontend         | Next.js 15, TailwindCSS, ShadCN UI |
| Backend          | Express.js (Microservices)         |
| Database         | PostgreSQL                         |
| Real-time Comm.  | Kafka (internal), WebSockets       |
| Authentication   | NextAuth                           |
| Charts           | Recharts                           |
| Maps             | React Leaflet                      |
| State Management | Zustand                            |
| Forms            | React Hook Form + Zod              |
| Deployment       | Docker, NGINX, CI/CD               |
| Caching/Queueing | Redis, Kafka                       |
| Hosting          | AWS (S3, ECS, etc.)                |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/eislagger.git
   cd eislagger
   ```

2. **Install dependencies**

   ```bash
   npm install --legacy-peer-deps
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/eislagger"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# External APIs
MAPBOX_TOKEN="your-mapbox-token"
```

## 📊 Sample Use Case Flow

1. **Executive** allocates ₹20,000 budget to Factory A
2. **Factory A** uses budget to register 100L "Dark Choco Fudge"
3. Stock gets added to delivery pipeline → sent to Store B
4. **Clerk** at Store B starts selling to Patrons
5. **Patrons** leave 5-star reviews, sales spike
6. **Executive** sees chart jump → allocates more budget to Factory A
7. Shipping delay → **Clerk** sends email → **Executive** resolves

## 🎨 UI Components

The platform uses a comprehensive set of UI components built with ShadCN UI:

- **Cards**: Dashboard widgets, content containers
- **Tabs**: Role-specific feature navigation
- **Badges**: Status indicators, role badges
- **Buttons**: Actions, navigation
- **Forms**: Stock registration, feedback submission
- **Charts**: Sales analytics, performance metrics
- **Maps**: Location visualization

## 🔧 Development

### Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main dashboard
│   └── globals.css     # Global styles
├── components/         # Reusable components
│   ├── ui/            # ShadCN UI components
│   └── layout/        # Layout components
└── lib/               # Utilities and helpers
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🚧 Roadmap

### Phase 1: Core Platform ✅

- [x] Role-based dashboards
- [x] Basic UI components
- [x] Mock data integration

### Phase 2: Backend Integration 🚧

- [ ] Express.js API setup
- [ ] PostgreSQL database schema
- [ ] Authentication system
- [ ] Real-time chat implementation

### Phase 3: Advanced Features 📋

- [ ] Interactive charts with Recharts
- [ ] Map integration with Leaflet
- [ ] Real-time notifications
- [ ] Mobile responsiveness

### Phase 4: Production Ready 🎯

- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] AWS deployment
- [ ] Performance optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@eislagger.com or join our Slack channel.

---

**Built with ❤️ for the ice cream industry**
