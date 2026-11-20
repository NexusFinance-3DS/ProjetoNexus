import multer from 'multer';
import path from 'node:path';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { createHash, randomUUID } from 'node:crypto';
export const diretorioAnexos = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads/transacoes'));
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
const tiposPermitidos: Record<string, (conteudo: Buffer) => boolean> = {
  'application/pdf': conteudo => conteudo.subarray(0, 5).toString('ascii') === '%PDF-',
  'image/jpeg': conteudo => conteudo.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])),
  'image/png': conteudo => conteudo.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
};
export function validarAnexo(arquivo: Express.Multer.File): { tipo: string; checksum: string } {
  const validar = tiposPermitidos[arquivo.mimetype];
  if (!validar || !validar(arquivo.buffer)) throw new Error('Formato de anexo não permitido. Envie PDF, PNG ou JPEG válido.');
  return { tipo: arquivo.mimetype, checksum: createHash('sha256').update(arquivo.buffer).digest('hex') };
}
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
