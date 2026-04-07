"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
