import { Document, Model, Schema, model } from 'mongoose'

export type UserRole = 'student' | 'staff' | 'hod' | 'principal'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: UserRole
  department?: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'staff', 'hod', 'principal'],
      default: 'student',
      required: true,
    },
    department: {
      type: String,
      trim: true,
      default: 'General',
    },
  },
  { timestamps: true },
)

const User: Model<IUser> = model<IUser>('User', userSchema)

export default User
