import jwt, { SignOptions } from 'jsonwebtoken'
import { UserRole } from '../models/User'

type TokenPayload = {
  id: string
  role: UserRole
}

const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET is not configured')
  }

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as SignOptions['expiresIn'],
  }

  return jwt.sign(payload, secret, options)
}

export default generateToken
