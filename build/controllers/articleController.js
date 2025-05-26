"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArticlesByCategory = exports.getCategories = exports.getArticles = exports.createArticle = void 0;
const client_1 = __importDefault(require("../client"));
const createArticle = async (req, res) => {
    try {
        const { title, author, description, url, category } = req.body;
        const categoryId = Number(category);
        if (isNaN(categoryId)) {
            res.status(400).json({ error: "ID da categoria inválido." });
            return;
        }
        const foundCategory = await client_1.default.category.findUnique({
            where: { id: categoryId },
        });
        if (!foundCategory) {
            res.status(400).json({ error: "Categoria não encontrada." });
            return;
        }
        const image = req.file?.filename ?? ""; // ✅ Usa o nome do arquivo enviado, ou string vazia
        const article = await client_1.default.article.create({
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
    }
    catch (error) {
        console.error("Erro ao criar artigo:", error);
        res.status(500).json({ error: "Erro ao criar artigo" });
    }
};
exports.createArticle = createArticle;
const getArticles = async (req, res) => {
    try {
        const articles = await client_1.default.article.findMany({
            orderBy: { createdAt: "desc" },
            include: { category: true },
        });
        res.json(articles);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar artigos" });
    }
};
exports.getArticles = getArticles;
const getCategories = async (req, res) => {
    try {
        const categories = await client_1.default.category.findMany({
            orderBy: { name: "asc" },
        });
        res.json(categories);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar categorias" });
    }
};
exports.getCategories = getCategories;
const getArticlesByCategory = async (req, res) => {
    const categoryId = parseInt(req.params.categoryId);
    try {
        const articles = await client_1.default.article.findMany({
            where: { categoryId },
            orderBy: { createdAt: "desc" },
            include: { category: true },
        });
        res.json(articles);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar artigos por categoria" });
    }
};
exports.getArticlesByCategory = getArticlesByCategory;
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
