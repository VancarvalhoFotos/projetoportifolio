const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Ensaio = require('../models/Ensaio');
const { isAuthenticated, isNotAuthenticated } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../config/multer');

// Página de login
router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('admin/login', { error: null });
});

// Processar login
router.post('/login', isNotAuthenticated, async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.render('admin/login', { error: 'Por favor, preencha todos os campos' });
        }

        const usuario = await Usuario.findByEmail(email);

        if (!usuario || usuario.role !== 'ADMIN') {
            return res.render('admin/login', { error: 'Email ou senha inválidos' });
        }

        if (!usuario.password) {
            return res.render('admin/login', { error: 'Erro na configuração do usuário' });
        }

        const senhaValida = await Usuario.verificarSenha(password, usuario.password);
        if (!senhaValida) {
            return res.render('admin/login', { error: 'Email ou senha inválidos' });
        }

        req.session.usuario = {
            id: usuario.id,
            name: usuario.name,
            email: usuario.email,
            role: usuario.role
        };

        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Erro no login:', error);
        res.render('admin/login', { error: 'Erro ao fazer login' });
    }
});

// Dashboard
router.get('/dashboard', isAuthenticated, async (req, res) => {
    try {
        // Buscar estatísticas
        const pool = require('../config/database').pool;
        const ensaiosQuery = await pool.query('SELECT COUNT(*) FROM ensaios');
        const fotosQuery = await pool.query('SELECT COUNT(*) FROM imagens');
        const ensaiosRecentes = await pool.query(`
            SELECT e.*, 
                   (SELECT url FROM imagens WHERE ensaio_id = e.id LIMIT 1) as imagem_capa
            FROM ensaios e 
            ORDER BY data_criacao DESC 
            LIMIT 6
        `);
        
        res.render('admin/dashboard', {
            usuario: req.session.usuario,
            totalEnsaios: ensaiosQuery.rows[0].count,
            totalFotos: fotosQuery.rows[0].count,
            ensaios: ensaiosRecentes.rows,
            path: '/admin/dashboard'
        });
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        res.status(500).send('Erro ao carregar o dashboard');
    }
});

// Logout
router.get('/logout', isAuthenticated, (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

// Rota para editar ensaio
router.get('/ensaios/:id/editar', isAuthenticated, async (req, res) => {
    try {
        const ensaio = await Ensaio.findById(req.params.id);
        if (!ensaio) {
            return res.status(404).send('Ensaio não encontrado');
        }
        res.render('admin/editar-ensaio', {
            ensaio,
            usuario: req.session.usuario,
            path: '/admin/ensaios'
        });
    } catch (error) {
        console.error('Erro ao carregar ensaio:', error);
        res.status(500).send('Erro ao carregar o ensaio');
    }
});

// Processar edição do ensaio
router.post('/ensaios/:id/editar', isAuthenticated, upload, async (req, res) => {
    try {
        const { titulo, categoria, descricao } = req.body;
        const ensaioId = req.params.id;

        // Atualizar informações do ensaio
        await Ensaio.update(ensaioId, { titulo, categoria, descricao });

        // Processar novas imagens
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await uploadToCloudinary(file);
                await Ensaio.addImage(ensaioId, result);
            }
        }

        // Processar remoção de imagens
        if (req.body.removeImages) {
            const imagesToRemove = JSON.parse(req.body.removeImages);
            for (const imageId of imagesToRemove) {
                await Ensaio.removeImage(imageId);
            }
        }

        res.redirect('/admin/ensaios');
    } catch (error) {
        console.error('Erro ao atualizar ensaio:', error);
        res.status(500).send('Erro ao atualizar o ensaio');
    }
});

// Rota para criar novo ensaio
router.get('/novo-ensaio', isAuthenticated, (req, res) => {
    res.render('admin/novo-ensaio', {
        usuario: req.session.usuario,
        path: '/admin/novo-ensaio'
    });
});

// Processar criação do ensaio
router.post('/novo-ensaio', isAuthenticated, upload, async (req, res) => {
    try {
        const { titulo, categoria, descricao } = req.body;

        // Criar o ensaio
        const ensaioId = await Ensaio.create({
            titulo,
            categoria,
            descricao,
            imagens: []
        });

        // Processar as imagens
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await uploadToCloudinary(file);
                await Ensaio.addImage(ensaioId, result);
            }
        }

        res.redirect('/admin/ensaios');
    } catch (error) {
        console.error('Erro ao criar ensaio:', error);
        res.status(500).send('Erro ao criar o ensaio');
    }
});

// Listar todos os ensaios
router.get('/ensaios', isAuthenticated, async (req, res) => {
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

        res.render('admin/ensaios', {
            ensaiosPorCategoria,
            usuario: req.session.usuario,
            path: '/admin/ensaios'
        });
    } catch (error) {
        console.error('Erro ao carregar ensaios:', error);
        res.status(500).send('Erro ao carregar os ensaios');
    }
});

// Rota para excluir ensaio
router.post('/ensaios/:id/excluir', isAuthenticated, async (req, res) => {
    try {
        await Ensaio.delete(req.params.id);
        res.redirect('/admin/ensaios');
    } catch (error) {
        console.error('Erro ao excluir ensaio:', error);
        res.status(500).send('Erro ao excluir o ensaio');
    }
});

module.exports = router; 