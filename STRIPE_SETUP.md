# Stripe Integration Setup Guide

## ✅ What's Already Done

You've successfully:
1. ✅ Created Stripe product "Snippets" at $9/month
2. ✅ Installed Stripe packages (`stripe`, `@stripe/stripe-js`)
3. ✅ Ran database migration (added `stripe_customer_id` and `stripe_subscription_id` columns)

## 🔧 Next Steps (5 minutes)

### Step 1: Get Your Stripe Keys

From your Stripe dashboard (test mode):

1. **Secret Key**: Go to https://dashboard.stripe.com/test/apikeys
   - Copy the "Secret key" (starts with `sk_test_`)

2. **Price ID**: You already have this!
   - From the screenshot, click on your "Snippets" product
   - Copy the Price ID (starts with `price_`)

3. **Webhook Secret** (we'll set this up later):
   - For now, use a placeholder

### Step 2: Add to `.env.local`

Add these lines to your `.env.local` file:

```env
# Stripe Configuration (Test Mode)
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_PRICE_ID=price_YOUR_PRICE_ID_HERE
STRIPE_WEBHOOK_SECRET=whsec_placeholder_for_now
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Replace:**
- `sk_test_YOUR_SECRET_KEY_HERE` with your actual secret key
- `price_YOUR_PRICE_ID_HERE` with your actual price ID from the product

### Step 3: Restart Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 4: Test the Flow

1. Go to http://localhost:3000/pricing
2. Click "Upgrade to Pro" button
3. You should be redirected to Stripe Checkout
4. Use test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any ZIP code

5. Complete payment
6. You'll be redirected back to dashboard

### Step 5: Set Up Webhooks (Important!)

Webhooks handle subscription updates (renewals, cancellations, etc.)

**For Local Testing:**
```bash
# Install Stripe CLI
# Windows: scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

This will give you a webhook secret starting with `whsec_`. Add it to `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

**For Production:**
1. Go to https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy the webhook secret to production env vars

## 🚀 Going to Production

When ready to accept real payments:

1. **Switch to Live Mode** in Stripe dashboard
2. **Create Live Product** (same as test, but in live mode)
3. **Update Environment Variables:**
   ```env
   STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_KEY
   STRIPE_PRICE_ID=price_YOUR_LIVE_PRICE_ID
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_LIVE_WEBHOOK_SECRET
   ```
4. **Set up production webhook** endpoint
5. **Deploy!**

That's it! The code automatically detects test vs live mode based on the key prefix.

## 🧪 Testing Checklist

- [ ] Upgrade button redirects to Stripe Checkout
- [ ] Test payment completes successfully
- [ ] User role updates to "pro" in database
- [ ] Usage limits disappear for pro users
- [ ] Upgrade button disappears from header
- [ ] Webhook processes subscription events (check terminal logs)

## 🐛 Troubleshooting

**"Failed to create checkout session"**
- Check that `STRIPE_SECRET_KEY` and `STRIPE_PRICE_ID` are set correctly
- Restart dev server after adding env vars

**"No signature" webhook error**
- Make sure `stripe listen` is running
- Check that `STRIPE_WEBHOOK_SECRET` matches the CLI output

**User not upgrading after payment**
- Check webhook logs in terminal
- Verify webhook secret is correct
- Make sure `/api/stripe/webhook` is excluded from auth middleware (already done)

## 📝 Current Status

Your integration is **95% complete**! Just need to:
1. Add your Stripe keys to `.env.local`
2. Restart server
3. Test a payment

Everything else is ready to go! 🎉
