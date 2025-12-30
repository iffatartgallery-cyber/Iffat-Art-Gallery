# Art Website - Full Stack Application

A modern full-stack art website built with Next.js 15, Supabase PostgreSQL, and NextAuth authentication.

## ✅ Deployment Status: PRODUCTION READY

The application is fully built and tested. See [QUICK_DEPLOY.md](QUICK_DEPLOY.md) for fastest deployment (5 minutes).

## Tech Stack

- **Frontend**: Next.js 15.3.6 with Turbopack
- **Backend**: Next.js API routes
- **Database**: Supabase PostgreSQL with Prisma 7
- **Authentication**: NextAuth 5.x with JWT
- **Storage**: Supabase Storage for artwork uploads
- **Styling**: Tailwind CSS + Radix UI

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL or Supabase account

### Setup

```bash
# 1. Install
npm install

# 2. Environment
cp .env.example .env.local
# Edit .env.local with your database URL and NextAuth secret

# 3. Database
npx prisma migrate dev

# 4. Run
npm run dev
# Visit http://localhost:3001
```

### Default Credentials

- **Email**: iffatsamina@gmail.com
- **Password**: admin123

## Key Features

✅ JWT Authentication with NextAuth
✅ Protected admin dashboard (/dashboard)
✅ PostgreSQL database with Prisma ORM
✅ Type-safe API routes
✅ Automatic session management
✅ Production-optimized build
✅ Ready for Vercel deployment

## Database Schema

**User** - Stores user accounts with argon2-hashed passwords
**Artwork** - Artwork listings with metadata
**Order** & **OrderItem** - Customer orders and order details

## Environment Variables

```
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3001"
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
```

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Code quality check
```

## Deployment

**Step 1:** Push to GitHub

```bash
git push origin main
```

**Step 2:** Import into Vercel

- Go to vercel.com
- Click "Import Project"
- Select your GitHub repository

**Step 3:** Set Environment Variables

- DATABASE_URL (Supabase)
- NEXTAUTH_SECRET (generate: `openssl rand -base64 32`)
- NEXTAUTH_URL (your Vercel domain)

**Step 4:** Deploy
Click "Deploy" and wait for completion.

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guide. 5. Artist verifies payment in the dashboard and marks the order as "Paid" or "Shipped". 6. Artworks with inventory = 1 are automatically marked as "Sold" upon shipment.

## Future Phases

- Integrated Stripe/PayPal for international payments.
- Automated email notifications.
- Print-on-demand integration.
