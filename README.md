# Urban Grocer - Grocery Delivery Platform

A full-stack grocery delivery platform built with Next.js and Socket.io, featuring real-time order tracking, delivery partner management, and live location updates.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Tech Stack](#tech-stack)
5. [Project Structure](#project-structure)
6. [How It Works](#how-it-works)
7. [Setup Instructions](#setup-instructions)

---

## Project Overview

Urban Grocer is a comprehensive grocery delivery platform that connects customers with local delivery partners. The platform enables users to browse groceries, place orders, and track their deliveries in real-time using live GPS tracking.

### Core Components

- **urbangrocer/** - Next.js frontend and API backend
- **SockerServer/** - Socket.io real-time communication server

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │  User App   │  │  Admin App  │  │  Delivery Partner App │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
│                              │                                 │
│                    ┌─────────▼─────────┐                        │
│                    │  API Routes     │                        │
│                    │  (Next.js)     │                        │
│                    └─────────┬─────────┘                        │
└────────────────────────────┼────────────────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
        ┌──────▼──────┐ ┌───▼────┐ ┌─────▼─────┐
        │  MongoDB    │ │Socket  │ │ Cloudinary│
        │  Database  │ │ Server │ │  Storage  │
        └────────────┘ └────────┘ └──────────┘
```

---

## Features

### User Features
- **Authentication**: Email/password and Google OAuth login
- **Product Browsing**: Browse groceries by category
- **Shopping Cart**: Add items, modify quantities
- **Checkout**: Address selection with GPS coordinates
- **Order Tracking**: Real-time delivery tracking on map
- **Chat**: In-app chat with delivery partner
- **Order History**: View past orders

### Admin Features
- **Dashboard**: View all orders and statistics
- **Product Management**: Add new grocery items
- **Order Management**: View and update order status
- **Role Management**: Assign roles to users (user/deliveryBoy/admin)

### Delivery Partner Features
- **Dashboard**: View assigned orders
- **Online/Offline Status**: Toggle availability
- **Location Updates**: Share GPS location in real-time
- **Order Acceptance**: Accept delivery assignments
- **Chat**: Communication with customers

---

## Tech Stack

### Frontend (urbangrocer)
| Technology | Purpose |
|------------|---------|
| Next.js 16 | Framework |
| React 19 | UI Library |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| Redux Toolkit | State Management |
| NextAuth v5 | Authentication |
| Mongoose | MongoDB ODM |
| Socket.io Client | Real-time Communication |
| Leaflet | Maps & Location |
| Framer Motion | Animations |
| Lucide React | Icons |
| Axios | HTTP Client |
| Cloudinary | Image Storage |

### Backend (SockerServer)
| Technology | Purpose |
|------------|---------|
| Express.js | Web Framework |
| Socket.io | Real-time Communication |
| Mongoose | MongoDB ODM |
| Axios | HTTP Client |
| dotenv | Environment Variables |

### Database
| Technology | Details |
|------------|---------|
| MongoDB | Primary Database (Atlas) |
| MongoDB Geospatial | Location-based queries |

---

## Project Structure

### urbangrocer/

```
urbangrocer/
├── app/                        # Next.js App Router
│   ├── api/                   # API Routes
│   │   ├── auth/             # Authentication endpoints
│   │   ├── chat/            # Chat endpoints
│   │   ├── delivery/        # Delivery assignment endpoints
│   │   ├── otp/            # OTP verification
│   │   ├── socket/         # Socket sync endpoints
│   │   ├── user/          # User endpoints
│   │   └── search-location/ # Location services
│   ├── user/               # User routes
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── my-orders/
│   │   ├── order-success/
│   │   └── track-order/
│   ├── admin/              # Admin routes
│   │   ├── add-grocery/
│   │   └── manage-orders/
│   ├── login/
│   ├── register/
│   ├── unauthorized/
│   ├── layout.tsx
│   └── page.tsx
├── components/              # React Components
│   ├── AdminDashboard.tsx
│   ├── AdminOrderCard.tsx
│   ├── CategorySlider.tsx
│   ├── DeliveryBoy.tsx
│   ├── DeliveryBoyDashboard.tsx
│   ├── DeliveryChat.tsx
│   ├── GeoUpdater.tsx
│   ├── GroceryItemCard.tsx
│   ├── HeroSection.tsx
│   ├── LiveMap.tsx
│   ├── Nav.tsx
│   ├── RegisterForm.tsx
│   ├── UserDashboard.tsx
│   ├── UserOrderCard.tsx
│   └── Welcome.tsx
├── models/                  # Mongoose Models
│   ├── user.model.ts       # User schema
│   ├── order.model.ts   # Order schema
│   ├── grocery.model.ts  # Grocery schema
│   ├── message.model.ts  # Chat messages
│   └── deliveryAssignment.model.ts
├── redux/                  # Redux Store
├── hooks/                 # Custom React Hooks
├── auth.ts               # NextAuth Configuration
├── proxy.ts             # Route protection middleware
└── package.json
```

### SockerServer/

```
SockerServer/
├── index.js             # Main server file
├── .env                # Environment variables
└── package.json
```

---

## How It Works

### 1. User Authentication Flow

```
User Login/Register
        │
        ▼
┌─────────────────┐
│  NextAuth v5     │
│  - Credentials  │
│  - Google OAUTH│
└─────────────────┘
        │
        ▼
┌─────────────────┐
│  JWT Token      │
│  - userId      │
│  - role        │
└─────────────────┘
        │
        ▼
┌──────────���──────┐
│  Protected      │
│  Routes (proxy) │
└─────────────────┘
```

- Users can register with email/password or sign in with Google
- NextAuth generates JWT tokens containing user ID and role
- The `proxy.ts` middleware protects routes based on roles
- Sessions last 10 days with JWT strategy

### 2. Order Placement Flow

```
User Browses Products
        │
        ▼
Add to Cart (Redux Store)
        │
        ▼
Checkout with Address
        │
        ▼
Address Geocoding (Get GPS coordinates)
        │
        ▼
Create Order (API)
        │
        ▼
Order Status: "pending"
        │
        ▼
Admin Assigns Delivery Boy
        │
        ▼
Delivery Boy Accepts
        │
        ▼
Order Status: "out of delivery"
        │
        ▼
Delivery Complete + OTP Verification
        │
        ▼
Order Status: "delivered"
```

### 3. Real-time Location Tracking

```
Delivery Boy's Device
        │
        ▼
Get Geolocation (Browser API)
        │
        ▼
Send to Socket Server
        │
        ▼
Socket Server Broadcasts
        │
        ▼
Frontend Receives & Updates Map
```

- Delivery partners use browser Geolocation API
- Location sent via Socket.io to the server
- Server broadcasts to all connected clients
- Users see real-time position on Leaflet map

### 4. Socket Communication

**Socket Events:**

| Event | Direction | Purpose |
|-------|-----------|---------|
| `identity` | Client → Server | Link socket to user |
| `updateLocation` | Client → Server | Update GPS location |
| `join-room` | Client → Server | Join chat room |
| `send-message` | Client → Server | Send chat message |
| `update-deliveryBoy-location` | Server → Client | Broadcast location |
| `send-message` | Server → Client | Receive message |

### 5. Role-Based Access Control

**User Roles:**
- `user` - Customer
- `deliveryBoy` - Delivery partner
- `admin` - Platform administrator

**Route Protection (proxy.ts):**

```typescript
// Public routes (no auth required)
// - /api/auth/*
// - /login
// - /register

// Protected routes
// - /user/* → requires role: "user"
// - /admin/* → requires role: "admin"
// - /delivery/* → requires role: "deliveryBoy"
```

### 6. Database Models

#### User Model
```typescript
{
  name: string,
  email: string,           // unique
  password?: string,       // hashed (credentials auth)
  mobile?: string,
  image?: string,
  role: "user" | "deliveryBoy" | "admin",
  location: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  socketId?: string,
  isOnline: boolean
}
```

#### Order Model
```typescript
{
  user: ObjectId,
  items: [{
    grocery: ObjectId,
    name: string,
    price: string,
    unit: string,
    image: string,
    quantity: number
  }],
  assignedDeliveryBoy?: ObjectId,
  totalAmount: number,
  paymentMethod: "cod" | "online",
  isPaid: boolean,
  address: {
    fullName, mobile, fullAddress,
    city, state, pincode,
    latitude, longitude
  },
  status: "pending" | "out of delivery" | "delivered",
  deliveryOtp?: string,
  deliveryOtpVerification: boolean
}
```

#### Grocery Model
```typescript
{
  name: string,
  category: string,
  price: number,
  image: string,
  unit: string
}
```

#### DeliveryAssignment Model
```typescript
{
  order: ObjectId,
  broadcastedTo: ObjectId[],
  assignedTo?: ObjectId,
  status: "broadcasted" | "assigned" | "completed",
  acceptedAt?: Date
}
```

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Google Cloud project (for OAuth)
- Cloudinary account

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd Grocery-Delivery-Website
```

### Step 2: Environment Setup

#### For urbangrocer/

Create `.env.local` file in `urbangrocer/` directory:

```env
# MongoDB
# Get your connection string from MongoDB Atlas
MONGODB_URL="mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/urbangrocer"

# Auth Secret (generate with: openssl rand -base64 32)
AUTH_SECRET="your-generated-secret-key"

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Cloudinary (from Cloudinary Dashboard)
CLOUD_NAME="your-cloud-name"
CLOUD_API_KEY="your-api-key"
CLOUD_API_SECRET="your-api-secret"

# Socket Server URL
NEXT_PUBLIC_SOCKET_SERVER="http://localhost:4000"

# Gemini AI (optional, for AI chat suggestions)
GEMINI_API_KEY="your-gemini-api-key"

# Email (for OTPs)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

#### For SockerServer/

Create `.env` file in `SockerServer/` directory:

```env
# Server Port
PORT=4000

# Next.js Base URL (for API calls)
NEXT_BASE_URL="http://localhost:3000"
```

### Step 3: Install Dependencies

#### Install urbangrocer dependencies:

```bash
cd urbangrocer
npm install
```

#### Install SockerServer dependencies:

```bash
cd ../SockerServer
npm install
```

### Step 4: Start the Development Servers

#### Terminal 1: Start Socket Server

```bash
cd SockerServer
npm run dev
# Server runs on http://localhost:4000
```

#### Terminal 2: Start Next.js App

```bash
cd urbangrocer
npm run dev
# App runs on http://localhost:3000
```

### Step 5: Access the Application

1. Open browser to `http://localhost:3000`
2. Register a new account
3. Admin must manually update role in MongoDB to "admin"

### Step 6: Testing the Flow

1. **As Admin:**
   - Go to `/admin/add-grocery` to add products
   - Go to `/admin/manage-orders` to view orders

2. **As User:**
   - Browse products on home page
   - Add items to cart
   - Go to checkout
   - Place order

3. **As Delivery Boy:**
   - Login with deliveryBoy role
   - Go online
   - Accept assigned orders
   - Update location

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| GET | `/api/auth/[...nextauth]` | NextAuth handlers |
| POST | `/api/user/edit-role-mobile` | Update role/mobile |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/user/order` | Create order |
| GET | `/api/user/my-orders` | Get user orders |
| GET | `/api/user/get-order/[id]` | Get single order |
| GET | `/api/auth/admin/get-orders` | Admin gets all orders |
| POST | `/api/auth/admin/update-order-status/[id]` | Update order status |

### Delivery
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/delivery/assignment/[id]/accept-assignment` | Accept order |
| GET | `/api/delivery/get-assignments` | Get assigned orders |
| GET | `/api/delivery/current-order` | Get current order |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/save` | Save message |
| GET | `/api/chat/messages` | Get messages |

### Socket Sync
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/socket/connect` | Link socket to user |
| POST | `/api/socket/update-location` | Update user location |

---

## Key Implementation Details

### 1. Geospatial Queries
The system uses MongoDB's 2dsphere index for location-based queries:

```typescript
userSchema.index({ location: "2dsphere" })
```

### 2. Socket-Client Linking
Each socket connection is linked to a user ID:

```javascript
socket.on("identity", async (id) => {
  await axios.post(`${NEXT_BASE_URL}/api/socket/connect`, {
    userId: id,
    socketId: socket.id
  })
})
```

### 3. Real-time Location Broadcasting
Delivery partner locations are broadcast to all clients:

```javascript
socket.on("updateLocation", async ({ userId, latitude, longitude }) => {
  const location = { type: "Point", coordinates: [longitude, latitude] }
  io.emit("update-deliveryBoy-location", { userId, location })
})
```

### 4. Route Protection Middleware
The proxy.ts middleware protects all routes:

```typescript
// Public routes bypass authentication
// Role-based redirects for protected routes
if (pathname.startsWith("/user") && role !== "user") {
  return NextResponse.redirect(new URL("/unauthorized", req.url))
}
```

### 5. OTP Delivery Verification
Orders use OTP for delivery confirmation:

```typescript
deliveryOtp: { type: String, default: generateOTP() },
deliveryOtpVerification: { type: Boolean, default: false }
```

---

## License

ISC License - Feel free to use and modify for your own projects.

---

## Author

Built by Shivam Mishra