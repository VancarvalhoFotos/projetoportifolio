CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir usuário administrador padrão (senha: admin123)
INSERT INTO usuarios (nome, email, senha) 
VALUES ('Administrador', 'admin@vanessacarvalhofotografias.com.br', '$2b$10$PR5kmChCPzlg/nt1UoQkseTIy3RaAKpG0cTa5nNytgfWMOBL/JBdu')
ON CONFLICT (email) DO NOTHING; 