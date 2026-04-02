const express = require('express');
const router = express.Router();
const EstadoController = require('../controllers/estado.controller');

// CRUD Endpoints
router.get('/', EstadoController.getAll);
router.post('/', EstadoController.createOrUpdate);
router.get('/:id', EstadoController.getById);
router.delete('/:id', EstadoController.deactivate);

module.exports = router;