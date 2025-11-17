CREATE DATABASE catalogo;
USE catalogo;

-- ===============================
-- TABELA DE PRODUTOS
-- ===============================
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    sku VARCHAR(100) UNIQUE NOT NULL,
    unidade_medida VARCHAR(50),
    preco_unitario DECIMAL(10, 2) NOT NULL, -- ✅ Campo adicionado para preço direto no produto
    url_imagem VARCHAR(2048), -- URL da imagem do produto
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ===============================
-- TABELA DE ESTOQUE
-- ===============================
CREATE TABLE estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL UNIQUE,  -- 🔥 GARANTE APENAS 1 LINHA POR PRODUTO
    quantidade INT NOT NULL DEFAULT 0,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ===============================
-- CONTEXTO DE REPRESENTAÇÃO COMERCIAL
-- ===============================
CREATE TABLE representantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    data_contratacao DATE
);


CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    documento VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    telefone VARCHAR(20),
    endereco TEXT,
    representante_id INT,
    FOREIGN KEY (representante_id) REFERENCES representantes(id)
);

CREATE TABLE metas_vendas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    representante_id INT NOT NULL,
    periodo VARCHAR(7) NOT NULL, -- Formato AAAA-MM
    valor_meta DECIMAL(15, 2) NOT NULL,
    valor_realizado DECIMAL(15, 2) DEFAULT 0.00,
    FOREIGN KEY (representante_id) REFERENCES representantes(id),
    UNIQUE (representante_id, periodo)
);

-- ===============================
-- CONTEXTO DE GESTÃO DE PEDIDOS
-- ===============================
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    representante_id INT NOT NULL,
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'Em aberto',
    valor_total DECIMAL(15, 2) NOT NULL,
    condicao_pagamento VARCHAR(100),
    observacoes TEXT,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (representante_id) REFERENCES representantes(id)
);

CREATE TABLE itens_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    preco_unitario DECIMAL(10, 2) NOT NULL,
    preco_total DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    UNIQUE (pedido_id, produto_id)
);

-- ===============================
-- RELATÓRIOS (VIEWS)
-- ===============================
CREATE VIEW relatorio_vendas_representante AS
SELECT
    r.id AS representante_id,
    r.nome AS representante_nome,
    mv.periodo,
    COUNT(DISTINCT p.id) AS total_pedidos,
    SUM(p.valor_total) AS valor_total_vendido,
    mv.valor_meta AS meta_vendas,
    (SUM(p.valor_total) / mv.valor_meta) * 100 AS percentual_atingimento_meta
FROM representantes r
JOIN metas_vendas mv ON r.id = mv.representante_id
LEFT JOIN pedidos p ON r.id = p.representante_id AND DATE_FORMAT(p.data_pedido, '%Y-%m') = mv.periodo
GROUP BY r.id, r.nome, mv.periodo, mv.valor_meta;

CREATE VIEW relatorio_vendas_produto AS
SELECT
    prod.id AS produto_id,
    prod.nome AS produto_nome,
    DATE_FORMAT(ped.data_pedido, '%Y-%m') AS periodo,
    SUM(ip.quantidade) AS quantidade_vendida,
    SUM(ip.preco_total) AS valor_total_vendido
FROM produtos prod
JOIN itens_pedido ip ON prod.id = ip.produto_id
JOIN pedidos ped ON ip.pedido_id = ped.id
GROUP BY prod.id, prod.nome, periodo;




