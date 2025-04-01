const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Ensaio = require('../models/Ensaio');
const { upload, uploadToCloudinary } = require('../config/multer');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const ensaiosRouter = require('./ensaios');
const adminRoutes = require('./admin');
const auth = require('../middleware/auth');

// Rota principal
router.get('/', async (req, res) => {
    try {
        const ensaios = await Ensaio.findAll();
        
        // Organiza os ensaios por categoria
        const ensaiosPorCategoria = {
            newborn: ensaios.filter(e => e.categoria === 'Newborn'),
            mensal: ensaios.filter(e => e.categoria === 'Acompanhamento Mensal'),
            smash: ensaios.filter(e => e.categoria === 'Smash The Cake'),
            gestante: ensaios.filter(e => e.categoria === 'Gestante'),
            especial: ensaios.filter(e => !['Newborn', 'Acompanhamento Mensal', 'Smash The Cake', 'Gestante'].includes(e.categoria))
        };

        res.render('index', {
            ensaiosPorCategoria,
            path: '/'
        });
    } catch (error) {
        console.error('Erro ao carregar página inicial:', error);
        res.status(500).send('Erro ao carregar a página inicial');
    }
});

// Rota de contato
router.post('/contato', async (req, res) => {
    const { nome, email, telefone, mensagem } = req.body;

    try {
        await db.query(
            'INSERT INTO contatos (nome, email, telefone, mensagem) VALUES ($1, $2, $3, $4)',
            [nome, email, telefone, mensagem]
        );

        req.flash('success', 'Mensagem enviada com sucesso! Entraremos em contato em breve.');
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        req.flash('error', 'Erro ao enviar mensagem. Por favor, tente novamente.');
    }

    res.redirect('/#contato');
});

// Usar as rotas de ensaios
router.use('/ensaios', ensaiosRouter);

// Rotas administrativas
router.use('/admin', adminRoutes);

// Proteger a rota de novo ensaio
router.use('/novo-ensaio', auth.isAuthenticated, ensaiosRouter);

// Rota de ensaios
router.get('/ensaios', async (req, res) => {
    try {
        const ensaios = await Ensaio.findAll();
        
        // Organiza os ensaios por categoria
        const ensaiosPorCategoria = {
            newborn: ensaios.filter(e => e.categoria === 'Newborn'),
            mensal: ensaios.filter(e => e.categoria === 'Acompanhamento Mensal'),
            smash: ensaios.filter(e => e.categoria === 'Smash The Cake'),
            gestante: ensaios.filter(e => e.categoria === 'Gestante'),
            especial: ensaios.filter(e => !['Newborn', 'Acompanhamento Mensal', 'Smash The Cake', 'Gestante'].includes(e.categoria))
        };

        res.render('ensaios', {
            ensaiosPorCategoria,
            path: '/ensaios'
        });
    } catch (error) {
        console.error('Erro ao carregar ensaios:', error);
        res.status(500).send('Erro ao carregar os ensaios');
    }
});

module.exports = router; 