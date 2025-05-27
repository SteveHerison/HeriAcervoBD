import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import router from "./src/routes";
import path from "path";
import fs from "fs";

dotenv.config();

const app = express();

const allowedOrigins = [
  "https://heri-acervo.vercel.app",
  "http://localhost:3000",
  "https://acervoocupacional.vercel.app",
];

// Cria pasta uploads se não existir
const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log("Pasta uploads criada.");
}

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

// Servir arquivos estáticos
app.use("/uploads", express.static(uploadsPath));

app.use("/", router);

const runServer = (port: number, server: http.Server) => {
  server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
};

const regularServer = http.createServer(app);
const port = process.env.PORT ? parseInt(process.env.PORT) : 9000;
runServer(port, regularServer);
