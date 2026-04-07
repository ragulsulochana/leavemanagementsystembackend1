"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (payload) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not configured');
    }
    const options = {
        expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d'),
    };
    return jsonwebtoken_1.default.sign(payload, secret, options);
};
exports.default = generateToken;
