"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const leaveRoutes_1 = __importDefault(require("./routes/leaveRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: process.env.CLIENT_URL ?? '*', credentials: true }));
app.use(express_1.default.json({ limit: '1mb' }));
app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok', service: 'leave-management-api' });
});
app.use('/api/auth', authRoutes_1.default);
app.use('/api/leaves', leaveRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use(errorMiddleware_1.notFound);
app.use(errorMiddleware_1.errorMiddleware);
exports.default = app;
