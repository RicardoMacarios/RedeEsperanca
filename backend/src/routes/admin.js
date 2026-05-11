const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const { listarPendentes, avaliarCampanha, listarTodas, excluirCampanha, listarOngs, excluirOng } = require('../controllers/adminController');

router.get('/campanhas', auth, isAdmin, listarPendentes);
router.get('/campanhas/todas', auth, isAdmin, listarTodas);
router.patch('/campanhas/:id', auth, isAdmin, avaliarCampanha);
router.delete('/campanhas/:id', auth, isAdmin, excluirCampanha);
router.get('/ongs', auth, isAdmin, listarOngs);
router.delete('/ongs/:id', auth, isAdmin, excluirOng);

module.exports = router;
