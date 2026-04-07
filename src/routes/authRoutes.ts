import { Router } from 'express'
import { body } from 'express-validator'
import { login, register } from '../controllers/authController'

const router = Router()

router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role').isIn(['student', 'staff', 'hod', 'principal']).withMessage('Role must be student, staff, hod, or principal'),
    body('department').optional().trim().isLength({ min: 2, max: 120 }).withMessage('Department must be 2 to 120 characters'),
  ],
  register,
)

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login,
)

export default router
