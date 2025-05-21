import { Request, Response, NextFunction } from "express";
import { validateToken } from "../services/auth";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token não fornecido" });
    return;
  }

  const token = authHeader.split(" ")[1];
  const payload = validateToken(token);

  if (!payload) {
    res.status(403).json({ error: "Token inválido ou expirado" });
    return;
  }

  (req as any).userId = payload.userId;

  next();
};
