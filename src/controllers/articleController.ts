import { Request, Response } from "express";
import prisma from "../client";

export const createArticle = async (req: Request, res: Response) => {
  const { title, author, description, url, image, category } = req.body;
  try {
    const article = await prisma.article.create({
      data: { title, author, description, url, image, category },
    });
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar artigo" });
  }
};

export const getArticles = async (req: Request, res: Response) => {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(articles);
};
