"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const auth_1 = require("../services/auth");
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Token não fornecido" });
        return;
    }
    const token = authHeader.split(" ")[1];
    const payload = (0, auth_1.validateToken)(token);
    if (!payload) {
        res.status(403).json({ error: "Token inválido ou expirado" });
        return;
    }
    req.userId = payload.userId;
    next();
};
exports.authMiddleware = authMiddleware;
