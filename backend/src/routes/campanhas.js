const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  criarCampanha,
  listarCampanhas,
  detalharCampanha,
  registrarDoacao,
} = require('../controllers/campanhaController');

router.get('/', auth, listarCampanhas);
router.post('/', auth, criarCampanha);
router.get('/:id', auth, detalharCampanha);
router.post('/:id/doacoes', auth, registrarDoacao);

module.exports = router;
