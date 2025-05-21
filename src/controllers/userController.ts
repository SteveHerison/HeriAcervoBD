import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../client";
import { z } from "zod";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response): Promise<void> => {
  const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const body = registerSchema.safeParse(req.body);

  if (!body.success) {
    res.status(400).json({ error: "Dados inválidos" });
    return;
  }

  const { email, password } = body.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    res.status(400).json({ message: "E-mail já cadastrado" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  res.status(201).json({
    message: "Usuário criado com sucesso",
    token,
  });
};
