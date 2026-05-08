const express = require('express');
const router = express.Router();
const { cadastrarVoluntario, cadastrarOng, login, me } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/cadastro/voluntario', cadastrarVoluntario);
router.post('/cadastro/ong', cadastrarOng);
router.post('/login', login);
router.get('/me', authMiddleware, me);

module.exports = router;
