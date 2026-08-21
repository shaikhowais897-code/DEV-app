import { body } from 'express-validator';

export const createMovieRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('synopsis')
    .trim()
    .notEmpty()
    .withMessage('Synopsis is required')
    .isLength({ max: 2000 })
    .withMessage('Synopsis cannot exceed 2000 characters'),
  body('year')
    .notEmpty()
    .withMessage('Year is required')
    .isInt({ min: 1900, max: 2100 })
    .withMessage('Year must be between 1900 and 2100'),
  body('duration')
    .trim()
    .notEmpty()
    .withMessage('Duration is required'),
  body('durationSeconds')
    .notEmpty()
    .withMessage('Duration in seconds is required')
    .isInt({ min: 1 })
    .withMessage('Duration must be positive'),
  body('genre')
    .isArray({ min: 1 })
    .withMessage('At least one genre is required'),
  body('director')
    .trim()
    .notEmpty()
    .withMessage('Director is required'),
  body('accessLevel')
    .optional()
    .isIn(['free', 'premium'])
    .withMessage('Access level must be free or premium'),
  body('contentType')
    .optional()
    .isIn(['movie', 'series', 'anime', 'documentary'])
    .withMessage('Invalid content type'),
];

export const updateMovieRules = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('synopsis')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Synopsis cannot exceed 2000 characters'),
  body('year')
    .optional()
    .isInt({ min: 1900, max: 2100 })
    .withMessage('Year must be between 1900 and 2100'),
  body('accessLevel')
    .optional()
    .isIn(['free', 'premium'])
    .withMessage('Access level must be free or premium'),
  body('contentType')
    .optional()
    .isIn(['movie', 'series', 'anime', 'documentary'])
    .withMessage('Invalid content type'),
];
