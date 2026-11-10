import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 3000;

// Service URLs
const PRODUCTS_SERVICE_URL = process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3001';
const CART_SERVICE_URL = process.env.CART_SERVICE_URL || 'http://localhost:3002';
const ORDERS_SERVICE_URL = process.env.ORDERS_SERVICE_URL || 'http://localhost:3003';

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
});

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));

app.use(limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'gateway' });
});

// Health check for all services
app.get('/api/health', async (req, res) => {
  try {
    const services = {
      gateway: 'ok',
      products: 'unknown',
      cart: 'unknown',
      orders: 'unknown',
    };

    // Check each service (simplified for now)
    res.json({ services });
  } catch (error) {
    res.status(500).json({ error: 'Health check failed' });
  }
});

// Proxy to Products Service
app.use('/api/products', createProxyMiddleware({
  target: PRODUCTS_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/products': '/api/products' },
  onError: (err, req, res) => {
    console.error('Products service error:', err);
    (res as express.Response).status(503).json({ error: 'Products service unavailable' });
  },
}));

app.use('/api/categories', createProxyMiddleware({
  target: PRODUCTS_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/categories': '/api/categories' },
  onError: (err, req, res) => {
    console.error('Products service error:', err);
    (res as express.Response).status(503).json({ error: 'Products service unavailable' });
  },
}));

app.use('/api/brands', createProxyMiddleware({
  target: PRODUCTS_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/brands': '/api/brands' },
  onError: (err, req, res) => {
    console.error('Products service error:', err);
    (res as express.Response).status(503).json({ error: 'Products service unavailable' });
  },
}));

// Proxy to Cart Service
app.use('/api/cart', createProxyMiddleware({
  target: CART_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/cart': '/api/cart' },
  onError: (err, req, res) => {
    console.error('Cart service error:', err);
    (res as express.Response).status(503).json({ error: 'Cart service unavailable' });
  },
}));

// Proxy to Orders Service
app.use('/api/orders', createProxyMiddleware({
  target: ORDERS_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/orders': '/api/orders' },
  onError: (err, req, res) => {
    console.error('Orders service error:', err);
    (res as express.Response).status(503).json({ error: 'Orders service unavailable' });
  },
}));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Products Service: ${PRODUCTS_SERVICE_URL}`);
  console.log(`Cart Service: ${CART_SERVICE_URL}`);
  console.log(`Orders Service: ${ORDERS_SERVICE_URL}`);
});
