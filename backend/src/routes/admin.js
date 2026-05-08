const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { listarPendentes, avaliarCampanha } = require('../controllers/adminController');

router.get('/campanhas', auth, listarPendentes);
router.patch('/campanhas/:id', auth, avaliarCampanha);

module.exports = router;
