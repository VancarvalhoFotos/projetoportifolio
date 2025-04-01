-- Criar tabela de ensaios
CREATE TABLE IF NOT EXISTS ensaios (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('Gestante', 'Newborn', 'Acompanhamento Mensal', 'Smash The Cake')),
    descricao TEXT NOT NULL,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de imagens
CREATE TABLE IF NOT EXISTS imagens (
    id SERIAL PRIMARY KEY,
    ensaio_id INTEGER REFERENCES ensaios(id) ON DELETE CASCADE,
    url VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_ensaios_categoria ON ensaios(categoria);
CREATE INDEX IF NOT EXISTS idx_imagens_ensaio_id ON imagens(ensaio_id); 