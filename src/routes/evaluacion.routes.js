const express = require('express');
const router = express.Router();
const EvaluacionController = require('../controllers/evaluacion.controller');

// CRUD Endpoints
router.get('/', EvaluacionController.getAll);
router.post('/', EvaluacionController.createOrUpdate);
router.get('/:id', EvaluacionController.getById);
router.delete('/:id', EvaluacionController.deactivate);

module.exports = router;