# Deployment Guide to Vercel

This guide walks through deploying the Art Website application to Vercel.

## Prerequisites

1. **GitHub Repository**: Your code must be pushed to GitHub
2. **Vercel Account**: Create a free account at https://vercel.com
3. **Environment Variables**: Prepare all required secrets

## Step 1: Prepare Environment Variables

Before deploying, generate a secure NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

You'll need these environment variables for Vercel:

### Required Variables

- `DATABASE_URL`: Your Supabase PostgreSQL connection string
- `NEXTAUTH_SECRET`: Generated secret (use `openssl rand -base64 32`)
- `NEXTAUTH_URL`: Your production domain (e.g., https://yourdomain.vercel.app)

### Supabase Storage (if using artwork uploads)

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon public key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (keep secret)

## Step 2: Push Code to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Step 3: Connect Repository to Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select the repository
5. Click "Import"

## Step 4: Configure Environment Variables

In Vercel project settings:

1. Go to Settings → Environment Variables
2. Add each variable:
   - `DATABASE_URL`: Paste your Supabase PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Paste the generated secret
   - `NEXTAUTH_URL`: Set to your Vercel domain (e.g., `https://your-app.vercel.app`)
   - Add any other required variables

**Important**: Only select "Production" for sensitive variables like `NEXTAUTH_SECRET` if you want them to only appear in production builds.

## Step 5: Deploy

1. Click "Deploy" to start the deployment
2. Vercel will build and deploy your app
3. You'll see a URL like `https://your-app.vercel.app`

## Step 6: Test the Deployment

1. Visit your Vercel URL
2. Test the login flow with credentials:
   - Email: `iffatsamina@gmail.com`
   - Password: `admin123`
3. Verify dashboard access works
4. Test any dynamic features (artwork uploads, etc.)

## Step 7: Update NEXTAUTH_URL (if using custom domain)

If you're using a custom domain:

1. Configure your domain in Vercel (Settings → Domains)
2. Update the `NEXTAUTH_URL` environment variable to match your custom domain
3. Trigger a redeployment

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check Supabase allows connections from Vercel IP ranges
- Consider using Supabase connection pooler for better performance

### Session/Authentication Issues

- Ensure `NEXTAUTH_SECRET` is set and consistent between deployments
- Verify `NEXTAUTH_URL` matches your actual domain
- Check that the user exists in your production database

### Build Failures

- Check the Vercel build logs for errors
- Ensure all dependencies are listed in `package.json`
- Verify environment variables are set correctly

## Post-Deployment

1. Set up analytics monitoring
2. Configure automated deployments (e.g., on push to main)
3. Set up error tracking with Sentry or similar
4. Monitor database performance and costs
5. Regular backups of your Supabase database

## Security Checklist

- [ ] `NEXTAUTH_SECRET` is a strong random value (NOT placeholder)
- [ ] Database credentials are never committed to git
- [ ] `.env.local` is in `.gitignore`
- [ ] All sensitive API keys are environment variables
- [ ] CORS is properly configured if needed
- [ ] Database has proper backup retention
- [ ] Supabase Storage has appropriate access policies
