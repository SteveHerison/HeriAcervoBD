"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const articleController_1 = require("../controllers/articleController");
const upload_1 = require("../middlewares/upload");
const auth_1 = require("../middlewares/auth");
const auth = __importStar(require("../controllers/authController"));
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.post("/login", auth.login);
router.post("/register", userController_1.register);
// ✅ Rota protegida por token
router.post("/articles", auth_1.authMiddleware, upload_1.upload.single("image"), articleController_1.createArticle);
router.get("/me", auth_1.authMiddleware, auth.getMe);
// ✅ A rota de leitura pode continuar pública (ou proteger também, se quiser)
router.get("/articles", articleController_1.getArticles);
router.get("/articles/category/:categoryId", articleController_1.getArticlesByCategory);
router.get("/categories", articleController_1.getCategories);
exports.default = router;
