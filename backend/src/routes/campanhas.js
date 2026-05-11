const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const {
  criarCampanha,
  listarCampanhas,
  detalharCampanha,
  registrarDoacao,
} = require('../controllers/campanhaController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB por arquivo
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Apenas imagens são permitidas'));
  },
});

router.get('/', auth, listarCampanhas);
router.post('/', auth, upload.array('fotos', 5), criarCampanha);
router.get('/:id', auth, detalharCampanha);
router.post('/:id/doacoes', auth, registrarDoacao);

module.exports = router;
