const { pool } = require('../config/database');

class Ensaio {
    static async findAll() {
        const query = `
            SELECT e.*, 
                   COALESCE(json_agg(
                       json_build_object(
                           'url', i.url,
                           'descricao', i.descricao
                       ) ORDER BY i.id
                   ) FILTER (WHERE i.id IS NOT NULL), '[]') as imagens
            FROM ensaios e
            LEFT JOIN imagens i ON e.id = i.ensaio_id
            GROUP BY e.id
            ORDER BY e.data_criacao DESC
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    static async findById(id) {
        const query = `
            SELECT e.*, 
                   COALESCE(json_agg(
                       json_build_object(
                           'url', i.url,
                           'descricao', i.descricao
                       ) ORDER BY i.id
                   ) FILTER (WHERE i.id IS NOT NULL), '[]') as imagens
            FROM ensaios e
            LEFT JOIN imagens i ON e.id = i.ensaio_id
            WHERE e.id = $1
            GROUP BY e.id
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async create(ensaioData) {
        const { titulo, categoria, descricao, imagens } = ensaioData;
        
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Inserir o ensaio
            const ensaioQuery = `
                INSERT INTO ensaios (titulo, categoria, descricao)
                VALUES ($1, $2, $3)
                RETURNING id
            `;
            const ensaioResult = await client.query(ensaioQuery, [titulo, categoria, descricao]);
            const ensaioId = ensaioResult.rows[0].id;

            // Inserir as imagens
            if (imagens && imagens.length > 0) {
                const imagemQuery = `
                    INSERT INTO imagens (ensaio_id, url, descricao)
                    VALUES ($1, $2, $3)
                `;
                for (const imagem of imagens) {
                    await client.query(imagemQuery, [ensaioId, imagem.url, imagem.descricao]);
                }
            }

            await client.query('COMMIT');
            return ensaioId;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async update(id, ensaioData) {
        const { titulo, categoria, descricao } = ensaioData;
        const query = `
            UPDATE ensaios 
            SET titulo = $1, categoria = $2, descricao = $3
            WHERE id = $4
            RETURNING *
        `;
        const result = await pool.query(query, [titulo, categoria, descricao, id]);
        return result.rows[0];
    }

    static async addImage(ensaioId, url, descricao = '') {
        const query = `
            INSERT INTO imagens (ensaio_id, url, descricao)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const result = await pool.query(query, [ensaioId, url, descricao]);
        return result.rows[0];
    }

    static async removeImage(imageId) {
        const query = `
            DELETE FROM imagens 
            WHERE id = $1
            RETURNING *
        `;
        const result = await pool.query(query, [imageId]);
        return result.rows[0];
    }

    static async delete(id) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Primeiro, excluir todas as imagens do ensaio
            const deleteImagensQuery = 'DELETE FROM imagens WHERE ensaio_id = $1';
            await client.query(deleteImagensQuery, [id]);

            // Depois, excluir o ensaio
            const deleteEnsaioQuery = 'DELETE FROM ensaios WHERE id = $1';
            await client.query(deleteEnsaioQuery, [id]);

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = Ensaio; 