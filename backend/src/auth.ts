import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { config } from "./config";

export interface AuthenticatedRequest extends Request {
  userId?: number;
}

export function createToken(userId: number): string {
  return jwt.sign(
    { userId },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn } as SignOptions,
  );
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) {
    res.status(401).json({ mensagem: "Token de autenticação não informado." });
    return;
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.userId = Number(payload.userId);
    next();
  } catch {
    res.status(401).json({ mensagem: "Sessão inválida ou expirada." });
  }
}
