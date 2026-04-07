"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.post('/register', [
    (0, express_validator_1.body)('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    (0, express_validator_1.body)('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    (0, express_validator_1.body)('role').isIn(['student', 'staff', 'hod', 'principal']).withMessage('Role must be student, staff, hod, or principal'),
    (0, express_validator_1.body)('department').optional().trim().isLength({ min: 2, max: 120 }).withMessage('Department must be 2 to 120 characters'),
], authController_1.register);
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
], authController_1.login);
exports.default = router;
