import { Router } from "express";
import { upload } from "../middlewares/upload";
import { authMiddleware } from "../middlewares/auth";
import * as auth from "../controllers/authController";
import { register } from "../controllers/userController";
import { createArticle } from "../controllers/articleController";

const privateRouter = Router();

privateRouter.post("/login", auth.login);
privateRouter.post("/register", register);
privateRouter.get("/me", authMiddleware, auth.getMe);
privateRouter.post(
  "/articles",
  authMiddleware,
  upload.single("image"),
  createArticle
);

export default privateRouter;
