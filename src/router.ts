import {Router} from 'express';
import {body, param} from 'express-validator';
import {PrismaClient} from '@prisma/client';
import {handleInputErrors} from './modules/middleware';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
} from './handlers/product';
import {
  createUpdate,
  deleteUpdate,
  getAllUpdates,
  getOneUpdate,
  updateUpdate,
} from './handlers/updates';
import {
  createUpdatePoint,
  deleteUpdatePoint,
  getAllUpdatesPoints,
  getOneUpdatePoint,
  updateUpdatePoint,
} from './handlers/updatepoint';

const prisma = new PrismaClient();
const router = Router();

/**
 * Product Routes
 */

// Get all products
router.get('/product', getAllProducts);

// Get a single product by ID
router.get(
  '/product/:id',
  param('id').isUUID().withMessage('Invalid product ID'),
  handleInputErrors,
  getOneProduct,
);

// Create a new product
router.post(
  '/product',
  [body('name').isString().notEmpty().withMessage('Name is required')],
  handleInputErrors,
  createProduct,
);

// Update a product by ID
router.put(
  '/product/:id',
  [
    param('id').isUUID().withMessage('Invalid product ID'),
    body('name').optional().isString().withMessage('Name must be a string'),
  ],
  handleInputErrors,
  updateProduct,
);

// Delete a product by ID
router.delete(
  '/product/:id',
  param('id').isUUID().withMessage('Invalid product ID'),
  handleInputErrors,
  deleteProduct,
);

/**
 * Update Routes
 */

// Get all updates
router.get('/update', getAllUpdates);

// Get a single update by ID
router.get(
  '/update/:id',
  param('id').isUUID().withMessage('Invalid update ID'),
  handleInputErrors,
  getOneUpdate,
);

// Create a new update
router.post(
  '/update',
  [
    body('title').isString().notEmpty().withMessage('Title is required'),
    body('body').isString().notEmpty().withMessage('Body is required'),
    body('productId').isUUID().withMessage('Invalid product ID'),
  ],
  handleInputErrors,
  createUpdate,
);

// Update an update by ID
router.put(
  '/update/:id',
  [
    param('id').isUUID().withMessage('Invalid update ID'),
    body('title').optional().isString(),
    body('body').optional().isString(),
    body('status')
      .optional()
      .isIn(['IN_PROGRESS', 'LIVE', 'DEPRECATED', 'ARCHIVED'])
      .withMessage('Invalid status'),
    body('version').optional().isString(),
    body('asset').optional().isString(),
    body('productId').optional().isUUID().withMessage('Invalid product ID'),
  ],
  handleInputErrors,
  updateUpdate,
);

// Delete an update by ID
router.delete(
  '/update/:id',
  param('id').isUUID().withMessage('Invalid update ID'),
  handleInputErrors,
  deleteUpdate,
);

/**
 * UpdatePoint Routes
 */

// Get all update points
router.get('/updatepoint', getAllUpdatesPoints);

// Get a single update point by ID
router.get(
  '/updatepoint/:id',
  param('id').isUUID().withMessage('Invalid update point ID'),
  handleInputErrors,
  getOneUpdatePoint,
);

// Create a new update point
router.post(
  '/updatepoint',
  [
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('description')
      .isString()
      .notEmpty()
      .withMessage('Description is required'),
    body('updateId').isUUID().withMessage('Invalid update ID'),
  ],
  handleInputErrors,
  createUpdatePoint,
);

// Update an update point by ID
router.put(
  '/updatepoint/:id',
  [
    param('id').isUUID().withMessage('Invalid update point ID'),
    body('name').optional().isString(),
    body('description').optional().isString(),
    body('updateId').optional().isUUID().withMessage('Invalid update ID'),
  ],
  handleInputErrors,
  updateUpdatePoint,
);

// Delete an update point by ID
router.delete(
  '/updatepoint/:id',
  param('id').isUUID().withMessage('Invalid update point ID'),
  handleInputErrors,
  deleteUpdatePoint,
);

// error handler in router level
// router.use((err, req, res, next) => {
//   console.error(err.stack); // Log the error for debugging
//   err.type = 'router';
//   next(err);
// });

export default router;
