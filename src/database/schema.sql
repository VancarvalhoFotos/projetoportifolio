-- Tabela de portfólio
CREATE TABLE IF NOT EXISTS portfolio (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de contatos
CREATE TABLE IF NOT EXISTS contatos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    mensagem TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir imagens do portfólio
INSERT INTO portfolio (title, description, image_url, category) VALUES
-- Newborn
('Ensaio Newborn 1', 'Ensaio newborn com tema fine art', '/images/portfolio/newborn-1.jpg', 'newborn'),
('Ensaio Newborn 2', 'Ensaio newborn com tema dinossauro', '/images/portfolio/newborn-2.jpg', 'newborn'),
('Ensaio Newborn 3', 'Ensaio newborn com tema ursinho pooh', '/images/portfolio/newborn-3.jpg', 'newborn'),
('Ensaio Newborn 4', 'Ensaio newborn com tema branca de neve', '/images/portfolio/newborn-4.jpg', 'newborn'),
('Ensaio Newborn 5', 'Ensaio newborn com tema fine art', '/images/portfolio/newborn-5.jpg', 'newborn'),
('Ensaio Newborn 6', 'Ensaio newborn com tema dinossauro', '/images/portfolio/newborn-6.jpg', 'newborn'),
('Ensaio Newborn 7', 'Ensaio newborn com tema ursinho pooh', '/images/portfolio/newborn-7.jpg', 'newborn'),
('Ensaio Newborn 8', 'Ensaio newborn com tema branca de neve', '/images/portfolio/newborn-8.jpg', 'newborn'),

-- Acompanhamento Mensal
('Alice no País das Maravilhas', 'Ensaio de acompanhamento mensal com tema Alice', '/images/portfolio/alice-no-pais-das-maravilhas.jpg', 'mensal'),
('Alice no País das Maravilhas II', 'Ensaio de acompanhamento mensal com tema Alice', '/images/portfolio/alice-no-pais-das-maravilhas-2.jpg', 'mensal'),
('Circo Rosa', 'Ensaio de acompanhamento mensal com tema circo', '/images/portfolio/circo-rosa.jpg', 'mensal'),
('Ensaio Fine Art', 'Ensaio de acompanhamento mensal com tema fine art', '/images/portfolio/fineart.jpg', 'mensal'),
('Ensaio Dinossauro', 'Ensaio de acompanhamento mensal com tema dinossauro', '/images/portfolio/dinossauro.jpg', 'mensal'),
('Ensaio Ursinho Pooh', 'Ensaio de acompanhamento mensal com tema ursinho pooh', '/images/portfolio/ursinho-pooh.jpg', 'mensal'),
('Ensaio Branca de Neve', 'Ensaio de acompanhamento mensal com tema branca de neve', '/images/portfolio/branca-de-neve.jpg', 'mensal'),

-- Smash the Cake
('Smash the Cake', 'Celebrando o primeiro aniversário com muita diversão', '/images/portfolio/smash-the-cake.jpg', 'smash'),

-- Gestantes
('Ensaio Gestante', 'Momento especial da gravidez', '/images/portfolio/sobre-vanessa.jpg', 'gestante'),

-- Temas Especiais
('Páscoa I', 'Ensaio especial de páscoa', '/images/portfolio/pascoa-1.jpg', 'especial'),
('Páscoa II', 'Ensaio especial de páscoa', '/images/portfolio/pascoa-2.jpg', 'especial'),
('Páscoa III', 'Ensaio especial de páscoa', '/images/portfolio/pascoa-3.jpg', 'especial'),
('Páscoa IV', 'Ensaio especial de páscoa', '/images/portfolio/pascoa-4.jpg', 'especial'); 