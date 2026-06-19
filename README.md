# ⚡ EDGE E-Commerce System

Full-stack e-commerce platform for EDGE Sportswear.

---

## 📁 Project Structure

```
edge/
├── server/          ← Node.js + Express + MongoDB API
│   ├── models/      ← Mongoose schemas (Admin, Product, Order, Wilaya)
│   ├── routes/      ← REST API routes
│   ├── middleware/  ← JWT auth middleware
│   ├── config/      ← DB seed (wilayas, admin, sample product)
│   └── index.js     ← Entry point
│
├── client/          ← Customer website (React, port 3000)
│   └── src/
│       ├── pages/   ← Home, ProductDetail, Cart, Checkout, OrderSuccess
│       ├── components/ ← Navbar, Footer, ProductCard
│       ├── context/ ← CartContext
│       └── api.js   ← Axios API calls
│
└── admin/           ← Admin dashboard (React, port 3001)
    └── src/
        ├── pages/   ← Login, Dashboard, Orders, Products, Wilayas
        ├── components/ ← Layout (sidebar)
        ├── context/ ← AuthContext (JWT)
        └── api.js   ← Admin API calls with auth token
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

---

### Step 1 — Install Dependencies

```bash
# Server
cd edge/server
npm install

# Customer Website
cd edge/client
npm install

# Admin Dashboard
cd edge/admin
npm install
```

---

### Step 2 — Configure Environment

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/edge-store
JWT_SECRET=your_strong_secret_here
ADMIN_EMAIL=admin@edge.com
ADMIN_PASSWORD=admin123
```

> ⚠️ Change the JWT_SECRET and admin password before going live!

---

### Step 3 — Start the Backend

```bash
cd edge/server
npm run dev
```

On first start, it automatically seeds:
- ✅ Admin account
- ✅ All 58 Algeria wilayas with communes
- ✅ Sample EDGE product

---

### Step 4 — Start the Customer Website

```bash
cd edge/client
npm start
# Opens at http://localhost:3000
```

---

### Step 5 — Start the Admin Dashboard

```bash
cd edge/admin
npm start
# Opens at http://localhost:3001
```

Admin login:
- Email: `admin@edge.com`
- Password: `admin123`

---

## 🔑 Admin Panel Features

| Feature | Description |
|---|---|
| **Dashboard** | Live stats (orders, revenue), recent orders, auto-refreshes every 15s |
| **Orders** | View all orders, filter by status, expand for details, update status |
| **Products** | Add/edit/delete products with colors, sizes, stock, image URLs |
| **Livraison** | Set delivery prices per wilaya (home + office), bulk update |

---

## 🌐 API Endpoints

### Public
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | All active products |
| GET | `/api/products/:id` | Single product |
| GET | `/api/wilayas` | All 58 wilayas with communes |
| POST | `/api/orders` | Place an order |

### Admin (requires Bearer token)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/products/admin` | All products (including hidden) |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/orders` | All orders (filterable) |
| GET | `/api/orders/stats` | Order statistics |
| PATCH | `/api/orders/:id/status` | Update order status |
| PUT | `/api/wilayas/:id` | Update wilaya prices |
| PUT | `/api/wilayas/bulk/update` | Bulk update all prices |

---

## 📦 Order Flow

1. Customer browses products → selects color + size → adds to cart
2. Fills checkout form (name, phone, wilaya, commune, address, delivery type)
3. Livraison price auto-calculated based on wilaya + delivery type
4. Order saved to MongoDB with status `pending`
5. Admin sees it instantly in dashboard (live polling)
6. Admin updates status: pending → confirmed → shipped → delivered

---

## 🎨 Customization

### Update Social Links (Footer)
Edit `client/src/components/Footer.js`:
```js
const CONTACT = {
  phone: '+213 XXX XXX XXX',
  whatsapp: '+213XXXXXXXXX',   // no spaces or +
  instagram: 'your.handle',
  tiktok: '@yourhandle',
};
```

### Add Product Images
In the admin Products page, add image URLs to each color variant.
Recommended: Upload images to Cloudinary or ImgBB and paste the URL.

### Deploy to Production
1. Backend: Deploy to Railway, Render, or VPS
2. Frontend: `npm run build` → deploy to Vercel/Netlify
3. Admin: `npm run build` → deploy to separate Vercel project
4. Update `REACT_APP_API_URL` in client & admin to your live server URL

---

## ⚡ Tech Stack

- **Frontend**: React 18, React Router 6, Axios, CSS Modules
- **Admin**: React 18, React Router 6, Axios
- **Backend**: Node.js, Express 4, Mongoose 8
- **Database**: MongoDB
- **Auth**: JWT (jsonwebtoken) + bcryptjs
"# commerce" 
"# commerce" 
