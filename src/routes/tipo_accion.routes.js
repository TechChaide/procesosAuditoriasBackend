const express = require('express');
const router = express.Router();
const Tipo_accionController = require('../controllers/tipo_accion.controller');

// CRUD Endpoints
router.get('/', Tipo_accionController.getAll);
router.post('/', Tipo_accionController.createOrUpdate);
router.get('/:id', Tipo_accionController.getById);
router.delete('/:id', Tipo_accionController.deactivate);

module.exports = router;