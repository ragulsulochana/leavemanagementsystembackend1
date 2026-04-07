import { Router } from 'express'
import { body, param } from 'express-validator'
import {
  applyLeave,
  finalApproveLeave,
  getHodApprovedLeaves,
  getMyLeaves,
  getPendingLeaves,
  getStaffApprovedLeaves,
  hodApproveLeave,
  rejectLeave,
  staffApproveLeave,
} from '../controllers/leaveController'
import { authMiddleware } from '../middleware/authMiddleware'
import { roleMiddleware } from '../middleware/roleMiddleware'

const router = Router()

const mongoIdValidator = [param('id').isMongoId().withMessage('A valid leave id is required')]

router.use(authMiddleware)

router.post(
  '/apply',
  roleMiddleware('student'),
  [
    body('fromDate').isISO8601().toDate().withMessage('fromDate must be a valid ISO date'),
    body('department').trim().isLength({ min: 2, max: 120 }).withMessage('Department must be 2 to 120 characters'),
    body('leaveType').trim().isLength({ min: 2, max: 80 }).withMessage('Leave type must be 2 to 80 characters'),
    body('toDate')
      .isISO8601()
      .toDate()
      .withMessage('toDate must be a valid ISO date')
      .custom((toDate, { req }) => {
        if (new Date(toDate) < new Date(req.body.fromDate)) {
          throw new Error('toDate must be on or after fromDate')
        }
        return true
      }),
    body('reason').trim().isLength({ min: 5, max: 1000 }).withMessage('Reason must be 5 to 1000 characters'),
    body('proof').optional().isURL().withMessage('proof must be a valid URL when provided'),
  ],
  applyLeave,
)

router.get('/my', roleMiddleware('student'), getMyLeaves)

router.get('/pending', roleMiddleware('staff'), getPendingLeaves)
router.put('/:id/staff-approve', roleMiddleware('staff'), mongoIdValidator, staffApproveLeave)
router.put('/:id/reject', roleMiddleware('staff', 'hod', 'principal'), mongoIdValidator, rejectLeave)

router.get('/staff-approved', roleMiddleware('hod'), getStaffApprovedLeaves)
router.put('/:id/hod-approve', roleMiddleware('hod'), mongoIdValidator, hodApproveLeave)

router.get('/hod-approved', roleMiddleware('principal'), getHodApprovedLeaves)
router.put('/:id/final-approve', roleMiddleware('principal'), mongoIdValidator, finalApproveLeave)

export default router
