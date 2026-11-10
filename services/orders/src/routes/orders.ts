import { Router, Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { orderService } from '../services/orderService';

const router = Router();

const validate = (req: Request, res: Response, next: Function) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST /api/orders - Create a new order (checkout)
router.post(
  '/',
  [
    body('customerEmail').isEmail().normalizeEmail(),
    body('customerName').isString().notEmpty().trim(),
    body('customerPhone').optional().isString(),
    body('shippingAddress').isString().notEmpty(),
    body('shippingCity').isString().notEmpty(),
    body('shippingCost').optional().isFloat({ min: 0 }),
    body('paymentMethod').optional().isString(),
    body('notes').optional().isString(),
    body('items').isArray({ min: 1 }),
    body('items.*.productId').isInt({ min: 1 }),
    body('items.*.productName').isString().notEmpty(),
    body('items.*.quantity').isInt({ min: 1 }),
    body('items.*.unitPrice').isFloat({ min: 0 }),
  ],
  validate,
  async (req: Request, res: Response) => {
    try {
      const order = await orderService.create(req.body);
      res.status(201).json(order);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  }
);

// GET /api/orders - List all orders (admin)
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
    query('status').optional().isString(),
  ],
  validate,
  async (req: Request, res: Response) => {
    try {
      const params = {
        page: req.query.page as number | undefined,
        limit: req.query.limit as number | undefined,
        status: req.query.status as string | undefined,
      };

      const result = await orderService.getAll(params);
      res.json(result);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }
);

// GET /api/orders/by-email/:email - Get orders by email
router.get(
  '/by-email/:email',
  [param('email').isEmail()],
  validate,
  async (req: Request, res: Response) => {
    try {
      const { email } = req.params;
      const orders = await orderService.getByEmail(email);
      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders by email:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }
);

// GET /api/orders/:orderNumber - Get order by order number
router.get(
  '/:orderNumber',
  [param('orderNumber').isString().notEmpty()],
  validate,
  async (req: Request, res: Response) => {
    try {
      const { orderNumber } = req.params;
      const order = await orderService.getByOrderNumber(orderNumber);

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json(order);
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  }
);

// PUT /api/orders/:id/status - Update order status
router.put(
  '/:id/status',
  [
    param('id').isInt().toInt(),
    body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
  ],
  validate,
  async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      const order = await orderService.updateStatus(id, status);
      res.json(order);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Order not found' });
      }
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  }
);

export default router;
