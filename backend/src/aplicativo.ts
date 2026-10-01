import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { rotasAutenticacao } from "./rotas/autenticacao.rotas";
import { rotasDados } from "./rotas/dados.rotas";
import multer from 'multer';
import { ErroApi } from "./erros";
const aplicativo = express();
export { aplicativo };
aplicativo.use(cors());
aplicativo.use(express.json());
aplicativo.get('/', (_requisicao, resposta) => {
  resposta.json({
    mensagem: 'API Nexus Finance funcionando.'
  });
});
aplicativo.use('/auth', rotasAutenticacao);
aplicativo.use(rotasDados);
aplicativo.use((_requisicao, resposta) => {
  resposta.status(404).json({
    mensagem: 'Rota não encontrada.'
  });
});
aplicativo.use((falha: Error, _requisicao: Request, resposta: Response, _proximo: NextFunction) => {
  if (falha instanceof ErroApi) {
    resposta.status(falha.status).json({
      mensagem: falha.message
    });
    return;
  }
  if (falha instanceof multer.MulterError) {
    resposta.status(400).json({
      mensagem: falha.code === 'LIMIT_FILE_SIZE' ? 'O arquivo deve ter no máximo 10 MB.' : 'Envie apenas um arquivo e confira os dados do formulário.'
    });
    return;
  }
  if ((falha as {
    type?: string;
  }).type === 'entity.parse.failed') {
    resposta.status(400).json({
      mensagem: 'Dados da requisição inválidos.'
    });
    return;
  }
  console.error(falha);
  resposta.status(500).json({
    mensagem: 'Erro interno do servidor.'
  });
});
