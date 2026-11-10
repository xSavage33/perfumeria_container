import { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { cartService } from '../services/cartService';

const router = Router();

const validate = (req: Request, res: Response, next: Function) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /api/cart/:sessionId - Get cart
router.get(
  '/:sessionId',
  [param('sessionId').isString().notEmpty()],
  validate,
  async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const cart = await cartService.getCart(sessionId);
      res.json(cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ error: 'Failed to fetch cart' });
    }
  }
);

// POST /api/cart/:sessionId/items - Add item to cart
router.post(
  '/:sessionId/items',
  [
    param('sessionId').isString().notEmpty(),
    body('productId').isInt({ min: 1 }),
    body('price').isFloat({ min: 0 }),
    body('quantity').optional().isInt({ min: 1 }),
  ],
  validate,
  async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const { productId, price, quantity } = req.body;

      const cart = await cartService.addItem(sessionId, productId, price, quantity || 1);
      res.json(cart);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      res.status(500).json({ error: 'Failed to add item to cart' });
    }
  }
);

// PUT /api/cart/:sessionId/items/:productId - Update item quantity
router.put(
  '/:sessionId/items/:productId',
  [
    param('sessionId').isString().notEmpty(),
    param('productId').isInt().toInt(),
    body('quantity').isInt({ min: 0 }),
  ],
  validate,
  async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const productId = parseInt(req.params.productId);
      const { quantity } = req.body;

      const cart = await cartService.updateItemQuantity(sessionId, productId, quantity);
      res.json(cart);
    } catch (error: any) {
      if (error.message === 'Cart not found' || error.message === 'Item not found in cart') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Error updating cart item:', error);
      res.status(500).json({ error: 'Failed to update cart item' });
    }
  }
);

// DELETE /api/cart/:sessionId/items/:productId - Remove item from cart
router.delete(
  '/:sessionId/items/:productId',
  [
    param('sessionId').isString().notEmpty(),
    param('productId').isInt().toInt(),
  ],
  validate,
  async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const productId = parseInt(req.params.productId);

      const cart = await cartService.removeItem(sessionId, productId);
      res.json(cart);
    } catch (error: any) {
      if (error.message === 'Cart not found' || error.message === 'Item not found in cart') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Error removing cart item:', error);
      res.status(500).json({ error: 'Failed to remove cart item' });
    }
  }
);

// DELETE /api/cart/:sessionId - Clear cart
router.delete(
  '/:sessionId',
  [param('sessionId').isString().notEmpty()],
  validate,
  async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const cart = await cartService.clearCart(sessionId);
      res.json(cart);
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ error: 'Failed to clear cart' });
    }
  }
);

export default router;
