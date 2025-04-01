const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function initDatabase() {
    try {
        // Ler o arquivo SQL
        const sqlFile = await fs.readFile(path.join(__dirname, 'init.sql'), 'utf8');
        
        // Executar as queries
        await pool.query(sqlFile);
        
        console.log('Banco de dados inicializado com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
    } finally {
        await pool.end();
    }
}

initDatabase(); 