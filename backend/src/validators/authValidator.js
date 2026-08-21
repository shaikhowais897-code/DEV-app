import { body } from 'express-validator';

export const registerRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('plan')
    .optional()
    .isIn(['Free', 'Premium 4K HDR', 'Family VIP'])
    .withMessage('Invalid plan'),
];

export const loginRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const refreshTokenRules = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required'),
];

export const updateProfileRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('preferredQuality')
    .optional()
    .isIn(['Auto', '4K', '1080p', '720p'])
    .withMessage('Invalid quality preference'),
  body('preferredAudio')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Audio preference too long'),
  body('preferredSubtitle')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Subtitle preference too long'),
  body('autoplayNext')
    .optional()
    .isBoolean()
    .withMessage('autoplayNext must be a boolean'),
];
