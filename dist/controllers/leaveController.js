"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalApproveLeave = exports.getHodApprovedLeaves = exports.hodApproveLeave = exports.getStaffApprovedLeaves = exports.rejectLeave = exports.staffApproveLeave = exports.getPendingLeaves = exports.getMyLeaves = exports.applyLeave = void 0;
const express_validator_1 = require("express-validator");
const Leave_1 = __importDefault(require("../models/Leave"));
const populateStudent = {
    path: 'studentId',
    select: 'name email role',
};
const hasValidationErrors = (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Validation failed', errors: errors.array() });
        return true;
    }
    return false;
};
const updateLeaveApproval = async (res, id, expectedStatus, nextStatus, approvalKey) => {
    const leave = await Leave_1.default.findById(id);
    if (!leave) {
        res.status(404).json({ message: 'Leave request not found' });
        return;
    }
    if (leave.status === 'rejected') {
        res.status(409).json({ message: 'Rejected leave requests cannot be approved' });
        return;
    }
    if (leave.status !== expectedStatus) {
        res.status(409).json({ message: `Leave must be in ${expectedStatus} status before this approval` });
        return;
    }
    leave.status = nextStatus;
    leave.approvals[approvalKey] = true;
    await leave.save();
    const populatedLeave = await leave.populate(populateStudent);
    res.status(200).json(populatedLeave);
};
const applyLeave = async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ message: 'Validation failed', errors: errors.array() });
            return;
        }
        if (!req.user) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }
        const { department, leaveType, fromDate, toDate, reason, proof } = req.body;
        const leave = await Leave_1.default.create({
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
        });
        const populatedLeave = await leave.populate(populateStudent);
        res.status(201).json(populatedLeave);
    }
    catch (error) {
        next(error);
    }
};
exports.applyLeave = applyLeave;
const getMyLeaves = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }
        const leaves = await Leave_1.default.find({ studentId: req.user._id }).sort({ createdAt: -1 }).populate(populateStudent);
        res.status(200).json(leaves);
    }
    catch (error) {
        next(error);
    }
};
exports.getMyLeaves = getMyLeaves;
const getPendingLeaves = async (_req, res, next) => {
    try {
        const leaves = await Leave_1.default.find({ status: 'pending' }).sort({ createdAt: -1 }).populate(populateStudent);
        res.status(200).json(leaves);
    }
    catch (error) {
        next(error);
    }
};
exports.getPendingLeaves = getPendingLeaves;
const staffApproveLeave = async (req, res, next) => {
    try {
        if (hasValidationErrors(req, res))
            return;
        await updateLeaveApproval(res, req.params.id, 'pending', 'staffApproved', 'staff');
    }
    catch (error) {
        next(error);
    }
};
exports.staffApproveLeave = staffApproveLeave;
const rejectLeave = async (req, res, next) => {
    try {
        if (hasValidationErrors(req, res))
            return;
        const leave = await Leave_1.default.findById(req.params.id);
        if (!leave) {
            res.status(404).json({ message: 'Leave request not found' });
            return;
        }
        if (leave.status === 'approved') {
            res.status(409).json({ message: 'Approved leave requests cannot be rejected' });
            return;
        }
        leave.status = 'rejected';
        await leave.save();
        const populatedLeave = await leave.populate(populateStudent);
        res.status(200).json(populatedLeave);
    }
    catch (error) {
        next(error);
    }
};
exports.rejectLeave = rejectLeave;
const getStaffApprovedLeaves = async (_req, res, next) => {
    try {
        const leaves = await Leave_1.default.find({ status: 'staffApproved' }).sort({ createdAt: -1 }).populate(populateStudent);
        res.status(200).json(leaves);
    }
    catch (error) {
        next(error);
    }
};
exports.getStaffApprovedLeaves = getStaffApprovedLeaves;
const hodApproveLeave = async (req, res, next) => {
    try {
        if (hasValidationErrors(req, res))
            return;
        await updateLeaveApproval(res, req.params.id, 'staffApproved', 'hodApproved', 'hod');
    }
    catch (error) {
        next(error);
    }
};
exports.hodApproveLeave = hodApproveLeave;
const getHodApprovedLeaves = async (_req, res, next) => {
    try {
        const leaves = await Leave_1.default.find({ status: 'hodApproved' }).sort({ createdAt: -1 }).populate(populateStudent);
        res.status(200).json(leaves);
    }
    catch (error) {
        next(error);
    }
};
exports.getHodApprovedLeaves = getHodApprovedLeaves;
const finalApproveLeave = async (req, res, next) => {
    try {
        if (hasValidationErrors(req, res))
            return;
        await updateLeaveApproval(res, req.params.id, 'hodApproved', 'approved', 'principal');
    }
    catch (error) {
        next(error);
    }
};
exports.finalApproveLeave = finalApproveLeave;
