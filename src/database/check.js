const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function checkDatabase() {
    try {
        // Testar conexão
        const client = await pool.connect();
        console.log('Conexão com o banco de dados estabelecida com sucesso!');

        // Verificar tabelas
        const tablesQuery = `
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `;
        const tablesResult = await client.query(tablesQuery);
        console.log('\nTabelas encontradas:');
        tablesResult.rows.forEach(table => {
            console.log(`- ${table.table_name}`);
        });

        // Verificar estrutura da tabela ensaios
        const ensaiosColumnsQuery = `
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'ensaios'
        `;
        const ensaiosColumns = await client.query(ensaiosColumnsQuery);
        console.log('\nEstrutura da tabela ensaios:');
        ensaiosColumns.rows.forEach(column => {
            console.log(`- ${column.column_name}: ${column.data_type}`);
        });

        // Verificar estrutura da tabela imagens
        const imagensColumnsQuery = `
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'imagens'
        `;
        const imagensColumns = await client.query(imagensColumnsQuery);
        console.log('\nEstrutura da tabela imagens:');
        imagensColumns.rows.forEach(column => {
            console.log(`- ${column.column_name}: ${column.data_type}`);
        });

        client.release();
    } catch (error) {
        console.error('Erro ao verificar banco de dados:', error);
    } finally {
        await pool.end();
    }
}

checkDatabase(); 