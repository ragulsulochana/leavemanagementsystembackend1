"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const leaveController_1 = require("../controllers/leaveController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = (0, express_1.Router)();
const mongoIdValidator = [(0, express_validator_1.param)('id').isMongoId().withMessage('A valid leave id is required')];
router.use(authMiddleware_1.authMiddleware);
router.post('/apply', (0, roleMiddleware_1.roleMiddleware)('student'), [
    (0, express_validator_1.body)('fromDate').isISO8601().toDate().withMessage('fromDate must be a valid ISO date'),
    (0, express_validator_1.body)('department').trim().isLength({ min: 2, max: 120 }).withMessage('Department must be 2 to 120 characters'),
    (0, express_validator_1.body)('leaveType').trim().isLength({ min: 2, max: 80 }).withMessage('Leave type must be 2 to 80 characters'),
    (0, express_validator_1.body)('toDate')
        .isISO8601()
        .toDate()
        .withMessage('toDate must be a valid ISO date')
        .custom((toDate, { req }) => {
        if (new Date(toDate) < new Date(req.body.fromDate)) {
            throw new Error('toDate must be on or after fromDate');
        }
        return true;
    }),
    (0, express_validator_1.body)('reason').trim().isLength({ min: 5, max: 1000 }).withMessage('Reason must be 5 to 1000 characters'),
    (0, express_validator_1.body)('proof').optional().isURL().withMessage('proof must be a valid URL when provided'),
], leaveController_1.applyLeave);
router.get('/my', (0, roleMiddleware_1.roleMiddleware)('student'), leaveController_1.getMyLeaves);
router.get('/pending', (0, roleMiddleware_1.roleMiddleware)('staff'), leaveController_1.getPendingLeaves);
router.put('/:id/staff-approve', (0, roleMiddleware_1.roleMiddleware)('staff'), mongoIdValidator, leaveController_1.staffApproveLeave);
router.put('/:id/reject', (0, roleMiddleware_1.roleMiddleware)('staff', 'hod', 'principal'), mongoIdValidator, leaveController_1.rejectLeave);
router.get('/staff-approved', (0, roleMiddleware_1.roleMiddleware)('hod'), leaveController_1.getStaffApprovedLeaves);
router.put('/:id/hod-approve', (0, roleMiddleware_1.roleMiddleware)('hod'), mongoIdValidator, leaveController_1.hodApproveLeave);
router.get('/hod-approved', (0, roleMiddleware_1.roleMiddleware)('principal'), leaveController_1.getHodApprovedLeaves);
router.put('/:id/final-approve', (0, roleMiddleware_1.roleMiddleware)('principal'), mongoIdValidator, leaveController_1.finalApproveLeave);
exports.default = router;
