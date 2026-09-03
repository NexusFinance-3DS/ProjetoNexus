-- =====================================================
-- BANCO DE DADOS - NEXUS
-- SISTEMA DE GESTÃO FINANCEIRA
-- =====================================================

DROP DATABASE IF EXISTS nexus_finance;
CREATE DATABASE nexus_finance
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE nexus_finance;


-- =====================================================
-- 1. USUÁRIOS
-- =====================================================

CREATE TABLE usuarios (
    id_usuario INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(150) NOT NULL,

    email VARCHAR(150) NOT NULL,

    senha_hash VARCHAR(255) NOT NULL,

    cpf VARCHAR(14) NULL,

    telefone VARCHAR(20) NULL,

    data_nascimento DATE NULL,

    foto_perfil VARCHAR(255) NULL,

    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    atualizado_em DATETIME NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_usuarios_email
        UNIQUE (email),

    CONSTRAINT uq_usuarios_cpf
        UNIQUE (cpf)
) ENGINE=InnoDB;


-- =====================================================
-- 2. RECUPERAÇÃO DE SENHA
-- =====================================================

CREATE TABLE recuperacoes_senha (
    id_recuperacao INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    id_usuario INT UNSIGNED NOT NULL,

    token VARCHAR(255) NOT NULL,

    expira_em DATETIME NOT NULL,

    utilizado BOOLEAN NOT NULL DEFAULT FALSE,

    criado_em DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_recuperacoes_token
        UNIQUE (token),

    CONSTRAINT fk_recuperacoes_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =====================================================
-- 3. ENDEREÇOS
-- =====================================================

CREATE TABLE enderecos (
    id_endereco INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    id_usuario INT UNSIGNED NOT NULL,

    cep VARCHAR(9) NULL,

    logradouro VARCHAR(150) NULL,

    numero VARCHAR(20) NULL,

    complemento VARCHAR(100) NULL,

    bairro VARCHAR(100) NULL,

    cidade VARCHAR(100) NULL,

    estado CHAR(2) NULL,

    CONSTRAINT fk_enderecos_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =====================================================
-- 4. CONFIGURAÇÕES DO USUÁRIO
-- =====================================================

CREATE TABLE configuracoes (
    id_configuracao INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    id_usuario INT UNSIGNED NOT NULL,

    notificacoes_ativas BOOLEAN NOT NULL DEFAULT TRUE,

    tema ENUM('claro', 'escuro', 'sistema')
        NOT NULL DEFAULT 'escuro',

    moeda CHAR(3) NOT NULL DEFAULT 'BRL',

    atualizado_em DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_configuracoes_usuario
        UNIQUE (id_usuario),

    CONSTRAINT fk_configuracoes_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =====================================================
-- 5. TIPOS DE CONTA
-- =====================================================

CREATE TABLE tipos_conta (
    id_tipo_conta TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(50) NOT NULL,

    CONSTRAINT uq_tipos_conta_nome
        UNIQUE (nome)
) ENGINE=InnoDB;


-- =====================================================
-- 6. CONTAS FINANCEIRAS
-- =====================================================

CREATE TABLE contas (
    id_conta INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    id_usuario INT UNSIGNED NOT NULL,

    id_tipo_conta TINYINT UNSIGNED NOT NULL,

    nome VARCHAR(100) NOT NULL,

    saldo_inicial DECIMAL(12,2)
        NOT NULL DEFAULT 0.00,

    ativa BOOLEAN NOT NULL DEFAULT TRUE,

    criado_em DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    atualizado_em DATETIME NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_contas_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_contas_tipo
        FOREIGN KEY (id_tipo_conta)
        REFERENCES tipos_conta(id_tipo_conta)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =====================================================
-- 7. TIPOS DE TRANSAÇÃO
-- =====================================================

CREATE TABLE tipos_transacao (
    id_tipo_transacao TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(30) NOT NULL,

    CONSTRAINT uq_tipos_transacao_nome
        UNIQUE (nome)
) ENGINE=InnoDB;


-- =====================================================
-- 8. CATEGORIAS
-- =====================================================

CREATE TABLE categorias (
    id_categoria INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    -- NULL = categoria padrão do sistema
    -- Preenchido = categoria criada pelo usuário
    id_usuario INT UNSIGNED NULL,

    id_tipo_transacao TINYINT UNSIGNED NOT NULL,

    nome VARCHAR(100) NOT NULL,

    icone VARCHAR(100) NULL,

    cor VARCHAR(20) NULL,

    padrao BOOLEAN NOT NULL DEFAULT FALSE,

    ativa BOOLEAN NOT NULL DEFAULT TRUE,

    criado_em DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_categorias_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_categorias_tipo_transacao
        FOREIGN KEY (id_tipo_transacao)
        REFERENCES tipos_transacao(id_tipo_transacao)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =====================================================
-- 9. STATUS DA TRANSAÇÃO
-- =====================================================

CREATE TABLE status_transacao (
    id_status_transacao TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(50) NOT NULL,

    CONSTRAINT uq_status_transacao_nome
        UNIQUE (nome)
) ENGINE=InnoDB;


-- =====================================================
-- 10. TRANSAÇÕES
-- =====================================================

CREATE TABLE transacoes (
    id_transacao BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    id_usuario INT UNSIGNED NOT NULL,

    id_conta INT UNSIGNED NOT NULL,

    id_categoria INT UNSIGNED NOT NULL,

    id_tipo_transacao TINYINT UNSIGNED NOT NULL,

    id_status_transacao TINYINT UNSIGNED NOT NULL,

    descricao VARCHAR(255) NOT NULL,

    valor DECIMAL(12,2) NOT NULL,

    data_transacao DATE NOT NULL,

    observacao TEXT NULL,

    criada_em DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    atualizada_em DATETIME NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_transacoes_valor
        CHECK (valor > 0),

    CONSTRAINT fk_transacoes_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_transacoes_conta
        FOREIGN KEY (id_conta)
        REFERENCES contas(id_conta)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_transacoes_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categorias(id_categoria)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_transacoes_tipo
        FOREIGN KEY (id_tipo_transacao)
        REFERENCES tipos_transacao(id_tipo_transacao)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_transacoes_status
        FOREIGN KEY (id_status_transacao)
        REFERENCES status_transacao(id_status_transacao)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =====================================================
-- ÍNDICES IMPORTANTES PARA TRANSAÇÕES
-- =====================================================

CREATE INDEX idx_transacoes_usuario
ON transacoes(id_usuario);

CREATE INDEX idx_transacoes_conta
ON transacoes(id_conta);

CREATE INDEX idx_transacoes_categoria
ON transacoes(id_categoria);

CREATE INDEX idx_transacoes_data
ON transacoes(data_transacao);

CREATE INDEX idx_transacoes_usuario_data
ON transacoes(id_usuario, data_transacao);


-- =====================================================
-- 11. ANEXOS DAS TRANSAÇÕES
-- =====================================================

CREATE TABLE anexos_transacao (
    id_anexo INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    id_transacao BIGINT UNSIGNED NOT NULL,

    nome_arquivo VARCHAR(255) NOT NULL,

    caminho_arquivo VARCHAR(500) NOT NULL,

    tipo_arquivo VARCHAR(100) NULL,

    tamanho_arquivo BIGINT UNSIGNED NULL,

    criado_em DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_anexos_transacao
        FOREIGN KEY (id_transacao)
        REFERENCES transacoes(id_transacao)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =====================================================
-- 12. RECORRÊNCIAS
-- =====================================================

CREATE TABLE recorrencias (
    id_recorrencia INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    id_usuario INT UNSIGNED NOT NULL,

    id_transacao_origem BIGINT UNSIGNED NOT NULL,

    frequencia ENUM(
        'diaria',
        'semanal',
        'mensal',
        'anual'
    ) NOT NULL,

    data_inicio DATE NOT NULL,

    data_fim DATE NULL,

    ativa BOOLEAN NOT NULL DEFAULT TRUE,

    criado_em DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_recorrencias_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_recorrencias_transacao
        FOREIGN KEY (id_transacao_origem)
        REFERENCES transacoes(id_transacao)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =====================================================
-- 13. METAS FINANCEIRAS
-- =====================================================

CREATE TABLE metas (
    id_meta INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    id_usuario INT UNSIGNED NOT NULL,

    nome VARCHAR(150) NOT NULL,

    descricao TEXT NULL,

    valor_objetivo DECIMAL(12,2) NOT NULL,

    data_inicio DATE NOT NULL,

    data_prazo DATE NULL,

    status ENUM(
        'em_andamento',
        'concluida',
        'cancelada'
    ) NOT NULL DEFAULT 'em_andamento',

    criada_em DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    atualizada_em DATETIME NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_metas_valor
        CHECK (valor_objetivo > 0),

    CONSTRAINT fk_metas_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =====================================================
-- 14. MOVIMENTAÇÕES DAS METAS
-- =====================================================

CREATE TABLE movimentacoes_metas (
    id_movimentacao_meta BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    id_meta INT UNSIGNED NOT NULL,

    -- Pode ser NULL quando a movimentação
    -- não estiver ligada a uma transação
    id_transacao BIGINT UNSIGNED NULL,

    tipo ENUM(
        'deposito',
        'retirada'
    ) NOT NULL,

    valor DECIMAL(12,2) NOT NULL,

    data_movimentacao DATE NOT NULL,

    descricao VARCHAR(255) NULL,

    criado_em DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_movimentacoes_meta_valor
        CHECK (valor > 0),

    CONSTRAINT fk_movimentacoes_meta
        FOREIGN KEY (id_meta)
        REFERENCES metas(id_meta)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_movimentacoes_meta_transacao
        FOREIGN KEY (id_transacao)
        REFERENCES transacoes(id_transacao)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =====================================================
-- 15. TIPOS DE NOTIFICAÇÃO
-- =====================================================

CREATE TABLE tipos_notificacao (
    id_tipo_notificacao TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(50) NOT NULL,

    CONSTRAINT uq_tipos_notificacao_nome
        UNIQUE (nome)
) ENGINE=InnoDB;


-- =====================================================
-- 16. NOTIFICAÇÕES
-- =====================================================

CREATE TABLE notificacoes (
    id_notificacao BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    id_usuario INT UNSIGNED NOT NULL,

    id_tipo_notificacao TINYINT UNSIGNED NOT NULL,

    titulo VARCHAR(150) NOT NULL,

    descricao TEXT NOT NULL,

    lida BOOLEAN NOT NULL DEFAULT FALSE,

    criado_em DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notificacoes_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_notificacoes_tipo
        FOREIGN KEY (id_tipo_notificacao)
        REFERENCES tipos_notificacao(id_tipo_notificacao)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =====================================================
-- 17. RELATÓRIOS GERADOS
-- =====================================================

CREATE TABLE relatorios_gerados (
    id_relatorio BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    id_usuario INT UNSIGNED NOT NULL,

    tipo VARCHAR(100) NOT NULL,

    data_inicio DATE NOT NULL,

    data_fim DATE NOT NULL,

    formato ENUM(
        'pdf',
        'csv',
        'xlsx'
    ) NOT NULL,

    caminho_arquivo VARCHAR(500) NULL,

    criado_em DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_relatorios_periodo
        CHECK (data_fim >= data_inicio),

    CONSTRAINT fk_relatorios_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =====================================================
-- DADOS INICIAIS
-- =====================================================


-- =====================================================
-- TIPOS DE CONTA
-- =====================================================

INSERT INTO tipos_conta (nome)
VALUES
('Conta Corrente'),
('Poupança'),
('Carteira'),
('Investimento');


-- =====================================================
-- TIPOS DE TRANSAÇÃO
-- =====================================================

INSERT INTO tipos_transacao (nome)
VALUES
('Receita'),
('Despesa');


-- =====================================================
-- STATUS DAS TRANSAÇÕES
-- =====================================================

INSERT INTO status_transacao (nome)
VALUES
('Pendente'),
('Confirmada'),
('Cancelada');


-- =====================================================
-- TIPOS DE NOTIFICAÇÃO
-- =====================================================

INSERT INTO tipos_notificacao (nome)
VALUES
('Financeira'),
('Meta'),
('Sistema'),
('Lembrete');


-- =====================================================
-- CATEGORIAS PADRÃO - RECEITAS
-- =====================================================

INSERT INTO categorias (
    id_usuario,
    id_tipo_transacao,
    nome,
    padrao
)
VALUES
(NULL, 1, 'Salário', TRUE),
(NULL, 1, 'Freelance', TRUE),
(NULL, 1, 'Investimentos', TRUE),
(NULL, 1, 'Presentes', TRUE),
(NULL, 1, 'Outros', TRUE);


-- =====================================================
-- CATEGORIAS PADRÃO - DESPESAS
-- =====================================================

INSERT INTO categorias (
    id_usuario,
    id_tipo_transacao,
    nome,
    padrao
)
VALUES
(NULL, 2, 'Alimentação', TRUE),
(NULL, 2, 'Transporte', TRUE),
(NULL, 2, 'Moradia', TRUE),
(NULL, 2, 'Saúde', TRUE),
(NULL, 2, 'Educação', TRUE),
(NULL, 2, 'Lazer', TRUE),
(NULL, 2, 'Assinaturas', TRUE),
(NULL, 2, 'Serviços', TRUE),
(NULL, 2, 'Compras', TRUE),
(NULL, 2, 'Outros', TRUE);


-- =====================================================
-- FIM DO BANCO
-- =====================================================