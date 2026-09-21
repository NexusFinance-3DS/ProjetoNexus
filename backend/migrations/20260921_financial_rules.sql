-- Ajustes das regras financeiras de 2026-09-21.
-- Execute uma única vez em bancos já existentes antes de publicar o backend desta branch.

ALTER TABLE transacoes
  ADD COLUMN id_recorrencia INT UNSIGNED NULL AFTER id_status_transacao,
  ADD COLUMN id_meta INT UNSIGNED NULL AFTER id_recorrencia;

CREATE UNIQUE INDEX uq_transacoes_recorrencia_data
  ON transacoes(id_recorrencia, data_transacao);

ALTER TABLE movimentacoes_metas
  MODIFY descricao VARCHAR(300) NULL;

ALTER TABLE transacoes
  ADD CONSTRAINT fk_transacoes_recorrencia
    FOREIGN KEY (id_recorrencia)
    REFERENCES recorrencias(id_recorrencia)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  ADD CONSTRAINT fk_transacoes_meta
    FOREIGN KEY (id_meta)
    REFERENCES metas(id_meta)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

UPDATE transacoes t
INNER JOIN recorrencias r ON r.id_transacao_origem = t.id_transacao
SET t.id_recorrencia = r.id_recorrencia
WHERE t.id_recorrencia IS NULL;
