const express = require('express');
const router = express.Router();
const ModeloController = require('../controllers/modelo.controller');

// CRUD Endpoints
router.get('/', ModeloController.getAll);
router.post('/', ModeloController.createOrUpdate);
router.get('/:id', ModeloController.getById);
router.delete('/:id', ModeloController.deactivate);

router.post('/BancoPreguntasPorModelo', ModeloController.getBancoDePreguntasPropiedadesByCodigoModelo);

module.exports = router;