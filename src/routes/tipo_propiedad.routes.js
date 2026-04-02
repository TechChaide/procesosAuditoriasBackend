const express = require('express');
const router = express.Router();
const Tipo_propiedadController = require('../controllers/tipo_propiedad.controller');

// CRUD Endpoints
router.get('/', Tipo_propiedadController.getAll);
router.post('/', Tipo_propiedadController.createOrUpdate);
router.get('/:id', Tipo_propiedadController.getById);
router.delete('/:id', Tipo_propiedadController.deactivate);

module.exports = router;