"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const startServer = async () => {
    await (0, db_1.default)();
    const port = process.env.PORT ?? 5000;
    app_1.default.listen(port, () => {
        console.log(`Leave Management API running on port ${port}`);
    });
};
startServer().catch((error) => {
    console.error('Server startup failed:', error);
    process.exit(1);
});
