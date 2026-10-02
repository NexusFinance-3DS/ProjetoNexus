import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { configuracao } from "../config/configuracao";
export interface RequisicaoAutenticada extends Request {
  userId?: number;
}
export function criarToken(idUsuario: number): string {
  return jwt.sign({
    userId: idUsuario
  }, configuracao.segredoJwt, {
    expiresIn: configuracao.validadeJwt
  } as SignOptions);
}
export function autenticar(requisicao: RequisicaoAutenticada, resposta: Response, proximo: NextFunction): void {
  const token = requisicao.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) {
    resposta.status(401).json({
      mensagem: 'Token de autenticação não informado.'
    });
    return;
  }
  try {
    const conteudo = jwt.verify(token, configuracao.segredoJwt) as JwtPayload;
    requisicao.userId = Number(conteudo.userId);
    proximo();
  } catch {
    resposta.status(401).json({
      mensagem: 'Sessão inválida ou expirada.'
    });
  }
}
