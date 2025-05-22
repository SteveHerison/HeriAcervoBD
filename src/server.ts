import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import router from "./routes/index.router";
import path from "path"; // ✅ Adicione isso

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// ✅ Aqui você adiciona o middleware para servir as imagens
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// ✅ Depois disso, registre as rotas da aplicação
app.use("/", router);

// 🔁 Inicialização do servidor
const runServer = (port: number, server: http.Server) => {
  server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
};

const regularServer = http.createServer(app);
const port = process.env.PORT ? parseInt(process.env.PORT) : 9000;
runServer(port, regularServer);
