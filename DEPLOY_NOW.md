# 🚀 Your Deployment To-Do List

Copy and paste this checklist to track your deployment progress.

## Pre-Deployment (Do This Now)

- [ ] Generate NEXTAUTH_SECRET:

  ```bash
  openssl rand -base64 32
  ```

  **Save this value!** You'll need it in Vercel.

- [ ] Push code to GitHub:

  ```bash
  git add .
  git commit -m "Production ready"
  git push origin main
  ```

- [ ] (Optional) Test build locally:
  ```bash
  npm run build
  npm run start
  ```
  Visit http://localhost:3000 and login with:
  - Email: iffatsamina@gmail.com
  - Password: admin123

## Vercel Deployment (Follow These Steps)

### Step 1: Open Vercel Dashboard

- [ ] Go to https://vercel.com/dashboard
- [ ] Sign in with GitHub (if not already)

### Step 2: Import Your Project

- [ ] Click "Add New..." button
- [ ] Select "Project"
- [ ] Find your repository in the list
- [ ] Click "Import"

### Step 3: Configure Settings

- [ ] Keep default settings for Next.js
- [ ] Click "Environment Variables"

### Step 4: Add Environment Variables

Add each variable by clicking "Add":

| Variable                        | Value                                     |
| ------------------------------- | ----------------------------------------- |
| `DATABASE_URL`                  | Your Supabase PostgreSQL URL              |
| `NEXTAUTH_SECRET`               | The generated secret from above           |
| `NEXTAUTH_URL`                  | https://[your-app-name].vercel.app        |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase URL (if using storage)      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key (if using storage) |

⚠️ Replace `[your-app-name]` with your actual app name from Vercel.

- [ ] Click "Deploy"
- [ ] Wait for build to complete (2-3 minutes)

### Step 5: Test Your Deployment

- [ ] Visit your production URL (shown in Vercel)
- [ ] Login with admin credentials:
  - Email: iffatsamina@gmail.com
  - Password: admin123
- [ ] Navigate to /dashboard
- [ ] Test logout
- [ ] Verify session persists after refresh

## After Deployment

- [ ] Share production URL with team
- [ ] Update bookmarks/documentation with prod URL
- [ ] Set up monitoring (optional):
  - Vercel Analytics
  - Error tracking (Sentry, etc.)

## If Something Goes Wrong

### Login doesn't work

- [ ] Check DATABASE_URL is correct
- [ ] Verify NEXTAUTH_SECRET is set
- [ ] Check Vercel build logs for errors
- [ ] Rollback to previous deployment

### Database connection fails

- [ ] Test connection string with:
  ```bash
  psql "your-connection-string"
  ```
- [ ] Check Supabase dashboard is up
- [ ] Verify IP allowlist on Supabase

### Build fails

- [ ] Check "Deployments" tab in Vercel for error logs
- [ ] Run locally: `npm run build`
- [ ] Check for missing environment variables

### Can't login after deploying

- [ ] Verify admin user exists in production database:
  ```bash
  psql "your-production-connection-string"
  SELECT * FROM "User";
  ```
- [ ] If user missing, run seed in production

---

**You're ready! Start with the "Pre-Deployment" section above.**

**Questions?**

- Check [QUICK_DEPLOY.md](QUICK_DEPLOY.md) for quick reference
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guide
- Check [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for troubleshooting
