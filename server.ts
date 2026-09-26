import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { requireAuth, optionalAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser, getUserProfile, updateBoutiqueProfile } from './src/db/users.ts';
import { createOrder, getUserOrders, getOrderByDocketNumber } from './src/db/orders.ts';
import { getUserWishlist, addToWishlist, removeFromWishlist } from './src/db/wishlist.ts';
import { createInquiry, getInquiries } from './src/db/inquiries.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// ================= API ROUTES =================

// 1. Auth & User Profile Sync
app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { uid, email, name } = req.user!;
    if (!email) {
      return res.status(400).json({ error: 'Email required in auth token' });
    }
    const user = await getOrCreateUser(uid, email, name);
    const profile = await getUserProfile(uid);
    res.json({ success: true, user: profile || user });
  } catch (error: any) {
    console.error('Error in /api/auth/sync:', error);
    res.status(500).json({ error: error.message || 'Failed to sync user' });
  }
});

app.get('/api/user/profile', requireAuth, async (req: AuthRequest, res) => {
  try {
    const profile = await getUserProfile(req.user!.uid);
    res.json(profile);
  } catch (error: any) {
    console.error('Error in /api/user/profile:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch profile' });
  }
});

app.post('/api/user/boutique', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { businessName, country, city, phone, approvedTier } = req.body;
    if (!businessName || !country) {
      return res.status(400).json({ error: 'Business name and country are required' });
    }
    const profile = await updateBoutiqueProfile(req.user!.uid, {
      businessName,
      country,
      city,
      phone,
      approvedTier,
    });
    res.json({ success: true, profile });
  } catch (error: any) {
    console.error('Error in /api/user/boutique:', error);
    res.status(500).json({ error: error.message || 'Failed to update boutique profile' });
  }
});

// 2. Orders CRUD
app.post('/api/orders', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      orderType,
      totalAmount,
      paymentMethod,
      shippingAddress,
      items,
    } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !totalAmount || !shippingAddress) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    const order = await createOrder({
      uid: req.user?.uid,
      customerName,
      customerEmail,
      customerPhone,
      orderType: orderType || 'retail',
      totalAmount,
      paymentMethod: paymentMethod || 'upi',
      shippingAddress: typeof shippingAddress === 'string' ? shippingAddress : JSON.stringify(shippingAddress),
      items: items || [],
    });

    res.json({ success: true, order });
  } catch (error: any) {
    console.error('Error in POST /api/orders:', error);
    res.status(500).json({ error: error.message || 'Failed to create order' });
  }
});

app.get('/api/orders/my', requireAuth, async (req: AuthRequest, res) => {
  try {
    const orders = await getUserOrders(req.user!.uid);
    res.json(orders);
  } catch (error: any) {
    console.error('Error in GET /api/orders/my:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch orders' });
  }
});

app.get('/api/orders/track/:docket', async (req, res) => {
  try {
    const order = await getOrderByDocketNumber(req.params.docket);
    if (!order) {
      return res.status(404).json({ error: 'Order docket not found' });
    }
    res.json(order);
  } catch (error: any) {
    console.error('Error in /api/orders/track:', error);
    res.status(500).json({ error: error.message || 'Failed to track order' });
  }
});

// 3. Wishlist CRUD
app.get('/api/wishlist', requireAuth, async (req: AuthRequest, res) => {
  try {
    const items = await getUserWishlist(req.user!.uid);
    res.json(items);
  } catch (error: any) {
    console.error('Error in GET /api/wishlist:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch wishlist' });
  }
});

app.post('/api/wishlist', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }
    const result = await addToWishlist(req.user!.uid, productId);
    res.json({ success: true, item: result });
  } catch (error: any) {
    console.error('Error in POST /api/wishlist:', error);
    res.status(500).json({ error: error.message || 'Failed to add to wishlist' });
  }
});

app.delete('/api/wishlist/:productId', requireAuth, async (req: AuthRequest, res) => {
  try {
    await removeFromWishlist(req.user!.uid, req.params.productId);
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error in DELETE /api/wishlist:', error);
    res.status(500).json({ error: error.message || 'Failed to remove from wishlist' });
  }
});

// 4. Inquiries CRUD (Concierge & Wholesale)
app.post('/api/inquiries', async (req, res) => {
  try {
    const { name, email, phone, inquiryType, message } = req.body;
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'Missing required inquiry fields' });
    }
    const inquiry = await createInquiry({
      name,
      email,
      phone,
      inquiryType,
      message,
    });
    res.json({ success: true, inquiry });
  } catch (error: any) {
    console.error('Error in POST /api/inquiries:', error);
    res.status(500).json({ error: error.message || 'Failed to submit inquiry' });
  }
});

app.get('/api/inquiries', requireAuth, async (_req, res) => {
  try {
    const list = await getInquiries();
    res.json(list);
  } catch (error: any) {
    console.error('Error in GET /api/inquiries:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch inquiries' });
  }
});

// ================= VITE DEV OR PRODUCTION SERVER =================
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NOORI Haute Modestie server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
