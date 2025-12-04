# Deployment Guide: HEcUPPS to Vercel + Railway

This guide walks you through deploying the HEcUPPS application to production using:
- **Railway** - MySQL database hosting
- **Vercel** - Next.js application hosting and Blob storage

---

## Prerequisites

- [x] GitHub account (to push your code)
- [x] [Vercel account](https://vercel.com/signup)
- [x] [Railway account](https://railway.app/)
- [x] Your code pushed to a GitHub repository

---

## Part 1: Set Up Railway (Database)

### Step 1: Create a New Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy MySQL"**
4. Railway will automatically provision a MySQL database

### Step 2: Get Database Connection URL

1. Click on your MySQL service
2. Go to **"Variables"** tab
3. Copy the `DATABASE_URL` value
   - It should look like: `mysql://root:password@containers-us-west-xxx.railway.app:6789/railway`

### Step 3: Make Database Publicly Accessible (Optional but Recommended for Setup)

1. In your MySQL service, go to **"Settings"**
2. Scroll to **"Networking"**
3. Click **"Generate Domain"** if you want a public endpoint
4. Note: Railway databases are secure by default, this just allows connection from Vercel

> **Important**: Save your `DATABASE_URL` - you'll need it for Vercel!

---

## Part 2: Set Up Vercel (Application)

### Step 1: Push Code to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/hecupps.git
git branch -M main
git push -u origin main
```

### Step 2: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New... → Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### Step 3: Configure Build Settings

Vercel should auto-detect these, but verify:

```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

> **Note**: The build command automatically runs `prisma generate` (configured in package.json)

### Step 4: Configure Environment Variables

Click **"Environment Variables"** and add all of the following:

#### Database
```
DATABASE_URL = mysql://root:password@containers-us-west-xxx.railway.app:6789/railway
```
(Use the URL from Railway)

#### NextAuth
```
NEXTAUTH_SECRET = [Generate with: openssl rand -base64 32]
NEXTAUTH_URL = https://your-app.vercel.app
```

#### Payment Gateways

**Razorpay (India):**
```
RAZORPAY_KEY_ID = your_razorpay_key_id
RAZORPAY_KEY_SECRET = your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET = your_razorpay_webhook_secret
```

**Stripe (Canada):**
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_...
STRIPE_SECRET_KEY = sk_live_...
STRIPE_WEBHOOK_SECRET = whsec_...
```

#### Email Service (Resend)
```
RESEND_API_KEY = re_...
EMAIL_FROM = HECuPPS <noreply@yourdomain.com>
```

#### Application Settings
```
NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
NEXT_PUBLIC_INSTAGRAM_URL = https://instagram.com/hecupps
```

> **Important**: Don't add `BLOB_READ_WRITE_TOKEN` yet - we'll do that in the next step!

### Step 5: Deploy (First Attempt)

1. Click **"Deploy"**
2. This first deployment will likely fail during the build because the database isn't migrated yet
3. That's okay! We'll fix it in the next step

---

## Part 3: Set Up Vercel Blob Storage

### Step 1: Create Blob Store

1. In your Vercel project, go to **"Storage"** tab
2. Click **"Create Database"**
3. Select **"Blob"**
4. Name it: `hecupps-media`
5. Click **"Create"**

### Step 2: Connect to Project

1. Vercel will show you environment variables
2. Click **"Add to Project"**
3. Select your HEcUPPS project
4. The `BLOB_READ_WRITE_TOKEN` will be automatically added

> **Tip**: You can view/copy the token from Storage → Settings → .env.local tab

---

## Part 4: Database Migration

### Option A: Migrate from Local (Recommended for First Deploy)

```bash
# In your local project directory

# Set the Railway database URL temporarily
$env:DATABASE_URL="mysql://root:password@containers-us-west-xxx.railway.app:6789/railway"

# Run migrations
npx prisma migrate deploy

# Seed the database with initial admin user
npm run db:seed
```

### Option B: Use Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env

# Run migrations using the production database
npx prisma migrate deploy

# Seed database
npm run db:seed
```

### Verify Migration Success

Check Railway:
1. Go to Railway project → MySQL service
2. Click **"Data"** tab
3. You should see tables like: `User`, `Product`, `Order`, etc.

---

## Part 5: Redeploy Application

### Option 1: Trigger from Vercel Dashboard

1. Go to your Vercel project
2. Click **"Deployments"** tab
3. Click the **"..."** menu on the latest deployment
4. Select **"Redeploy"**
5. Do NOT use cache

### Option 2: Push New Commit

```bash
# Make a small change or just commit again
git commit --allow-empty -m "Trigger deployment"
git push
```

### Monitor Deployment

1. Watch the build logs in real-time
2. Look for successful completion:
   ```
   ✓ Linting and checking validity of types
   ✓ Creating an optimized production build
   ✓ Compiled successfully
   ```

---

## Part 6: Post-Deployment Setup

### 1. Access Your Admin Panel

```
URL: https://your-app.vercel.app/admin/login
```

**Default Admin Credentials** (from seed script):
- Username: `HECUPPS.main.admin`
- Password: `HECCUPPs1786.admin.admin`

> **Security**: Change these immediately after first login!

### 2. Upload Product Images

Two options:

**Option A: Use Media Manager**
1. Navigate to: `/admin/media`
2. Upload product images
3. Note the URLs for use in products

**Option B: During Product Creation**
1. Go to: `/admin/products/new`
2. Use the file upload section
3. Images auto-upload to Vercel Blob

### 3. Configure Webhooks

#### Stripe Webhooks
```
Webhook URL: https://your-app.vercel.app/api/webhooks/stripe
Events to listen for:
  - checkout.session.completed
  - payment_intent.succeeded
```

#### Razorpay Webhooks
```
Webhook URL: https://your-app.vercel.app/api/webhooks/razorpay
Events to listen for:
  - payment.captured
  - order.paid
```

### 4. Test the Application

**Frontend:**
- [ ] Visit homepage
- [ ] Browse products
- [ ] Add to cart
- [ ] Test checkout flow (use test mode)

**Admin Panel:**
- [ ] Login with admin credentials
- [ ] Create a test product with images
- [ ] View orders dashboard
- [ ] Test media management

---

## Part 7: Domain Setup (Optional)

### Add Custom Domain to Vercel

1. Go to Vercel project → **"Settings"** → **"Domains"**
2. Click **"Add"**
3. Enter your domain (e.g., `hecupps.com`)
4. Follow DNS configuration instructions

### Update Environment Variables

After adding domain, update:

```
NEXTAUTH_URL = https://hecupps.com
NEXT_PUBLIC_APP_URL = https://hecupps.com
```

Then redeploy.

---

## Troubleshooting

### Build Fails with "Prisma Client Not Generated"

**Solution:**
```bash
# Ensure postinstall script is in package.json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Database Connection Issues

**Check:**
1. ✅ `DATABASE_URL` is correctly formatted
2. ✅ Railway database is active
3. ✅ Database is publicly accessible (if needed)

**Test connection:**
```bash
npx prisma db push --skip-generate
```

### "BLOB_READ_WRITE_TOKEN" Missing Error

**Solution:**
1. Go to Vercel → Storage → Your Blob store
2. Copy `BLOB_READ_WRITE_TOKEN`
3. Add to environment variables
4. Redeploy

### Images Not Uploading

**Check:**
1. ✅ Blob store is created
2. ✅ Token is in environment variables
3. ✅ Admin user has `PRODUCT_MANAGER` or `SUPER_ADMIN` role

### Payment Webhooks Not Working

**Verify:**
1. ✅ Webhook URLs are correct (https, not http)
2. ✅ Webhook secrets match environment variables
3. ✅ Test mode is enabled for testing

---

## Environment Variables Checklist

Before going live, ensure ALL these are set in Vercel:

### Required
- [x] `DATABASE_URL`
- [x] `NEXTAUTH_SECRET`
- [x] `NEXTAUTH_URL`
- [x] `BLOB_READ_WRITE_TOKEN`
- [x] `NEXT_PUBLIC_APP_URL`

### Payments (at least one)
- [ ] Razorpay: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
- [ ] Stripe: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

### Email
- [ ] `RESEND_API_KEY`
- [ ] `EMAIL_FROM`

### Optional
- [ ] `NEXT_PUBLIC_INSTAGRAM_URL`

---

## Monitoring & Maintenance

### Check Application Health

**Vercel Dashboard:**
- Monitor deployment status
- View real-time logs
- Check error rates
- Monitor bandwidth usage

**Railway Dashboard:**
- Monitor database usage
- Check connection pool
- View query performance
- Monitor storage usage

### Regular Maintenance

1. **Monitor Vercel Blob Storage**
   - Track storage usage via `/admin/media`
   - Delete unused files regularly
   - Consider upgrading plan as needed

2. **Database Backups**
   - Railway provides automatic backups
   - Download manual backups from Railway → Data → Export

3. **Security Updates**
   ```bash
   # Regularly update dependencies
   npm update
   npm audit fix
   
   # Redeploy
   git commit -am "Update dependencies"
   git push
   ```

---

## Going to Production Checklist

Before accepting real payments:

- [ ] Switch payment gateways to live mode
- [ ] Update webhook URLs with live endpoints
- [ ] Add custom domain
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Change default admin password
- [ ] Test complete checkout flow
- [ ] Configure email templates
- [ ] Add privacy policy & terms pages
- [ ] Set up analytics (Vercel Analytics)
- [ ] Configure error monitoring
- [ ] Test on mobile devices

---

## Cost Estimate

### Free Tier (for testing)

**Vercel:**
- Hosting: Free
- Blob Storage: 100GB free
- Bandwidth: 1TB free

**Railway:**
- $5 in free credits monthly
- ~$5-10/month for MySQL after credits

**Total:** ~$5-10/month

### Production (estimated)

**Vercel Pro:** $20/month
- Additional Blob storage: ~$5/month
- Higher limits

**Railway:** ~$10-20/month
- Depends on database size & traffic

**Total:** ~$35-45/month

---

## Quick Reference Commands

```bash
# Deploy to Vercel
vercel --prod

# Check deployment logs
vercel logs

# Run migrations on production database
DATABASE_URL="your-railway-url" npx prisma migrate deploy

# Seed production database
DATABASE_URL="your-railway-url" npm run db:seed

# Pull environment variables locally
vercel env pull

# Open production app
vercel open
```

---

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Prisma Docs:** https://www.prisma.io/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment

---

## Summary

You've successfully deployed HEcUPPS! 🎉

Your application is now running on:
- **Production URL:** https://your-app.vercel.app
- **Admin Panel:** https://your-app.vercel.app/admin/login
- **Database:** Hosted on Railway
- **Media Storage:** Vercel Blob

Next steps:
1. Test thoroughly in production
2. Add real products
3. Configure payment gateways for live mode
4. Start selling! 🚀
