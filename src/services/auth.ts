import jwt from "jsonwebtoken";

import prisma from "../client";
import bcrypt from "bcryptjs";

export const validateUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) return null;

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return null;

  return user;
};

export const createToken = (userId: number): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
};

export const validateToken = (token: string): { userId: number } | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };
    return decoded;
  } catch (error) {
    return null;
  }
};
