import multer from 'multer';
import path from 'node:path';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
export const diretorioAnexos = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, '../uploads/transacoes'));
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
    fields: 15,
    fieldSize: 10000,
    parts: 16
  }
});
export function nomeAnexo(nome: string): string {
  // Nomes de arquivos enviados por fetch usam UTF-8; o padrão do Busboy é Latin-1.
  if ([...nome].every(caractere => caractere.charCodeAt(0) <= 255)) {
    const decodificado = Buffer.from(nome, 'latin1').toString('utf8');
    if (!decodificado.includes('\uFFFD')) nome = decodificado;
  }
  return (nome.replace(/\\/g, '/').split('/').pop() || 'arquivo').replace(/[\x00-\x1f\x7f]/g, '').slice(0, 255) || 'arquivo';
}
export async function armazenarAnexo(arquivo: Express.Multer.File): Promise<string> {
  await mkdir(diretorioAnexos, {
    recursive: true
  });
  const chave = randomUUID();
  await writeFile(path.join(diretorioAnexos, chave), arquivo.buffer, {
    flag: 'wx'
  });
  return chave;
}
export async function removerAnexo(chave: string): Promise<void> {
  await unlink(path.join(diretorioAnexos, chave)).catch((falha: NodeJS.ErrnoException) => {
    if (falha.code !== 'ENOENT') throw falha;
  });
}
