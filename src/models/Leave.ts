import { Document, Schema, Types, model } from 'mongoose'

export type LeaveStatus = 'pending' | 'staffApproved' | 'hodApproved' | 'approved' | 'rejected'

export interface ILeave extends Document {
  studentId: Types.ObjectId
  department: string
  leaveType: string
  fromDate: Date
  toDate: Date
  reason: string
  proof?: string
  status: LeaveStatus
  approvals: {
    staff: boolean
    hod: boolean
    principal: boolean
  }
  createdAt: Date
  updatedAt: Date
}

const leaveSchema = new Schema<ILeave>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      default: 'General',
    },
    leaveType: {
      type: String,
      required: [true, 'Leave type is required'],
      trim: true,
      default: 'Casual',
    },
    fromDate: {
      type: Date,
      required: [true, 'From date is required'],
    },
    toDate: {
      type: Date,
      required: [true, 'To date is required'],
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
      minlength: [5, 'Reason must be at least 5 characters'],
      maxlength: [1000, 'Reason must be 1000 characters or less'],
    },
    proof: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'staffApproved', 'hodApproved', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    approvals: {
      staff: { type: Boolean, default: false },
      hod: { type: Boolean, default: false },
      principal: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
)

leaveSchema.index({ studentId: 1, createdAt: -1 })
leaveSchema.index({ status: 1, createdAt: -1 })

const Leave = model<ILeave>('Leave', leaveSchema)

export default Leave
