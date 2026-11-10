import { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { categoryService } from '../services/productService';

const router = Router();

const validate = (req: Request, res: Response, next: Function) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /api/categories
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAll();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/categories/:id
router.get(
  '/:id',
  [param('id').isInt().toInt()],
  validate,
  async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const category = await categoryService.getById(id);

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.json(category);
    } catch (error) {
      console.error('Error fetching category:', error);
      res.status(500).json({ error: 'Failed to fetch category' });
    }
  }
);

// POST /api/categories
router.post(
  '/',
  [body('name').isString().notEmpty().trim()],
  validate,
  async (req: Request, res: Response) => {
    try {
      const category = await categoryService.create(req.body);
      res.status(201).json(category);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Failed to create category' });
    }
  }
);

// PUT /api/categories/:id
router.put(
  '/:id',
  [
    param('id').isInt().toInt(),
    body('name').isString().notEmpty().trim(),
  ],
  validate,
  async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const category = await categoryService.update(id, req.body);
      res.json(category);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Category not found' });
      }
      console.error('Error updating category:', error);
      res.status(500).json({ error: 'Failed to update category' });
    }
  }
);

// DELETE /api/categories/:id
router.delete(
  '/:id',
  [param('id').isInt().toInt()],
  validate,
  async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await categoryService.delete(id);
      res.status(204).send();
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Category not found' });
      }
      console.error('Error deleting category:', error);
      res.status(500).json({ error: 'Failed to delete category' });
    }
  }
);

export default router;
