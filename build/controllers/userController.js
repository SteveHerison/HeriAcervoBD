"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = __importDefault(require("../client"));
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = async (req, res) => {
    try {
        const registerSchema = zod_1.z.object({
            email: zod_1.z.string().email(),
            password: zod_1.z.string().min(6),
        });
        const body = registerSchema.safeParse(req.body);
        if (!body.success) {
            res.status(400).json({ error: "Dados inválidos" });
            return;
        }
        const { email, password } = body.data;
        const existingUser = await client_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: "E-mail já cadastrado" });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = await client_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        const token = jsonwebtoken_1.default.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(201).json({
            message: "Usuário criado com sucesso",
            token,
        });
    }
    catch (error) {
        console.error("Erro interno ao registrar usuário:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};
exports.register = register;
