import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import router from "./src/routes";
import path from "path";

dotenv.config();
const app = express();

const allowedOrigins = [
  "https://heri-acervo.vercel.app", // domínio alternativo
  "http://localhost:3000", // desenvolvimento local
  "https://acervoocupacional.vercel.app", // domínio principal
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Middleware para JSON
app.use(express.json());

// Servir arquivos estáticos (como imagens)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Suas rotas
app.use("/", router);

// Inicializar servidor
const runServer = (port: number, server: http.Server) => {
  server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
};

const regularServer = http.createServer(app);
const port = process.env.PORT ? parseInt(process.env.PORT) : 9000;
runServer(port, regularServer);
