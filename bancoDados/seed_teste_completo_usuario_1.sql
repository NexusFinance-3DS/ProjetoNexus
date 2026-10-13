-- Dados de demonstração para testar as telas financeiras do Nexus Finance.
-- Requer que o usuário 1 já exista, que o banco tenha as categorias padrão
-- e que `npm run migrate` já tenha adicionado parcela_atual/total_parcelas.
-- O script não apaga nem altera transações já existentes.

USE nexus_finance;
START TRANSACTION;

SET @usuario_teste := 1;
SET @mes_atual := CAST(DATE_FORMAT(CURDATE(), '%Y-%m-01') AS DATE);
SET @inicio_historico := DATE_SUB(@mes_atual, INTERVAL 11 MONTH);
SET @historico_existente := EXISTS (
  SELECT 1 FROM transacoes
  WHERE id_usuario = @usuario_teste
    AND descricao LIKE 'APÊ SOLO 12M -%'
);

-- Conta corrente de demonstração, criada somente se ainda não houver uma ativa.
INSERT INTO contas (id_usuario, id_tipo_conta, nome, saldo_inicial)
SELECT @usuario_teste, tc.id_tipo_conta, 'Conta principal', 0.00
FROM tipos_conta tc
WHERE tc.nome = 'Conta Corrente'
  AND EXISTS (SELECT 1 FROM usuarios WHERE id_usuario = @usuario_teste)
  AND NOT EXISTS (
    SELECT 1 FROM contas c
    WHERE c.id_usuario = @usuario_teste AND c.ativa = TRUE
  )
LIMIT 1;

SET @conta_teste := (
  SELECT id_conta FROM contas
  WHERE id_usuario = @usuario_teste AND ativa = TRUE
  ORDER BY id_conta LIMIT 1
);
SET @tipo_receita := (SELECT id_tipo_transacao FROM tipos_transacao WHERE nome = 'Receita' LIMIT 1);
SET @tipo_despesa := (SELECT id_tipo_transacao FROM tipos_transacao WHERE nome = 'Despesa' LIMIT 1);
SET @status_confirmada := (SELECT id_status_transacao FROM status_transacao WHERE nome = 'Confirmada' LIMIT 1);
SET @status_pendente := (SELECT id_status_transacao FROM status_transacao WHERE nome = 'Pendente' LIMIT 1);
SET @status_cancelada := (SELECT id_status_transacao FROM status_transacao WHERE nome = 'Cancelada' LIMIT 1);

-- Categoria personalizada para testar também o seletor de categorias.
INSERT INTO categorias (id_usuario, id_tipo_transacao, nome, padrao, ativa)
SELECT @usuario_teste, @tipo_despesa, 'Pets - demonstração', FALSE, TRUE
WHERE @tipo_despesa IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM categorias
    WHERE id_usuario = @usuario_teste
      AND id_tipo_transacao = @tipo_despesa
      AND nome = 'Pets - demonstração'
  );

-- Preferências e endereço de demonstração.
INSERT INTO configuracoes (id_usuario, notificacoes_ativas, tema)
VALUES (@usuario_teste, TRUE, 'escuro')
ON DUPLICATE KEY UPDATE notificacoes_ativas = TRUE, tema = 'escuro';

INSERT INTO enderecos (
  id_usuario, cep, logradouro, numero, complemento, bairro, cidade, estado
)
SELECT @usuario_teste, '01310-100', 'Avenida Paulista', '1000', 'Apto 42',
       'Bela Vista', 'São Paulo', 'SP'
WHERE NOT EXISTS (
  SELECT 1 FROM enderecos WHERE id_usuario = @usuario_teste
);

-- Doze meses de receitas e despesas de uma pessoa que mora sozinha.
-- Lançamentos até hoje ficam confirmados; datas futuras deste mês ficam pendentes.
-- Se a carga anual da resposta anterior já foi executada, esta parte é pulada.
INSERT INTO transacoes (
  id_usuario, id_conta, id_categoria, id_tipo_transacao,
  id_status_transacao, descricao, valor, data_transacao,
  parcela_atual, total_parcelas
)
WITH RECURSIVE meses AS (
  SELECT 0 AS indice, @inicio_historico AS inicio_mes
  UNION ALL
  SELECT indice + 1, DATE_ADD(inicio_mes, INTERVAL 1 MONTH)
  FROM meses
  WHERE indice < 11
), modelos AS (
  SELECT 'Receita' AS tipo, 'Salário' AS categoria,
         'Salário' AS descricao, 4200.00 AS valor,
         5 AS dia, 1 AS intervalo, 0 AS fase
  UNION ALL SELECT 'Despesa', 'Moradia', 'Aluguel e condomínio', 1850.00, 8, 1, 0
  UNION ALL SELECT 'Despesa', 'Serviços', 'Conta de energia', 135.00, 12, 1, 0
  UNION ALL SELECT 'Despesa', 'Serviços', 'Conta de água', 68.00, 12, 1, 0
  UNION ALL SELECT 'Despesa', 'Serviços', 'Internet residencial', 109.90, 15, 1, 0
  UNION ALL SELECT 'Despesa', 'Alimentação', 'Mercado - primeira compra', 430.00, 10, 1, 0
  UNION ALL SELECT 'Despesa', 'Alimentação', 'Mercado - segunda compra', 350.00, 24, 1, 0
  UNION ALL SELECT 'Despesa', 'Transporte', 'Transporte público e aplicativos', 230.00, 16, 1, 0
  UNION ALL SELECT 'Despesa', 'Serviços', 'Plano de celular', 59.90, 18, 1, 0
  UNION ALL SELECT 'Despesa', 'Assinaturas', 'Streaming e música', 54.90, 20, 1, 0
  UNION ALL SELECT 'Despesa', 'Saúde', 'Academia', 89.90, 2, 1, 0
  UNION ALL SELECT 'Despesa', 'Lazer', 'Lazer e refeições fora', 220.00, 27, 1, 0
  UNION ALL SELECT 'Despesa', 'Saúde', 'Farmácia', 75.00, 18, 2, 0
  UNION ALL SELECT 'Despesa', 'Compras', 'Utensílios e produtos para casa', 120.00, 19, 3, 1
  UNION ALL SELECT 'Receita', 'Freelance', 'Trabalho freelance', 550.00, 22, 4, 2
), parcelas AS (
  SELECT 1 AS numero UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
), movimentos AS (
  SELECT modelos.tipo, modelos.categoria, modelos.descricao, modelos.valor,
         DATE_ADD(meses.inicio_mes, INTERVAL (modelos.dia - 1) DAY) AS data_movimento,
         NULL AS parcela_atual, NULL AS total_parcelas
  FROM meses CROSS JOIN modelos
  WHERE MOD(meses.indice, modelos.intervalo) = modelos.fase

  UNION ALL

  -- Móveis: quatro parcelas de R$ 250,00, de julho até outubro deste ano.
  SELECT 'Despesa', 'Compras', 'Compra de móveis do apartamento', 250.00,
         DATE_ADD(
           DATE_ADD(DATE_SUB(@mes_atual, INTERVAL 3 MONTH),
                    INTERVAL (parcelas.numero - 1) MONTH),
           INTERVAL 14 DAY
         ),
         parcelas.numero, 4
  FROM parcelas
)
SELECT
  @usuario_teste,
  @conta_teste,
  (
    SELECT c.id_categoria
    FROM categorias c
    WHERE c.nome = movimentos.categoria
      AND c.id_tipo_transacao = tipo.id_tipo_transacao
      AND c.ativa = TRUE
      AND (c.id_usuario IS NULL OR c.id_usuario = @usuario_teste)
    ORDER BY (c.id_usuario = @usuario_teste) DESC, c.padrao DESC, c.id_categoria
    LIMIT 1
  ),
  tipo.id_tipo_transacao,
  status.id_status_transacao,
  CONCAT('APÊ SOLO 12M - ', movimentos.descricao),
  movimentos.valor,
  movimentos.data_movimento,
  movimentos.parcela_atual,
  movimentos.total_parcelas
FROM movimentos
JOIN tipos_transacao tipo ON tipo.nome = movimentos.tipo
JOIN status_transacao status
  ON status.nome = CASE
    WHEN movimentos.data_movimento <= CURDATE() THEN 'Confirmada'
    ELSE 'Pendente'
  END
WHERE @historico_existente = FALSE
  AND @conta_teste IS NOT NULL;

-- Metas: uma em andamento, uma concluída e uma cancelada.
INSERT INTO metas (
  id_usuario, nome, descricao, valor_objetivo, data_inicio, data_prazo, status
)
SELECT @usuario_teste, 'Reserva de emergência',
       'Meta ativa para despesas inesperadas.', 6000.00,
       @inicio_historico, DATE_ADD(@mes_atual, INTERVAL 9 MONTH), 'em_andamento'
WHERE NOT EXISTS (
  SELECT 1 FROM metas WHERE id_usuario = @usuario_teste AND nome = 'Reserva de emergência'
);

INSERT INTO metas (
  id_usuario, nome, descricao, valor_objetivo, data_inicio, data_prazo, status
)
SELECT @usuario_teste, 'Notebook novo',
       'Meta concluída para testar o estado de objetivo alcançado.', 2500.00,
       @inicio_historico, @mes_atual, 'concluida'
WHERE NOT EXISTS (
  SELECT 1 FROM metas WHERE id_usuario = @usuario_teste AND nome = 'Notebook novo'
);

INSERT INTO metas (
  id_usuario, nome, descricao, valor_objetivo, data_inicio, data_prazo, status
)
SELECT @usuario_teste, 'Curso cancelado',
       'Meta cancelada para testar esse estado na interface.', 1200.00,
       @inicio_historico, @mes_atual, 'cancelada'
WHERE NOT EXISTS (
  SELECT 1 FROM metas WHERE id_usuario = @usuario_teste AND nome = 'Curso cancelado'
);

SET @meta_reserva := (
  SELECT id_meta FROM metas
  WHERE id_usuario = @usuario_teste AND nome = 'Reserva de emergência'
  ORDER BY id_meta DESC LIMIT 1
);
SET @meta_notebook := (
  SELECT id_meta FROM metas
  WHERE id_usuario = @usuario_teste AND nome = 'Notebook novo'
  ORDER BY id_meta DESC LIMIT 1
);
SET @meta_curso := (
  SELECT id_meta FROM metas
  WHERE id_usuario = @usuario_teste AND nome = 'Curso cancelado'
  ORDER BY id_meta DESC LIMIT 1
);

-- Depósitos e retirada para testar progresso e saldo líquido das metas.
INSERT INTO movimentacoes_metas (
  id_meta, tipo, valor, data_movimentacao, descricao
)
SELECT @meta_reserva, 'deposito', 800.00,
       DATE_SUB(CURDATE(), INTERVAL 60 DAY), 'Primeiro depósito de demonstração'
WHERE @meta_reserva IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM movimentacoes_metas
    WHERE id_meta = @meta_reserva AND descricao = 'Primeiro depósito de demonstração'
  );

INSERT INTO movimentacoes_metas (
  id_meta, tipo, valor, data_movimentacao, descricao
)
SELECT @meta_reserva, 'deposito', 450.00,
       DATE_SUB(CURDATE(), INTERVAL 20 DAY), 'Segundo depósito de demonstração'
WHERE @meta_reserva IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM movimentacoes_metas
    WHERE id_meta = @meta_reserva AND descricao = 'Segundo depósito de demonstração'
  );

INSERT INTO movimentacoes_metas (
  id_meta, tipo, valor, data_movimentacao, descricao
)
SELECT @meta_reserva, 'retirada', 100.00,
       CURDATE(), 'Retirada de demonstração'
WHERE @meta_reserva IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM movimentacoes_metas
    WHERE id_meta = @meta_reserva AND descricao = 'Retirada de demonstração'
  );

INSERT INTO movimentacoes_metas (
  id_meta, tipo, valor, data_movimentacao, descricao
)
SELECT @meta_notebook, 'deposito', 2500.00,
       @mes_atual, 'Valor de meta concluída'
WHERE @meta_notebook IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM movimentacoes_metas
    WHERE id_meta = @meta_notebook AND descricao = 'Valor de meta concluída'
  );

INSERT INTO movimentacoes_metas (
  id_meta, tipo, valor, data_movimentacao, descricao
)
SELECT @meta_curso, 'deposito', 200.00,
       @mes_atual, 'Movimentação da meta cancelada'
WHERE @meta_curso IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM movimentacoes_metas
    WHERE id_meta = @meta_curso AND descricao = 'Movimentação da meta cancelada'
  );

-- Regra recorrente mensal baseada no lançamento de academia deste mês.
-- A API poderá gerar as ocorrências dos próximos meses ao consultar o resumo/fluxo.
SET @origem_recorrente := (
  SELECT id_transacao
  FROM transacoes
  WHERE id_usuario = @usuario_teste
    AND descricao = 'APÊ SOLO 12M - Academia'
    AND data_transacao = DATE_ADD(@mes_atual, INTERVAL 1 DAY)
  ORDER BY id_transacao DESC LIMIT 1
);

INSERT INTO recorrencias (
  id_usuario, id_transacao_origem, frequencia,
  data_inicio, data_fim, ultima_geracao, ativa
)
SELECT @usuario_teste, @origem_recorrente, 'mensal',
       t.data_transacao, LAST_DAY(DATE_ADD(@mes_atual, INTERVAL 2 MONTH)),
       @mes_atual, TRUE
FROM transacoes t
WHERE t.id_transacao = @origem_recorrente
  AND NOT EXISTS (
    SELECT 1 FROM recorrencias r
    WHERE r.id_usuario = @usuario_teste
      AND r.id_transacao_origem = @origem_recorrente
      AND r.ativa = TRUE
  );

-- Notificações lidas e não lidas de diferentes tipos.
INSERT INTO notificacoes (id_usuario, id_tipo_notificacao, titulo, descricao, lida)
SELECT @usuario_teste, tn.id_tipo_notificacao,
       'Aluguel registrado', 'O lançamento mensal de aluguel foi incluído.', FALSE
FROM tipos_notificacao tn
WHERE tn.nome = 'Financeira'
  AND NOT EXISTS (
    SELECT 1 FROM notificacoes n
    WHERE n.id_usuario = @usuario_teste AND n.titulo = 'Aluguel registrado'
  );

INSERT INTO notificacoes (id_usuario, id_tipo_notificacao, titulo, descricao, lida)
SELECT @usuario_teste, tn.id_tipo_notificacao,
       'Meta em andamento', 'A reserva de emergência está progredindo.', FALSE
FROM tipos_notificacao tn
WHERE tn.nome = 'Meta'
  AND NOT EXISTS (
    SELECT 1 FROM notificacoes n
    WHERE n.id_usuario = @usuario_teste AND n.titulo = 'Meta em andamento'
  );

INSERT INTO notificacoes (id_usuario, id_tipo_notificacao, titulo, descricao, lida)
SELECT @usuario_teste, tn.id_tipo_notificacao,
       'Aviso de demonstração', 'Notificação de sistema já marcada como lida.', TRUE
FROM tipos_notificacao tn
WHERE tn.nome = 'Sistema'
  AND NOT EXISTS (
    SELECT 1 FROM notificacoes n
    WHERE n.id_usuario = @usuario_teste AND n.titulo = 'Aviso de demonstração'
  );

COMMIT;

-- Resumo para conferir as movimentações carregadas.
SELECT
  t.descricao,
  tt.nome AS tipo,
  c.nome AS categoria,
  t.valor,
  t.data_transacao,
  st.nome AS status,
  t.parcela_atual,
  t.total_parcelas
FROM transacoes t
JOIN tipos_transacao tt USING (id_tipo_transacao)
JOIN categorias c USING (id_categoria)
JOIN status_transacao st USING (id_status_transacao)
WHERE t.id_usuario = @usuario_teste
  AND t.descricao LIKE 'APÊ SOLO 12M -%'
ORDER BY t.data_transacao, t.id_transacao;

-- Resumo para conferir metas e saldos.
SELECT
  m.nome,
  m.status,
  m.valor_objetivo,
  COALESCE(SUM(CASE WHEN mm.tipo = 'deposito' THEN mm.valor ELSE -mm.valor END), 0) AS valor_atual
FROM metas m
LEFT JOIN movimentacoes_metas mm ON mm.id_meta = m.id_meta
WHERE m.id_usuario = @usuario_teste
  AND m.nome IN ('Reserva de emergência', 'Notebook novo', 'Curso cancelado')
GROUP BY m.id_meta, m.nome, m.status, m.valor_objetivo
ORDER BY m.id_meta;
