# Vercel Deployment Guide for Snippets

## Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- Supabase project already set up

## Step-by-Step Deployment

### 1. Prepare Your Repository

#### Push to GitHub
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/snippets.git
git branch -M main
git push -u origin main
```

### 2. Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your **snippets** repository
5. Click **"Import"**

### 3. Configure Build Settings

Vercel should auto-detect Next.js. Verify these settings:

- **Framework Preset**: Next.js
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 4. Add Environment Variables

Click **"Environment Variables"** and add the following:

#### Required Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project.supabase.co:5432/postgres
```

**Where to find these:**
1. **Supabase URL & Anon Key**:
   - Go to Supabase Dashboard → Your Project
   - Settings → API
   - Copy "Project URL" and "anon/public" key

2. **DATABASE_URL**:
   - Supabase Dashboard → Settings → Database
   - Connection String → Direct connection
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your database password

**Important**: Make sure to add these for **all environments** (Production, Preview, Development)

### 5. Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 2-3 minutes)
3. Once deployed, you'll get a URL like: `https://snippets-xyz.vercel.app`

### 6. Configure Supabase Authentication

After deployment, update Supabase to allow authentication from your Vercel domain:

1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **Authentication** → **URL Configuration**
3. Add your Vercel URLs:

   **Site URL**: 
   ```
   https://your-app.vercel.app
   ```

   **Redirect URLs** (add all of these):
   ```
   https://your-app.vercel.app/auth/callback
   https://your-app.vercel.app/**
   http://localhost:3000/auth/callback
   http://localhost:3000/**
   ```

4. Click **"Save"**

### 7. Test Your Deployment

1. Visit your Vercel URL
2. Try signing in with magic link
3. Check your email for the authentication link
4. Verify you can:
   - Create technologies
   - Create entries
   - Edit and delete content

## Common Issues & Solutions

### Issue: "Authentication Error" or "Invalid Redirect URL"
**Solution**: Make sure you added your Vercel domain to Supabase redirect URLs (Step 6)

### Issue: "Database Connection Failed"
**Solution**: 
- Verify `DATABASE_URL` is correct in Vercel environment variables
- Make sure you replaced `[YOUR-PASSWORD]` with actual password
- Check that RLS policies are set up correctly in Supabase

### Issue: "Build Failed"
**Solution**:
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript has no errors locally: `npm run build`

### Issue: "Environment Variables Not Working"
**Solution**:
- Redeploy after adding environment variables
- Make sure variables are added to all environments
- Check for typos in variable names

## Automatic Deployments

Once set up, Vercel will automatically deploy:
- **Production**: Every push to `main` branch
- **Preview**: Every pull request

## Custom Domain (Optional)

### Add Your Own Domain

1. Go to Vercel Dashboard → Your Project
2. Click **"Settings"** → **"Domains"**
3. Add your domain (e.g., `snippets.yourdomain.com`)
4. Follow Vercel's DNS configuration instructions
5. Update Supabase redirect URLs to include your custom domain

## Performance Optimization

Vercel automatically provides:
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Edge caching
- ✅ Image optimization
- ✅ Automatic compression

## Monitoring

### View Logs
- Vercel Dashboard → Your Project → **"Logs"**
- Real-time function logs and errors

### Analytics
- Vercel Dashboard → Your Project → **"Analytics"**
- Page views, performance metrics, and more

## Updating Your Deployment

To deploy updates:
```bash
git add .
git commit -m "Your update message"
git push origin main
```

Vercel will automatically rebuild and deploy!

## Environment-Specific Deployments

### Production
- Branch: `main`
- URL: `https://your-app.vercel.app`

### Preview (Staging)
- Create a new branch: `git checkout -b staging`
- Push: `git push origin staging`
- Vercel creates a preview URL automatically

## Rollback

If something goes wrong:
1. Go to Vercel Dashboard → Your Project → **"Deployments"**
2. Find a previous working deployment
3. Click **"⋯"** → **"Promote to Production"**

## Security Checklist

Before going live:
- ✅ All environment variables are set
- ✅ Supabase RLS policies are enabled
- ✅ Redirect URLs are configured
- ✅ Database password is strong
- ✅ No sensitive data in code
- ✅ `.env.local` is in `.gitignore`

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

**You're all set! 🚀 Your Snippets app is now live on Vercel.**
