"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const leaveSchema = new mongoose_1.Schema({
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { timestamps: true });
leaveSchema.index({ studentId: 1, createdAt: -1 });
leaveSchema.index({ status: 1, createdAt: -1 });
const Leave = (0, mongoose_1.model)('Leave', leaveSchema);
exports.default = Leave;
