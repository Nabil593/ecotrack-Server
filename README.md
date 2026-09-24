# 🌱 EcoTrack AI — Server

### AI-Powered Sustainability, Carbon Tracking & Green Funding Backend

EcoTrack AI Server is a **TypeScript-based REST API** built with **Node.js, Express.js, MongoDB, Gemini AI, Better Auth, and Stripe**.

It powers the EcoTrack AI sustainability platform by providing APIs for sustainability records, AI-powered analysis, authentication, subscriptions, green project funding, and transaction management.

---

## 🌍 Overview

The backend provides the core services required by the EcoTrack AI platform:

* 🌱 Sustainability & environmental record management
* 🤖 AI-powered sustainability analysis
* 📊 Data management for analytics
* 🔐 Authentication and protected access
* 💳 Stripe subscriptions and payments
* 🌳 Green project funding
* 🗄️ MongoDB database management
* 🔄 Stripe webhook processing
* 🔎 Search, filtering and pagination
* 🛡️ Server-side validation and access control

### Backend Flow

```text
                    ┌──────────────────┐
                    │   Next.js Client │
                    └────────┬─────────┘
                             │
                             │ HTTPS / REST
                             ▼
                    ┌──────────────────┐
                    │ Express Backend  │
                    │   Node.js + TS   │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
       ┌────────────┐ ┌────────────┐ ┌────────────┐
       │  MongoDB   │ │ Gemini AI  │ │   Stripe   │
       │   Atlas    │ │    API     │ │            │
       └────────────┘ └────────────┘ └────────────┘
```

---

# ✨ Core Features

## 🌱 Sustainability Records

The server provides APIs for creating and managing sustainability-related records.

Supported categories include:

* Energy
* Waste
* Transport
* Supply Chain

Each record can contain:

* Title
* Short description
* Full description
* Category
* Impact score
* Cost
* Location
* Image URL
* User ID
* AI analysis report
* Status
* Creation timestamp

---

## 🔎 Search, Filtering & Pagination

The Items API supports:

* Search
* Category filtering
* Impact filtering
* Sorting
* Server-side pagination
* Single item retrieval

Example:

```http
GET /api/items?sort=impact&page=1&limit=8
```

---

# 🤖 Gemini AI Integration

EcoTrack AI uses **Google Gemini API** to analyze sustainability data and generate actionable recommendations.

The AI service can generate:

* Sustainability recommendations
* Carbon reduction strategies
* Optimization suggestions
* Personalized insights
* Multi-step action plans
* Practical improvement strategies

### AI Workflow

```text
User Data
    │
    ▼
Next.js Client
    │
    ▼
Express API
    │
    ▼
Gemini AI
    │
    ▼
AI Analysis
    │
    ├── Summary
    ├── Recommendations
    └── Action Plan
```

---

# 🔐 Authentication

Authentication is implemented using **Better Auth**.

Supported authentication methods:

* Email/password registration
* Email/password login
* Google OAuth
* Secure sessions
* Cookie-based authentication

Protected application functionality uses authenticated user access.

> The current implementation does not include an admin role or admin dashboard.

---

# 💳 Stripe Integration

Stripe is used for:

* Subscription management
* Checkout
* Green project funding
* Payment processing
* Webhook handling
* Transaction tracking

### Payment Flow

```text
User
 │
 ▼
Select Plan / Project
 │
 ▼
Stripe Checkout
 │
 ▼
Stripe Payment
 │
 ▼
Stripe Webhook
 │
 ▼
Express Backend
 │
 ▼
MongoDB Transaction
```

---

# 🏗️ Backend Architecture

```text
ecotrack-server/
│
├── src/
│   ├── config/
│   │   ├── db.ts
│   │   └── stripe.ts
│   │
│   ├── middleware/
│   │   ├── rbac.middleware.ts
│   │   ├── subCheck.middleware.ts
│   │   └── softBlock.middleware.ts
│   │
│   ├── modules/
│   │   ├── ai/
│   │   ├── item/
│   │   ├── payment/
│   │   └── user/
│   │
│   ├── models/
│   │   ├── User.ts
│   │   ├── Item.ts
│   │   └── Transaction.ts
│   │
│   ├── routes/
│   │   └── index.ts
│   │
│   ├── types/
│   │   └── express.d.ts
│   │
│   ├── utils/
│   │   └── appError.ts
│   │
│   └── app.ts
│
├── api/
│   └── index.ts
│
├── server.ts
├── package.json
└── tsconfig.json
```

---

# 📁 Project Structure

### `src/config`

Contains application configuration such as:

* MongoDB connection
* Stripe configuration

### `src/middleware`

Contains middleware responsible for:

* Access control
* Subscription checks
* Soft blocking

### `src/modules`

Business logic is organized by feature:

```text
modules/
├── ai/
├── item/
├── payment/
└── user/
```

### `src/models`

MongoDB/Mongoose models:

```text
User.ts
Item.ts
Transaction.ts
```

### `src/routes`

Central API route configuration.

### `src/utils`

Reusable backend utilities such as application error handling.

---

# 🔌 API Documentation

## Items API

### Get Items

```http
GET /api/items
```

Returns sustainability items with support for search, filtering, sorting and pagination.

### Get Single Item

```http
GET /api/items/:id
```

### Create Item

```http
POST /api/items
```

### Update Item

```http
PATCH /api/items/:id
```

### Delete Item

```http
DELETE /api/items/:id
```

### Query Example

```http
GET /api/items?sort=impact&page=1&limit=8
```

---

# 🤖 AI API

## Analyze Sustainability Data

```http
POST /api/ai/analyze
```

### Request

```json
{
  "data": {
    "category": "Energy",
    "impactScore": 82,
    "cost": 1200,
    "location": "Dhaka"
  }
}
```

### Response

```json
{
  "success": true,
  "analysis": {
    "summary": "Sustainability analysis...",
    "recommendations": [
      "Recommendation 1",
      "Recommendation 2"
    ],
    "actionPlan": [
      "Step 1",
      "Step 2",
      "Step 3"
    ]
  }
}
```

---

# 🗄️ Database Models

## User

```text
User
├── name
├── email
├── password
├── status
├── subscriptionPlan
├── stripeCustomerId
└── createdAt
```

## Item

```text
Item
├── title
├── shortDescription
├── fullDescription
├── category
├── impactScore
├── cost
├── location
├── imageUrl
├── userId
├── aiAnalysisReport
├── status
└── createdAt
```

## Transaction

```text
Transaction
├── userId
├── stripeSessionId
├── amount
├── planOrItem
├── status
└── createdAt
```

---

# 🧰 Tech Stack

| Technology            | Purpose                  |
| --------------------- | ------------------------ |
| **Node.js**           | JavaScript runtime       |
| **Express.js**        | REST API framework       |
| **TypeScript**        | Type-safe development    |
| **Mongoose**          | MongoDB ODM              |
| **MongoDB Atlas**     | Database hosting         |
| **Better Auth**       | Authentication           |
| **Google Gemini API** | AI analysis              |
| **Stripe**            | Payments & subscriptions |
| **Vercel**            | Backend deployment       |

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

* Node.js 20+
* npm
* Git
* MongoDB Atlas account
* Google Gemini API key
* Stripe account
* Required authentication credentials

---

## 1. Clone Repository

```bash
git clone <your-backend-repository-url>
```

```bash
cd ecotrack-server
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

GEMINI_API_KEY=your_gemini_api_key

STRIPE_SECRET_KEY=your_stripe_secret_key

CLIENT_URL=http://localhost:3000
```

### Environment Variables

| Variable            | Description                     |
| ------------------- | ------------------------------- |
| `PORT`              | Backend server port             |
| `MONGODB_URI`       | MongoDB Atlas connection string |
| `GEMINI_API_KEY`    | Google Gemini API key           |
| `STRIPE_SECRET_KEY` | Stripe secret key               |
| `CLIENT_URL`        | Frontend application URL        |

> ⚠️ Never commit your `.env` file to GitHub.

---

# 💻 Development

Start the development server:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

---

# 🏭 Production

Build the project:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

---

# 🌐 Live API

Production API:

```text
https://ecotrack-server-one.vercel.app/
```

Frontend application:

```text
https://ecotrack-olive-zeta.vercel.app/
```

---

# 🛡️ Security

The backend follows several security-focused practices:

* Environment variables for sensitive credentials
* Secure authentication sessions
* Protected application routes
* Server-side validation
* Subscription-aware access control
* Stripe webhook handling
* CORS configuration
* Database connection management
* No secret keys committed to source control

### Security Checklist

```text
[✓] Environment variables
[✓] Secure authentication
[✓] Protected routes
[✓] CORS configuration
[✓] Stripe webhook integration
[✓] Server-side validation
[✓] Database security

[!] Never expose API secrets
[!] Never commit .env files
[!] Rotate compromised credentials immediately
```

---

# 🔄 Production Architecture

```text
                         INTERNET
                            │
               ┌────────────┴────────────┐
               │                         │
               ▼                         ▼
      ┌──────────────────┐      ┌──────────────────┐
      │ Vercel Frontend  │      │ Vercel Backend   │
      │                  │      │                  │
      │ Next.js          │─────▶│ Express API      │
      │ React            │      │ TypeScript       │
      └──────────────────┘      └────────┬─────────┘
                                         │
                         ┌───────────────┼───────────────┐
                         │               │               │
                         ▼               ▼               ▼
                  ┌────────────┐  ┌────────────┐  ┌────────────┐
                  │  MongoDB   │  │ Gemini AI  │  │   Stripe   │
                  │   Atlas    │  │            │  │            │
                  └────────────┘  └────────────┘  └────────────┘
```

---

# 🗺️ Future Improvements

Planned backend improvements include:

### Phase 1 — Core Platform

* [x] Authentication
* [x] Google OAuth
* [x] Sustainability records
* [x] Search and filtering
* [x] Pagination
* [x] AI Sustainability Advisor
* [x] Stripe integration
* [x] Green project funding
* [x] Production deployment

### Phase 2 — Intelligence

* [ ] Advanced sustainability forecasting
* [ ] Improved AI recommendation engine
* [ ] Historical sustainability comparison
* [ ] Advanced impact analytics
* [ ] Automated sustainability insights

### Phase 3 — Enterprise

* [ ] Advanced ESG reporting
* [ ] Organization-level workspaces
* [ ] Team collaboration
* [ ] Custom sustainability metrics
* [ ] Enterprise reporting
* [ ] Third-party sustainability integrations

---

# ⚠️ Current Limitations

The current implementation does not include:

```text
✕ Admin role
✕ Admin dashboard
✕ Utility bill image/PDF upload
✕ Automatic utility bill document parsing
```

The current AI functionality focuses on sustainability analysis and recommendations based on data available inside the application.

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

### 1. Fork the repository

```bash
git clone <your-repository-url>
```

### 2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

### 3. Make your changes

```bash
git add .
git commit -m "feat: add your-feature"
```

### 4. Push your branch

```bash
git push origin feature/your-feature
```

### 5. Open a Pull Request

Please include:

* Clear description of the change
* Reason for the change
* Testing details
* Screenshots when applicable

---

# 👨‍💻 Author

**Shariea Reza Nabil**

Full-Stack Developer focused on building modern web applications with scalable architecture, AI integrations, and real-world product solutions.

### Technology Focus

```text
Next.js
React
TypeScript
Node.js
Express.js
MongoDB
Google Gemini AI
Stripe
Tailwind CSS
```

---

# 🌱 EcoTrack AI

> **Building technology for a more sustainable future.**

**Measure your impact.
Understand your data.
Make smarter sustainability decisions.**
