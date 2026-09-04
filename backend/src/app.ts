import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { authRoutes } from "./routes/auth.routes";
import { dataRoutes } from "./routes/data.routes";

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
  console.error(error);
  res.status(500).json({ mensagem: "Erro interno do servidor." });
});
