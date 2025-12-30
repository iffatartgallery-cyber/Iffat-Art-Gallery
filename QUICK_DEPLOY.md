# Quick Deployment Checklist

## Pre-Deployment (Run on Your Machine)

### 1. Generate NEXTAUTH_SECRET

```bash
# On Windows PowerShell:
$secret = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((1..32|ForEach-Object{[char][int](Get-Random -Min 33 -Max 127))} -join "")))
$secret

# Or use this online tool if needed: https://generate-secret.vercel.app/32
```

### 2. Test build locally

```bash
npm run build
# Should complete successfully with no errors
```

### 3. Verify database connection

- Check that your Supabase PostgreSQL is accessible
- Confirm admin user exists in database:
  - Email: iffatsamina@gmail.com
  - Password: admin123

### 4. Push code to GitHub

```bash
git add .
git commit -m "Production deployment ready"
git push origin main
```

## Vercel Deployment (5 minutes)

### 1. Open Vercel

Go to https://vercel.com/dashboard

### 2. Import Project

- Click "Add New..." → "Project"
- Select your GitHub repository
- Click "Import"

### 3. Add Environment Variables

Click "Environment Variables" and add:

```
DATABASE_URL = [Your Supabase PostgreSQL URL]
NEXTAUTH_SECRET = [Generated secret from step 1]
NEXTAUTH_URL = https://[your-app-name].vercel.app
NEXT_PUBLIC_SUPABASE_URL = [From Supabase]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [From Supabase]
```

### 4. Deploy

Click "Deploy" button and wait for completion

### 5. Test

- Visit https://[your-app-name].vercel.app
- Login with: iffatsamina@gmail.com / admin123
- Navigate to /dashboard
- Test logout

## If Using Custom Domain

### 1. Add domain in Vercel

Settings → Domains → Add Domain

### 2. Update NEXTAUTH_URL

Edit environment variable to point to your custom domain

### 3. Redeploy

Trigger new deployment

## Troubleshooting Quick Fixes

**Login fails:**

- Check DATABASE_URL is correct
- Verify user exists in database
- Ensure NEXTAUTH_SECRET is set

**Build fails:**

- Check Vercel build logs
- Ensure all dependencies installed locally
- Run `npm install` and try again

**Database connection timeout:**

- Check IP allowlist on Supabase
- Use connection pooler in Supabase
- Verify DATABASE_URL format

## Rollback

If something goes wrong:

1. Go to Vercel deployments
2. Click on previous working deployment
3. Click "Redeploy" to restore previous version

---

**Total time to deploy: ~10 minutes**
