import { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { brandService } from '../services/productService';

const router = Router();

const validate = (req: Request, res: Response, next: Function) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /api/brands
router.get('/', async (req: Request, res: Response) => {
  try {
    const brands = await brandService.getAll();
    res.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
});

// GET /api/brands/:id
router.get(
  '/:id',
  [param('id').isInt().toInt()],
  validate,
  async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const brand = await brandService.getById(id);

      if (!brand) {
        return res.status(404).json({ error: 'Brand not found' });
      }

      res.json(brand);
    } catch (error) {
      console.error('Error fetching brand:', error);
      res.status(500).json({ error: 'Failed to fetch brand' });
    }
  }
);

// POST /api/brands
router.post(
  '/',
  [
    body('name').isString().notEmpty().trim(),
    body('logoUrl').optional().isString(),
  ],
  validate,
  async (req: Request, res: Response) => {
    try {
      const brand = await brandService.create(req.body);
      res.status(201).json(brand);
    } catch (error) {
      console.error('Error creating brand:', error);
      res.status(500).json({ error: 'Failed to create brand' });
    }
  }
);

// PUT /api/brands/:id
router.put(
  '/:id',
  [
    param('id').isInt().toInt(),
    body('name').optional().isString().notEmpty().trim(),
    body('logoUrl').optional().isString(),
  ],
  validate,
  async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const brand = await brandService.update(id, req.body);
      res.json(brand);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Brand not found' });
      }
      console.error('Error updating brand:', error);
      res.status(500).json({ error: 'Failed to update brand' });
    }
  }
);

// DELETE /api/brands/:id
router.delete(
  '/:id',
  [param('id').isInt().toInt()],
  validate,
  async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await brandService.delete(id);
      res.status(204).send();
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Brand not found' });
      }
      console.error('Error deleting brand:', error);
      res.status(500).json({ error: 'Failed to delete brand' });
    }
  }
);

export default router;
