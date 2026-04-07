"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = exports.notFound = void 0;
const notFound = (req, res, next) => {
    const error = new Error(`Route not found: ${req.originalUrl}`);
    res.status(404);
    next(error);
};
exports.notFound = notFound;
const errorMiddleware = (err, _req, res, _next) => {
    const errorMessage = err.message || 'Internal server error';
    const isDatabaseConnectionError = err.name === 'MongooseServerSelectionError' ||
        err.name === 'MongoServerSelectionError' ||
        /getaddrinfo|ENOTFOUND|ETIMEDOUT|ECONNREFUSED|ReplicaSetNoPrimary/i.test(errorMessage);
    if (isDatabaseConnectionError) {
        res.status(503).json({
            message: 'Database connection unavailable. Add your current IP address to MongoDB Atlas Network Access and make sure port 27017 is not blocked.',
            detail: process.env.NODE_ENV === 'production' ? undefined : errorMessage,
        });
        return;
    }
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: errorMessage,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
};
exports.errorMiddleware = errorMiddleware;
