import { NextFunction, Response } from 'express'
import User, { UserRole } from '../models/User'
import { AuthRequest } from '../middleware/authMiddleware'

const listUsersByRole = async (role: UserRole, res: Response): Promise<void> => {
  const users = await User.find({ role })
    .select('_id name email role department createdAt')
    .sort({ createdAt: -1 })

  res.status(200).json(
    users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      createdAt: user.createdAt,
    })),
  )
}

export const getStudents = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await listUsersByRole('student', res)
  } catch (error) {
    next(error)
  }
}

export const getStaff = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await listUsersByRole('staff', res)
  } catch (error) {
    next(error)
  }
}

export const getHods = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await listUsersByRole('hod', res)
  } catch (error) {
    next(error)
  }
}
