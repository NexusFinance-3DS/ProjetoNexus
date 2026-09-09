import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { authRoutes } from "./routes/auth.routes";
import { dataRoutes } from "./routes/data.routes";
import multer from "multer";
import { ApiError } from "./errors";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ mensagem: "API Nexus Finance funcionando." });
});

app.use("/auth", authRoutes);
app.use(dataRoutes);

app.use((_req, res) => {
  res.status(404).json({ mensagem: "Rota não encontrada." });
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ApiError) {
    res.status(error.status).json({ mensagem: error.message });
    return;
  }
  if (error instanceof multer.MulterError) {
    res.status(400).json({ mensagem: error.code === "LIMIT_FILE_SIZE" ? "O arquivo deve ter no máximo 10 MB." : "Envie apenas um arquivo e confira os dados do formulário." });
    return;
  }
  if ((error as { type?: string }).type === "entity.parse.failed") {
    res.status(400).json({ mensagem: "Dados da requisição inválidos." });
    return;
  }
  console.error(error);
  res.status(500).json({ mensagem: "Erro interno do servidor." });
});
