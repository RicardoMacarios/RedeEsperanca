const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { listarOngs, campanhasDaOng } = require('../controllers/ongController');

router.get('/', auth, listarOngs);
router.get('/:id/campanhas', auth, campanhasDaOng);

module.exports = router;
