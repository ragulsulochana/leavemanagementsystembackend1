import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import User from '../models/User'
import generateToken from '../utils/generateToken'

const publicUser = (user: { _id: unknown; name: string; email: string; role: string }) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  department: 'department' in user ? user.department : undefined,
})

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ message: 'Validation failed', errors: errors.array() })
      return
    }

    const { name, email, password, role, department } = req.body
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      res.status(409).json({ message: 'A user with this email already exists' })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await User.create({ name, email, password: hashedPassword, role, department })
    const token = generateToken({ id: user._id.toString(), role: user.role })

    res.status(201).json({ token, user: publicUser(user) })
  } catch (error) {
    next(error)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ message: 'Validation failed', errors: errors.array() })
      return
    }

    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' })
      return
    }

    const passwordMatches = await bcrypt.compare(password, user.password)

    if (!passwordMatches) {
      res.status(401).json({ message: 'Invalid email or password' })
      return
    }

    const token = generateToken({ id: user._id.toString(), role: user.role })

    res.status(200).json({ token, user: publicUser(user) })
  } catch (error) {
    next(error)
  }
}
