import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import router from "./src/routes";
import path from "path"; // ✅ Adicione isso

dotenv.config();
const app = express();

// const allowedOrigins = [
//   "http://localhost:3000", // para desenvolvimento local
//   "https://acervoocupacional.vercel.app", // principal em produção
//   "https://heri-acervo.vercel.app", // outro domínio
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true); // permite requisições sem origin (ex: Postman)
//       if (allowedOrigins.indexOf(origin) === -1) {
//         const msg = `O CORS para a origem ${origin} não é permitido.`;
//         return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     },
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

// ✅ Aqui você adiciona o middleware para servir as imagens
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
