import { Router, Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { productService } from '../services/productService';

const router = Router();

// Validation middleware
const validate = (req: Request, res: Response, next: Function) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /api/products - List all products with filters and pagination
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
    query('categoryId').optional().isInt().toInt(),
    query('brandId').optional().isInt().toInt(),
    query('gender').optional().isString(),
    query('minPrice').optional().isFloat({ min: 0 }).toFloat(),
    query('maxPrice').optional().isFloat({ min: 0 }).toFloat(),
    query('search').optional().isString().trim(),
  ],
  validate,
  async (req: Request, res: Response) => {
    try {
      const filters = {
        categoryId: req.query.categoryId ? Number(req.query.categoryId) : undefined,
        brandId: req.query.brandId ? Number(req.query.brandId) : undefined,
        gender: req.query.gender as string | undefined,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        search: req.query.search as string | undefined,
      };

      const pagination = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 12,
      };

      const result = await productService.getAll(filters, pagination);
      res.json(result);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }
);

// GET /api/products/featured - Get featured products
router.get('/featured', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 8;
    const products = await productService.getFeatured(limit);
    res.json(products);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
});

// GET /api/products/:id - Get product by ID
router.get(
  '/:id',
  [param('id').isInt().toInt()],
  validate,
  async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const product = await productService.getById(id);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  }
);

// POST /api/products - Create a new product
router.post(
  '/',
  [
    body('name').isString().notEmpty().trim(),
    body('price').isFloat({ min: 0 }),
    body('description').optional().isString(),
    body('discountPrice').optional().isFloat({ min: 0 }),
    body('categoryId').optional().isInt(),
    body('brandId').optional().isInt(),
    body('imageUrl').optional().isString(),
    body('stock').optional().isInt({ min: 0 }),
    body('fragranceNotes').optional().isString(),
    body('sizeMl').optional().isInt({ min: 1 }),
    body('gender').optional().isIn(['masculino', 'femenino', 'unisex']),
  ],
  validate,
  async (req: Request, res: Response) => {
    try {
      const product = await productService.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  }
);

// PUT /api/products/:id - Update a product
router.put(
  '/:id',
  [
    param('id').isInt().toInt(),
    body('name').optional().isString().notEmpty().trim(),
    body('price').optional().isFloat({ min: 0 }),
    body('description').optional().isString(),
    body('discountPrice').optional().isFloat({ min: 0 }),
    body('categoryId').optional().isInt(),
    body('brandId').optional().isInt(),
    body('imageUrl').optional().isString(),
    body('stock').optional().isInt({ min: 0 }),
    body('fragranceNotes').optional().isString(),
    body('sizeMl').optional().isInt({ min: 1 }),
    body('gender').optional().isIn(['masculino', 'femenino', 'unisex']),
    body('isActive').optional().isBoolean(),
  ],
  validate,
  async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const product = await productService.update(id, req.body);
      res.json(product);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Product not found' });
      }
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  }
);

// DELETE /api/products/:id - Delete a product
router.delete(
  '/:id',
  [param('id').isInt().toInt()],
  validate,
  async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await productService.delete(id);
      res.status(204).send();
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Product not found' });
      }
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }
);

export default router;
