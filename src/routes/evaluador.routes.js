const express = require('express');
const router = express.Router();
const EvaluadorController = require('../controllers/evaluador.controller');

// CRUD Endpoints
router.get('/', EvaluadorController.getAll);
router.post('/', EvaluadorController.createOrUpdate);
router.get('/:id', EvaluadorController.getById);
router.delete('/:id', EvaluadorController.deactivate);

module.exports = router;