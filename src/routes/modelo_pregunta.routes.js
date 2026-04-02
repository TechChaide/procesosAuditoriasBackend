const express = require('express');
const router = express.Router();
const Modelo_preguntaController = require('../controllers/modelo_pregunta.controller');

// CRUD Endpoints
router.get('/', Modelo_preguntaController.getAll);
router.post('/', Modelo_preguntaController.createOrUpdate);
router.get('/:id', Modelo_preguntaController.getById);
router.delete('/:id', Modelo_preguntaController.deactivate);

module.exports = router;