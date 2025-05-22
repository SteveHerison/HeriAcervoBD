import { Request, Response } from "express";
import prisma from "../client";

export const createArticle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, author, description, url, category } = req.body;
    const categoryId = Number(category);

    if (isNaN(categoryId)) {
      res.status(400).json({ error: "ID da categoria inválido." });
      return;
    }

    const foundCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!foundCategory) {
      res.status(400).json({ error: "Categoria não encontrada." });
      return;
    }

    const image = req.file?.filename ?? ""; // ✅ Usa o nome do arquivo enviado, ou string vazia

    const article = await prisma.article.create({
      data: {
        title,
        author,
        description,
        url,
        image,
        category: {
          connect: { id: categoryId },
        },
      },
      include: {
        category: true,
      },
    });

    res.json(article);
  } catch (error) {
    console.error("Erro ao criar artigo:", error);
    res.status(500).json({ error: "Erro ao criar artigo" });
  }
};

export const getArticles = async (req: Request, res: Response) => {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });

    res.json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar artigos" });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar categorias" });
  }
};

export const getArticlesByCategory = async (req: Request, res: Response) => {
  const categoryId = parseInt(req.params.categoryId);

  try {
    const articles = await prisma.article.findMany({
      where: { categoryId },
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });

    res.json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar artigos por categoria" });
  }
};
// async function createCategories() {
//   const categories = [
//     "Reabilitação física",
//     "Saúde mental",
//     "Neurodesenvolvimento/Infância",
//     "Gerontologia",
//     "Saúde coletiva",
//     "Educação & Inclusão escolar",
//     "Tecnologias assistivas",
//     "Saúde do trabalhador",
//   ];

//   for (const name of categories) {
//     await prisma.category.upsert({
//       where: { name },
//       update: {},
//       create: { name },
//     });
//     console.log(`Categoria "${name}" criada ou já existe.`);
//   }
// }

// createCategories()
//   .catch(console.error)
//   .finally(() => process.exit());
