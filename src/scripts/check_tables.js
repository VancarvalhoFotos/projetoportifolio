const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function checkTables() {
    try {
        // Lista todas as tabelas
        const tablesQuery = `
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `;
        const tables = await pool.query(tablesQuery);
        
        console.log('Tabelas existentes:');
        console.log(tables.rows);

        // Para cada tabela, mostra sua estrutura
        for (const table of tables.rows) {
            const structureQuery = `
                SELECT column_name, data_type, character_maximum_length
                FROM information_schema.columns
                WHERE table_name = $1
            `;
            const structure = await pool.query(structureQuery, [table.table_name]);
            
            console.log(`\nEstrutura da tabela ${table.table_name}:`);
            console.log(structure.rows);
        }

    } catch (error) {
        console.error('Erro ao verificar tabelas:', error);
    } finally {
        await pool.end();
    }
}

checkTables(); 