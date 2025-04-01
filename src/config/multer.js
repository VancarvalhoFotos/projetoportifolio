const multer = require('multer');
const cloudinary = require('./cloudinary');
const sharp = require('sharp');

// Configuração do multer para armazenamento em memória
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Apenas imagens são permitidas!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
        files: 5
    }
}).array('imagens', 5);

// Função para otimizar imagem
const optimizeImage = async (buffer, mimetype) => {
    try {
        // Criar uma instância do Sharp com o buffer da imagem
        const image = sharp(buffer);
        
        // Obter os metadados da imagem
        const metadata = await image.metadata();
        
        // Se a imagem for maior que 1920px de largura, redimensionar mantendo a proporção
        if (metadata.width > 1920) {
            image.resize(1920, null, {
                fit: 'inside',
                withoutEnlargement: true
            });
        }
        
        // Otimizar a imagem baseado no tipo
        if (mimetype === 'image/jpeg') {
            return image.jpeg({
                quality: 85,
                progressive: true,
                optimizeScans: true
            }).toBuffer();
        } else if (mimetype === 'image/png') {
            return image.png({
                quality: 85,
                progressive: true,
                compressionLevel: 9
            }).toBuffer();
        } else {
            // Para outros formatos, apenas converter para JPEG
            return image.jpeg({
                quality: 85,
                progressive: true,
                optimizeScans: true
            }).toBuffer();
        }
    } catch (error) {
        console.error('Erro ao otimizar imagem:', error);
        throw error;
    }
};

// Função para fazer upload para o Cloudinary
const uploadToCloudinary = async (file) => {
    try {
        // Otimizar a imagem antes do upload
        const optimizedBuffer = await optimizeImage(file.buffer, file.mimetype);
        
        // Converter o buffer otimizado para base64
        const b64 = optimizedBuffer.toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;

        // Fazer upload direto para o Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'portfolio',
            resource_type: 'auto'
        });
        return result.secure_url;
    } catch (error) {
        console.error('Erro ao fazer upload para o Cloudinary:', error);
        throw error;
    }
};

module.exports = { upload, uploadToCloudinary }; 