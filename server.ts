import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import router from "./src/routes";
import path from "path";

dotenv.config();
const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://acervoocupacional.vercel.app",
  "https://heri-acervo.vercel.app",
];

// 🔒 CORS restrito com suporte a credenciais
const restrictedCors = cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      const msg = `🚫 CORS bloqueado para origem: ${origin}`;
      return callback(new Error(msg), false);
    }
  },
  credentials: true,
});

// 🔓 CORS aberto (sem cookies) para rotas públicas
const openCors = cors({ origin: "*" });

app.use(express.json());

// 🖼️ Servir imagens
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔓 Rotas públicas com CORS aberto
app.get("/articles", openCors);
app.get("/articles/category/:categoryId", openCors);
app.get("/categories", openCors);

// 🔐 Todas as demais rotas usam CORS restrito
app.use("/", restrictedCors, router);

// 🚀 Iniciar servidor
const runServer = (port: number, server: http.Server) => {
  server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
};

const regularServer = http.createServer(app);
const port = process.env.PORT ? parseInt(process.env.PORT) : 9000;
runServer(port, regularServer);
