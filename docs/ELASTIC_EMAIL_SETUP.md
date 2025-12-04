# Elastic Email Setup Guide

Complete guide for setting up Elastic Email in your HEcUPPS application.

---

## What is Elastic Email?

Elastic Email is a cost-effective email delivery platform that offers:
- **Affordable pricing** - Starting at $15/mo for 60,000 emails
- **High deliverability** - Industry-leading inbox placement
- **Easy API** - Simple REST API integration
- **Analytics** - Detailed email tracking and reports
- **Templates** - Visual email template builder

---

## Getting Your API Key

### Step 1: Create Account

1. Go to [Elastic Email](https://elasticemail.com/)
2. Click **"Sign Up"** or **"Get Started Free"**
3. Complete registration with your email
4. Verify your email address

### Step 2: Verify Your Domain (Recommended)

For best deliverability, verify your sending domain:

1. Go to **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `hecupps.com`)
4. Add the provided DNS records to your domain:
   - **SPF** record
   - **DKIM** record  
   - **Tracking** domain (optional)
5. Click **"Verify"** after adding records

> **Note**: DNS propagation can take up to 24 hours

### Step 3: Generate API Key

1. Navigate to **Settings** → **API**
2. Click **"Create Additional API Key"**
3. Give it a name: `HEcUPPS Production` or `HEcUPPS Development`
4. Set permissions:
   - ✅ **Email Send** (required)
   - ✅ **Email View** (optional, for tracking)
5. Click **"Create"**
6. **Copy the API key immediately** (you won't see it again!)

The key looks like: `XXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`

---

## Configuration

### Local Development

Add to your `.env` file:

```env
# Elastic Email
ELASTICEMAIL_API_KEY="your_api_key_here"
EMAIL_FROM="HECuPPS <noreply@hecupps.com>"
```

> **Important**: Use the email address from your verified domain!

### Production (Vercel)

1. Go to Vercel project → **Settings** → **Environment Variables**
2. Add:
   - **Key**: `ELASTICEMAIL_API_KEY`
   - **Value**: Your API key
   - **Environment**: Production (and Preview)
3. Add:
   - **Key**: `EMAIL_FROM`
   - **Value**: `HECuPPS <noreply@yourdomain.com>`
4. Redeploy your application

---

## Email Functions Available

Your HEcUPPS app has these email functions ready to use:

### 1. Welcome Email
```typescript
await sendWelcomeEmail(
    'customer@example.com',
    'John Doe'
);
```

### 2. Order Confirmation
```typescript
await sendOrderConfirmationEmail(
    'customer@example.com',
    'John Doe',
    'ORDER-12345',
    '₹2,999.00',
    'Paid'
);
```

### 3. Password Reset
```typescript
await sendPasswordResetEmail(
    'customer@example.com',
    'John Doe',
    'reset_token_12345'
);
```

### 4. Support Reply
```typescript
await sendSupportReply(
    'customer@example.com',
    'John Doe',
    'Re: Order Issue',
    'We have resolved your issue...'
);
```

### 5. Shipping Notification (NEW!)
```typescript
await sendShippingNotification(
    'customer@example.com',
    'John Doe',
    'ORDER-12345',
    'TRACK123456',
    'https://tracking-url.com'
);
```

### 6. Delivery Confirmation (NEW!)
```typescript
await sendDeliveryConfirmation(
    'customer@example.com',
    'John Doe',
    'ORDER-12345'
);
```

---

## Testing Emails

### Test in Development

```bash
# Start your dev server
npm run dev

# Send a test email (use your own email)
# Navigate to a feature that triggers emails, like:
# - User registration (welcome email)
# - Password reset
# - Test order placement
```

### Check Elastic Email Dashboard

1. Go to Elastic Email Dashboard
2. Navigate to **Reports** → **Emails**
3. View sent emails, delivery status, opens, clicks
4. Check for bounces or spam complaints

---

## Email Templates

Your app uses database templates for dynamic content. Set these up in your database:

### Required Templates

Create these in the `EmailTemplate` table:

1. **welcome**
   - Subject: `Welcome to HECuPPS, {{name}}!`
   - Variables: `{{name}}`

2. **order_confirmation**
   - Subject: `Order Confirmed - {{orderId}}`
   - Variables: `{{customerName}}`, `{{orderId}}`, `{{totalAmount}}`, `{{paymentStatus}}`

3. **password_reset**
   - Subject: `Reset Your Password`
   - Variables: `{{name}}`, `{{resetLink}}`

4. **support_reply**
   - Subject: `Re: {{subject}}`
   - Variables: `{{userName}}`, `{{subject}}`, `{{replyMessage}}`

5. **shipping_notification** (NEW)
   - Subject: `Your Order {{orderId}} Has Shipped!`
   - Variables: `{{customerName}}`, `{{orderId}}`, `{{trackingNumber}}`, `{{trackingUrl}}`

6. **delivery_confirmation** (NEW)
   - Subject: `Your Order {{orderId}} Has Been Delivered`
   - Variables: `{{customerName}}`, `{{orderId}}`

---

## Best Practices

### Improve Deliverability

1. **Verify your domain** - Critical for inbox placement
2. **Use consistent "From" name** - Don't change frequently
3. **Include unsubscribe link** - Required by law in many countries
4. **Monitor bounce rates** - Keep below 5%
5. **Authenticate emails** - SPF, DKIM, DMARC setup

### Email Content

1. **Mobile-friendly** - Most emails are read on mobile
2. **Clear CTAs** - Make buttons/links obvious
3. **Personalization** - Use customer name
4. **Plain-text alternative** - Some email clients need it

### Compliance

1. **GDPR** - Get consent before sending marketing emails
2. **CAN-SPAM** - Include physical address and unsubscribe
3. **Privacy Policy** - Link to your privacy policy

---

## Pricing

### Free Tier
- **100 emails/day** forever free
- Good for testing and small projects

### Pay-as-you-go
- **$0.09/1,000 emails**
- No monthly commitment

### Monthly Plans
- **$15/month** - 60,000 emails
- **$39/month** - 175,000 emails
- **$99/month** - 500,000 emails

> Much cheaper than Resend for high volume!

---

## Troubleshooting

### "API Key Invalid" Error

**Check:**
1. ✅ API key copied correctly (no extra spaces)
2. ✅ API key has "Email Send" permission
3. ✅ Using correct environment variable name: `ELASTICEMAIL_API_KEY`
4. ✅ Restarted dev server after adding to `.env`

### Emails Not Sending

**Verify:**
1. ✅ Email template exists in database and `isActive = true`
2. ✅ `EMAIL_FROM` matches verified domain
3. ✅ Recipient email is valid
4. ✅ Check Elastic Email dashboard for errors

### Emails Going to Spam

**Solutions:**
1. Verify your sending domain
2. Set up SPF, DKIM, DMARC records
3. Warm up your domain (start with low volume)
4. Avoid spam trigger words
5. Include unsubscribe link

### Rate Limiting

Elastic Email limits:
- **Free**: 100 emails/day
- **Paid**: Depends on plan, typically 500-1000/hour

If hitting limits:
- Upgrade plan
- Implement queue system
- Space out bulk sends

---

## Migration from Resend

Your app has been successfully migrated from Resend to Elastic Email:

### What Changed
- ✅ Email service now uses Elastic Email API
- ✅ Removed `resend` npm package
- ✅ All function signatures remain the same
- ✅ Added 2 new email functions (shipping, delivery)

### What Stayed the Same
- ✅ All existing email functions work identically
- ✅ Template system unchanged
- ✅ `EMAIL_FROM` variable still used

### Migration Checklist
- [ ] Get Elastic Email API key
- [ ] Add `ELASTICEMAIL_API_KEY` to `.env`
- [ ] Remove `RESEND_API_KEY` from `.env`
- [ ] Test email sending locally
- [ ] Update Vercel environment variables
- [ ] Redeploy application
- [ ] Send test emails in production

---

## Support

- **Elastic Email Docs**: https://elasticemail.com/developer-docs/
- **API Reference**: https://api.elasticemail.com/public/help
- **Support**: https://elasticemail.com/contact

---

## Summary

Elastic Email is now integrated into your HEcUPPS app with:

✅ Lower cost than Resend  
✅ All email functions working  
✅ 2 new functions (shipping, delivery)  
✅ Simple API key configuration  
✅ Production-ready  

Just add your API key and start sending emails! 📧
