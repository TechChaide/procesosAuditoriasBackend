const express = require('express');
const router = express.Router();
const PreguntaController = require('../controllers/pregunta.controller');

// CRUD Endpoints
router.get('/', PreguntaController.getAll);
router.post('/', PreguntaController.createOrUpdate);
router.get('/:id', PreguntaController.getById);
router.delete('/:id', PreguntaController.deactivate);

module.exports = router;