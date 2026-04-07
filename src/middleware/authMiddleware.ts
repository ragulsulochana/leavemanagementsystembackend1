import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User, { IUser, UserRole } from '../models/User'

export interface AuthRequest extends Request {
  user?: Pick<IUser, '_id' | 'name' | 'email' | 'role'>
}

type JwtPayload = {
  id: string
  role: UserRole
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authentication token is required' })
      return
    }

    const token = authHeader.split(' ')[1]
    const secret = process.env.JWT_SECRET

    if (!secret) {
      res.status(500).json({ message: 'JWT_SECRET is not configured' })
      return
    }

    const decoded = jwt.verify(token, secret) as JwtPayload
    const user = await User.findById(decoded.id).select('_id name email role')

    if (!user) {
      res.status(401).json({ message: 'User no longer exists' })
      return
    }

    req.user = user
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}
