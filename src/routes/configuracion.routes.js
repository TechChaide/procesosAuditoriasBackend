const express = require('express');
const router = express.Router();
const ConfiguracionController = require('../controllers/configuracion.controller');

// CRUD Endpoints
router.get('/', ConfiguracionController.getAll);
router.post('/', ConfiguracionController.createOrUpdate);
router.get('/:id', ConfiguracionController.getById);
router.delete('/:id', ConfiguracionController.deactivate);

module.exports = router;