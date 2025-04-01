-- Remover tabelas duplicadas ou não utilizadas
DROP TABLE IF EXISTS portfolio CASCADE;
DROP TABLE IF EXISTS contatos CASCADE;
DROP TABLE IF EXISTS Contact CASCADE;
DROP TABLE IF EXISTS HomePage CASCADE;

-- Manter apenas as tabelas necessárias:
-- 1. User (para autenticação)
-- 2. Session (para gerenciamento de sessão)
-- 3. Album (para álbuns de fotos)
-- 4. Photo (para fotos)
-- 5. Booking (para agendamentos)
-- 6. ensaios (para ensaios fotográficos)
-- 7. imagens (para imagens dos ensaios)

-- Atualizar a tabela User para incluir campos adicionais necessários
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "role" TEXT DEFAULT 'USER',
ADD COLUMN IF NOT EXISTS "emailVerified" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "image" TEXT; 