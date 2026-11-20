import { RowDataPacket } from 'mysql2';
import { bancoDados } from "./bancoDados";
async function migrar() {
  const [colunas] = await bancoDados.query<RowDataPacket[]>("SHOW COLUMNS FROM recorrencias LIKE 'ultima_geracao'");
  if (!colunas.length) await bancoDados.query('ALTER TABLE recorrencias ADD COLUMN ultima_geracao DATE NULL AFTER data_fim');
  const [parcelaAtual] = await bancoDados.query<RowDataPacket[]>("SHOW COLUMNS FROM transacoes LIKE 'parcela_atual'");
  if (!parcelaAtual.length) await bancoDados.query('ALTER TABLE transacoes ADD COLUMN parcela_atual TINYINT UNSIGNED NULL');
  const [totalParcelas] = await bancoDados.query<RowDataPacket[]>("SHOW COLUMNS FROM transacoes LIKE 'total_parcelas'");
  if (!totalParcelas.length) await bancoDados.query('ALTER TABLE transacoes ADD COLUMN total_parcelas TINYINT UNSIGNED NULL');
  const [tokenHash] = await bancoDados.query<RowDataPacket[]>("SHOW COLUMNS FROM recuperacoes_senha LIKE 'token_hash'");
  if (!tokenHash.length) await bancoDados.query('ALTER TABLE recuperacoes_senha ADD COLUMN token_hash CHAR(64) CHARACTER SET ascii NULL');
  const [tokenLegado] = await bancoDados.query<RowDataPacket[]>("SHOW COLUMNS FROM recuperacoes_senha LIKE 'token'");
  if (tokenLegado.length && tokenLegado[0].Null === 'NO') await bancoDados.query('ALTER TABLE recuperacoes_senha MODIFY token VARCHAR(255) NULL');
  const [utilizadoEm] = await bancoDados.query<RowDataPacket[]>("SHOW COLUMNS FROM recuperacoes_senha LIKE 'utilizado_em'");
  if (!utilizadoEm.length) await bancoDados.query('ALTER TABLE recuperacoes_senha ADD COLUMN utilizado_em DATETIME NULL');
  const [checksum] = await bancoDados.query<RowDataPacket[]>("SHOW COLUMNS FROM anexos_transacao LIKE 'checksum_sha256'");
  if (!checksum.length) await bancoDados.query('ALTER TABLE anexos_transacao ADD COLUMN checksum_sha256 CHAR(64) CHARACTER SET ascii NULL');
  const [solicitacoes] = await bancoDados.query<RowDataPacket[]>("SHOW TABLES LIKE 'solicitacoes_privacidade'");
  if (!solicitacoes.length) await bancoDados.query(`CREATE TABLE solicitacoes_privacidade (
    id_solicitacao BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT UNSIGNED NOT NULL,
    tipo ENUM('acesso', 'exportacao', 'correcao', 'eliminacao') NOT NULL,
    status ENUM('aberta', 'em_analise', 'concluida', 'negada') NOT NULL DEFAULT 'aberta',
    justificativa TEXT NULL, resposta TEXT NULL,
    solicitado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, concluido_em DATETIME NULL,
    CONSTRAINT fk_solicitacoes_privacidade_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_solicitacoes_privacidade_usuario_status (id_usuario, status, solicitado_em)
  ) ENGINE=InnoDB`);
}
migrar().catch(falha => {
  console.error(falha);
  process.exitCode = 1;
}).finally(() => bancoDados.end());
