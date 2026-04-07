"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const publicUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: 'department' in user ? user.department : undefined,
});
const register = async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ message: 'Validation failed', errors: errors.array() });
            return;
        }
        const { name, email, password, role, department } = req.body;
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(409).json({ message: 'A user with this email already exists' });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 12);
        const user = await User_1.default.create({ name, email, password: hashedPassword, role, department });
        const token = (0, generateToken_1.default)({ id: user._id.toString(), role: user.role });
        res.status(201).json({ token, user: publicUser(user) });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ message: 'Validation failed', errors: errors.array() });
            return;
        }
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email }).select('+password');
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        const passwordMatches = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatches) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        const token = (0, generateToken_1.default)({ id: user._id.toString(), role: user.role });
        res.status(200).json({ token, user: publicUser(user) });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
