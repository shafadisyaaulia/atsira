# Payment Gateway Setup - Stripe Integration

## Overview
ATSIRA now supports international payment processing via **Stripe** for credit/debit cards and PayPal (through Stripe). This enables:
- 🌍 **International Transactions**: Full support for global payments (USD/IDR conversion)
- 💳 **Multiple Payment Methods**: Card, PayPal, domestic Bank Transfers (VA), e-wallets
- 🔒 **Secure Escrow**: Funds held safely until buyer verifies product delivery
- 📊 **Real-time Tracking**: Order status updates via Stripe webhooks

## Architecture

### Payment Flow
```
User adds items to cart
    ↓
Checkout page (app/checkout/page.tsx)
    ↓ [Select payment method & shipping]
    ↓
/api/checkout [Creates order in database]
    ↓
/api/payments/create-session [Creates Stripe Checkout Session]
    ↓
User redirected to Stripe Checkout
    ↓
User completes payment
    ↓
Stripe webhook → /api/payments/webhook
    ↓
Order status updated (payment_status, order status, escrow status)
    ↓
User sees success page with order confirmation
```

### Key Routes
- **POST /api/checkout** - Creates order record and line items
  - Input: buyerId, buyerName, items[], totals, paymentMethod, courier
  - Output: {ok: true, orderId}
  - Stores order in `public.orders` table with status "Menunggu Pembayaran"

- **POST /api/payments/create-session** - Creates Stripe checkout session
  - Input: orderId, buyerEmail, buyerName, items[], totals, currency, isInternational
  - Output: {ok: true, sessionId, checkoutUrl}
  - Updates order with payment_session_id and payment_method

- **POST /api/payments/webhook** - Handles Stripe events
  - Events: checkout.session.completed, checkout.session.expired, payment_intent.payment_failed
  - Updates order status, escrow_status, and payment_status based on payment result

## Setup Instructions

### 1. Get Stripe Credentials

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign up for a free account (test mode)
3. Navigate to **Developers → API Keys**
4. Copy your **Secret Key** and **Publishable Key**

### 2. Configure Environment Variables

Create or update `.env.local`:

```env
# Stripe API Keys (get from https://dashboard.stripe.com/test/keys)
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_public_key_here

# Stripe Webhook Secret (get from https://dashboard.stripe.com/webhooks)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Set Up Webhooks (Production Deployment)

For local development, use Stripe CLI:

```bash
# Install Stripe CLI (https://stripe.com/docs/stripe-cli)
stripe listen --forward-to localhost:3000/api/payments/webhook

# Copy the webhook signing secret and add to .env.local
STRIPE_WEBHOOK_SECRET=whsec_...
```

For production:
1. Deploy your app to a public URL
2. Go to **Developers → Webhooks** in Stripe Dashboard
3. Add endpoint: `https://your-domain.com/api/payments/webhook`
4. Select events to listen for (checkout.session.completed, payment_intent.payment_failed, etc.)
5. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 4. Test Payment Flow

**Test Cards (Stripe Provides):**
- ✅ **Successful Payment**: `4242 4242 4242 4242`
- ❌ **Payment Declined**: `4000 0000 0000 0002`
- ⏰ **Requires Authentication**: `4000 0025 0000 3155`

**Expiry**: Any future date (e.g., 12/34)
**CVC**: Any 3 digits (e.g., 123)

### 5. Test Domestic Payment (Non-Card)

For Indonesian domestic checkout:
- Select "Dalam Negeri (Domestik)"
- Choose "Bank Syariah Indonesia (BSI Virtual Account)" or "QRIS Instan"
- Checkout creates order with status "Menunggu Pembayaran"
- Order directs to success page (payment simulated for MVP)

For international checkout:
- Select "Luar Negeri (Internasional)"
- Payment method automatically switches to "Credit/Debit Card"
- Checkout redirects to Stripe for payment processing

## Database Schema Updates

The `orders` table includes three payment-related fields:

```sql
ALTER TABLE orders ADD COLUMN payment_session_id TEXT;
ALTER TABLE orders ADD COLUMN payment_intent_id TEXT;
ALTER TABLE orders ADD COLUMN payment_status TEXT DEFAULT 'pending';
```

**Payment Status Values:**
- `pending` - Order created, awaiting payment
- `completed` - Payment successful, escrow activated
- `failed` - Payment attempt failed
- `expired` - Checkout session expired

## Testing Workflow

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Add product to cart** from `/marketplace`

3. **Go to checkout** (`/checkout`)

4. **Select international shipping** OR **choose card payment**

5. **Fill checkout form** (pre-populated demo data)

6. **Click "Bayar Sekarang" / "Pay Now"**

7. **You'll be redirected to Stripe Checkout**

8. **Use test card**: `4242 4242 4242 4242`

9. **Complete payment** (2D Secure may appear)

10. **Redirected to success page** with order ID

11. **Database updated**:
    - Order status: "Diproses"
    - Escrow status: "Ditahan"
    - Payment status: "completed"

## Troubleshooting

### Build Error: "Neither apiKey nor config.authenticator provided"
**Cause**: Stripe client initialized at module level during build
**Fix**: Stripe is now initialized inside route handlers ✅ (already done)

### Webhook Not Receiving Events
**Issue**: Webhook handler returns 500
**Solutions**:
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Check `/api/payments/webhook` is deployed and accessible
- Verify Supabase credentials in env vars
- Check Stripe dashboard for webhook delivery failures

### Payment Redirect Not Working
**Issue**: No redirect to Stripe checkout
**Solutions**:
- Verify `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` is set
- Check browser console for errors
- Ensure payment method selection is "card" or "paypal"
- Confirm checkout session created successfully (check logs)

### Order Not Created
**Issue**: Checkout errors before reaching payment
**Solutions**:
- Verify cart has items
- Check Supabase connection and credentials
- Verify `orders` and `order_items` tables exist
- Check API response in network tab for error details

## Security Notes

- ✅ API keys properly configured (never exposed in client code)
- ✅ Webhook signature verification implemented
- ✅ Stripe handles all payment data (PCI DSS compliant)
- ✅ Supabase RLS policies protect order privacy
- ⚠️ **IMPORTANT**: Always use STRIPE_SECRET_KEY server-side only
- ⚠️ **IMPORTANT**: Verify webhook signatures before processing events

## Production Deployment Checklist

- [ ] Move test keys to `.env.production`
- [ ] Generate production Stripe keys
- [ ] Configure webhook endpoint in Stripe Dashboard
- [ ] Test full payment flow with production keys
- [ ] Enable error logging and monitoring
- [ ] Set up SSL/TLS for HTTPS
- [ ] Verify Supabase in production mode
- [ ] Run security audit
- [ ] Document backup/recovery procedures

## Next Steps

1. ✅ **Set environment variables** (follow Setup section above)
2. ✅ **Test with Stripe test cards**
3. ✅ **Verify webhook delivery** (check Stripe Dashboard)
4. ⏭️ **Implement order history dashboard** (display past orders, status, tracking)
5. ⏭️ **Add email notifications** (order confirmation, payment received, shipment updates)
6. ⏭️ **Implement real shipping integration** (Biteship API for rate quotes)
7. ⏭️ **Add fraud detection** (Stripe Radar)

## API Documentation

### POST /api/checkout

Creates order record in database before payment.

**Request:**
```json
{
  "buyerId": "user-uuid",
  "buyerName": "Budi Santoso",
  "items": [
    {
      "productId": "prod-123",
      "title": "Patchouli Oil Premium",
      "qty": 2,
      "unit": "kg",
      "price": 500000
    }
  ],
  "subtotal": 1000000,
  "shippingFee": 15000,
  "tax": 110000,
  "total": 1125000,
  "paymentMethod": "card",
  "courier": "JNE Regular",
  "orderType": "B2C"
}
```

**Response:**
```json
{
  "ok": true,
  "orderId": "ATR-1234567890"
}
```

### POST /api/payments/create-session

Creates Stripe Checkout Session for payment processing.

**Request:**
```json
{
  "orderId": "ATR-1234567890",
  "buyerEmail": "budi@example.com",
  "buyerName": "Budi Santoso",
  "items": [
    {
      "title": "Patchouli Oil Premium",
      "price": 500000,
      "qty": 2,
      "unit": "kg"
    }
  ],
  "subtotal": 1000000,
  "shippingFee": 15000,
  "tax": 110000,
  "total": 1125000,
  "isInternational": false,
  "currency": "IDR"
}
```

**Response:**
```json
{
  "ok": true,
  "sessionId": "cs_test_...",
  "checkoutUrl": "https://checkout.stripe.com/pay/cs_test_..."
}
```

### POST /api/payments/webhook

Receives and processes Stripe webhook events (called by Stripe, not by client).

**Handled Events:**
- `checkout.session.completed` - Payment successful
- `checkout.session.expired` - Session timed out
- `payment_intent.payment_failed` - Payment failed

**Automatic Actions:**
- Updates `orders.payment_status`
- Updates `orders.status` 
- Updates `orders.escrow_status` (on success)
- Updates `orders.payment_intent_id`

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review Stripe Dashboard for payment failures
3. Check `/api/payments/*` routes for error logs
4. Verify database schema matches schema.sql
