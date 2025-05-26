"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const index_router_1 = __importDefault(require("./routes/index.router"));
const path_1 = __importDefault(require("path")); // ✅ Adicione isso
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
// ✅ Aqui você adiciona o middleware para servir as imagens
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "..", "uploads")));
// ✅ Depois disso, registre as rotas da aplicação
app.use("/", index_router_1.default);
// 🔁 Inicialização do servidor
const runServer = (port, server) => {
    server.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
    });
};
const regularServer = http_1.default.createServer(app);
const port = process.env.PORT ? parseInt(process.env.PORT) : 9000;
runServer(port, regularServer);
