import { RequestHandler } from "express";
import { z } from "zod";
import * as auth from "../services/auth";
import prisma from "../client";
import { Request, Response } from "express";

export const login: RequestHandler = async (req, res) => {
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
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

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as Request & { userId?: number }).userId;

    if (!userId) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const user = await prisma.user.findUnique({
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
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
};
