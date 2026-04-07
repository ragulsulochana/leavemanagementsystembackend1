"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHods = exports.getStaff = exports.getStudents = void 0;
const User_1 = __importDefault(require("../models/User"));
const listUsersByRole = async (role, res) => {
    const users = await User_1.default.find({ role })
        .select('_id name email role department createdAt')
        .sort({ createdAt: -1 });
    res.status(200).json(users.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        createdAt: user.createdAt,
    })));
};
const getStudents = async (_req, res, next) => {
    try {
        await listUsersByRole('student', res);
    }
    catch (error) {
        next(error);
    }
};
exports.getStudents = getStudents;
const getStaff = async (_req, res, next) => {
    try {
        await listUsersByRole('staff', res);
    }
    catch (error) {
        next(error);
    }
};
exports.getStaff = getStaff;
const getHods = async (_req, res, next) => {
    try {
        await listUsersByRole('hod', res);
    }
    catch (error) {
        next(error);
    }
};
exports.getHods = getHods;
