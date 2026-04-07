import { NextFunction, Response } from 'express'
import { AuthRequest } from './authMiddleware'
import { UserRole } from '../models/User'

export const roleMiddleware = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' })
      return
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ message: 'You are not authorized to access this resource' })
      return
    }

    next()
  }
}
