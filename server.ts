import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import router from "./src/routes";
import path from "path";

dotenv.config();
const app = express();

const allowedOrigins = [
  "https://acervoocupacional.vercel.app", // domínio principal
  "http://localhost:3000", // desenvolvimento local
  "https://heri-acervo.vercel.app", // domínio alternativo
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // permite ferramentas como Postman ou curl
      if (allowedOrigins.includes(origin)) {
        // retorna a origem da requisição para o cabeçalho Access-Control-Allow-Origin
        return callback(null, origin);
      } else {
        const msg = `CORS bloqueado para a origem: ${origin}`;
        return callback(new Error(msg), false);
      }
    },
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
