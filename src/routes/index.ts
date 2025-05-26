import { Router } from "express";
import {
  createArticle,
  getArticles,
  getArticlesByCategory,
  getCategories,
} from "../controllers/articleController";
import { upload } from "../middlewares/upload";
import { authMiddleware } from "../middlewares/auth";
import * as auth from "../controllers/authController";
import { register } from "../controllers/userController";

const router = Router();

router.post("/login", auth.login);
router.post("/register", register);

// ✅ Rota protegida por token
router.post("/articles", authMiddleware, upload.single("image"), createArticle);
router.get("/me", authMiddleware, auth.getMe);

// ✅ A rota de leitura pode continuar pública (ou proteger também, se quiser)
router.get("/articles", getArticles);
router.get("/articles/category/:categoryId", getArticlesByCategory);
router.get("/categories", getCategories);

export default router;
