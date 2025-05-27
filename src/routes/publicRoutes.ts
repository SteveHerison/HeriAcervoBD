import { Router } from "express";
import {
  getArticles,
  getArticlesByCategory,
  getCategories,
} from "../controllers/articleController";

const publicRouter = Router();

publicRouter.get("/articles", getArticles);
publicRouter.get("/articles/category/:categoryId", getArticlesByCategory);
publicRouter.get("/categories", getCategories);

export default publicRouter;
