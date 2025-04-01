const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

class Usuario {
    static async findByEmail(email) {
        const query = 'SELECT * FROM "User" WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }

    static async create(usuarioData) {
        const { name, email, password } = usuarioData;
        const senhaHash = await bcrypt.hash(password, 10);
        
        const query = `
            INSERT INTO "User" (name, email, password, role, "createdAt", "updatedAt")
            VALUES ($1, $2, $3, 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING id, name, email, role
        `;
        const result = await pool.query(query, [name, email, senhaHash]);
        return result.rows[0];
    }

    static async verificarSenha(senha, senhaHash) {
        if (!senha || !senhaHash) {
            return false;
        }
        try {
            return await bcrypt.compare(senha, senhaHash);
        } catch (error) {
            console.error('Erro ao verificar senha:', error);
            return false;
        }
    }
}

module.exports = Usuario; 