const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Ensaio = require('../models/Ensaio');
const { upload, uploadToCloudinary } = require('../config/multer');

// Listar todos os ensaios
router.get('/', async (req, res) => {
    try {
        const ensaios = await Ensaio.findAll();
        
        // Organizar ensaios por categoria
        const ensaiosPorCategoria = {};
        ensaios.forEach(ensaio => {
            if (!ensaiosPorCategoria[ensaio.categoria]) {
                ensaiosPorCategoria[ensaio.categoria] = [];
            }
            ensaiosPorCategoria[ensaio.categoria].push(ensaio);
        });

        res.render('ensaios', { 
            ensaiosPorCategoria,
            path: '/ensaios'
        });
    } catch (error) {
        console.error('Erro ao carregar ensaios:', error);
        res.status(500).send('Erro ao carregar os ensaios');
    }
});

// Página de detalhes do ensaio
router.get('/:id', async (req, res) => {
    try {
        const ensaio = await Ensaio.findById(req.params.id);
        if (!ensaio) {
            return res.status(404).send('Ensaio não encontrado');
        }
        res.render('ensaio-detalhes', { 
            ensaio,
            path: '/ensaios'
        });
    } catch (error) {
        console.error('Erro ao carregar ensaio:', error);
        res.status(500).send('Erro ao carregar o ensaio');
    }
});

// Formulário para criar novo ensaio
router.get('/novo', (req, res) => {
    res.render('novo-ensaio', { error: null });
});

// Criar novo ensaio
router.post('/novo', (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).render('novo-ensaio', {
                        error: 'O tamanho máximo permitido para cada imagem é de 50MB.'
                    });
                }
                if (err.code === 'LIMIT_FILE_COUNT') {
                    return res.status(400).render('novo-ensaio', {
                        error: 'O número máximo de imagens permitido é 5.'
                    });
                }
            }
            return res.status(400).render('novo-ensaio', {
                error: err.message
            });
        }

        try {
            const { titulo, categoria, descricao } = req.body;
            const imagens = [];

            // Upload das imagens para o Cloudinary
            if (req.files && req.files.length > 0) {
                for (const file of req.files) {
                    try {
                        const cloudinaryUrl = await uploadToCloudinary(file);
                        imagens.push({
                            url: cloudinaryUrl,
                            descricao: ''
                        });
                    } catch (error) {
                        console.error('Erro ao fazer upload da imagem:', error);
                        return res.status(500).render('novo-ensaio', {
                            error: 'Erro ao fazer upload das imagens. Por favor, tente novamente.'
                        });
                    }
                }
            }

            await Ensaio.create({
                titulo,
                categoria,
                descricao,
                imagens
            });

            res.redirect('/ensaios');
        } catch (error) {
            console.error('Erro ao criar ensaio:', error);
            res.status(500).render('novo-ensaio', {
                error: 'Erro ao criar o ensaio. Por favor, tente novamente.'
            });
        }
    });
});

module.exports = router; 