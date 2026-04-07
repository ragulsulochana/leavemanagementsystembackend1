import { NextFunction, Response } from 'express'
import { validationResult } from 'express-validator'
import Leave, { LeaveStatus } from '../models/Leave'
import { AuthRequest } from '../middleware/authMiddleware'

const populateStudent = {
  path: 'studentId',
  select: 'name email role',
}

const hasValidationErrors = (req: AuthRequest, res: Response): boolean => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ message: 'Validation failed', errors: errors.array() })
    return true
  }
  return false
}

const updateLeaveApproval = async (
  res: Response,
  id: string,
  expectedStatus: LeaveStatus,
  nextStatus: LeaveStatus,
  approvalKey: 'staff' | 'hod' | 'principal',
): Promise<void> => {
  const leave = await Leave.findById(id)

  if (!leave) {
    res.status(404).json({ message: 'Leave request not found' })
    return
  }

  if (leave.status === 'rejected') {
    res.status(409).json({ message: 'Rejected leave requests cannot be approved' })
    return
  }

  if (leave.status !== expectedStatus) {
    res.status(409).json({ message: `Leave must be in ${expectedStatus} status before this approval` })
    return
  }

  leave.status = nextStatus
  leave.approvals[approvalKey] = true
  await leave.save()

  const populatedLeave = await leave.populate(populateStudent)
  res.status(200).json(populatedLeave)
}

export const applyLeave = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ message: 'Validation failed', errors: errors.array() })
      return
    }

    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' })
      return
    }

    const { department, leaveType, fromDate, toDate, reason, proof } = req.body
    const leave = await Leave.create({
      studentId: req.user._id,
      department,
      leaveType,
      fromDate,
      toDate,
      reason,
      proof,
      status: 'pending',
      approvals: {
        staff: false,
        hod: false,
        principal: false,
      },
    })

    const populatedLeave = await leave.populate(populateStudent)
    res.status(201).json(populatedLeave)
  } catch (error) {
    next(error)
  }
}

export const getMyLeaves = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' })
      return
    }

    const leaves = await Leave.find({ studentId: req.user._id }).sort({ createdAt: -1 }).populate(populateStudent)
    res.status(200).json(leaves)
  } catch (error) {
    next(error)
  }
}

export const getPendingLeaves = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const leaves = await Leave.find({ status: 'pending' }).sort({ createdAt: -1 }).populate(populateStudent)
    res.status(200).json(leaves)
  } catch (error) {
    next(error)
  }
}

export const staffApproveLeave = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (hasValidationErrors(req, res)) return
    await updateLeaveApproval(res, req.params.id as string, 'pending', 'staffApproved', 'staff')
  } catch (error) {
    next(error)
  }
}

export const rejectLeave = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (hasValidationErrors(req, res)) return
    const leave = await Leave.findById(req.params.id)

    if (!leave) {
      res.status(404).json({ message: 'Leave request not found' })
      return
    }

    if (leave.status === 'approved') {
      res.status(409).json({ message: 'Approved leave requests cannot be rejected' })
      return
    }

    leave.status = 'rejected'
    await leave.save()

    const populatedLeave = await leave.populate(populateStudent)
    res.status(200).json(populatedLeave)
  } catch (error) {
    next(error)
  }
}

export const getStaffApprovedLeaves = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const leaves = await Leave.find({ status: 'staffApproved' }).sort({ createdAt: -1 }).populate(populateStudent)
    res.status(200).json(leaves)
  } catch (error) {
    next(error)
  }
}

export const hodApproveLeave = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (hasValidationErrors(req, res)) return
    await updateLeaveApproval(res, req.params.id as string, 'staffApproved', 'hodApproved', 'hod')
  } catch (error) {
    next(error)
  }
}

export const getHodApprovedLeaves = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const leaves = await Leave.find({ status: 'hodApproved' }).sort({ createdAt: -1 }).populate(populateStudent)
    res.status(200).json(leaves)
  } catch (error) {
    next(error)
  }
}

export const finalApproveLeave = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (hasValidationErrors(req, res)) return
    await updateLeaveApproval(res, req.params.id as string, 'hodApproved', 'approved', 'principal')
  } catch (error) {
    next(error)
  }
}
