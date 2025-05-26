"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = void 0;
const zod_1 = require("zod");
const auth = __importStar(require("../services/auth"));
const client_1 = __importDefault(require("../client"));
const login = async (req, res) => {
    const loginSchema = zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string(),
    });
    const body = loginSchema.safeParse(req.body);
    if (!body.success) {
        res.status(400).json({ error: "Dados inválidos" });
        return;
    }
    const { email, password } = body.data;
    const user = await auth.validateUser(email, password);
    if (!user) {
        res.status(403).json({ error: "Email ou senha incorretos" });
        return;
    }
    const token = auth.createToken(user.id);
    res.json({ token });
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ error: "Usuário não autenticado" });
            return;
        }
        const user = await client_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
            },
        });
        if (!user) {
            res.status(404).json({ error: "Usuário não encontrado" });
            return;
        }
        res.json(user); // sem return aqui
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuário" });
    }
};
exports.getMe = getMe;
