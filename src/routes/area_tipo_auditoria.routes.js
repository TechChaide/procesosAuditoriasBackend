const express = require('express');
const router = express.Router();
const Area_tipo_auditoriaController = require('../controllers/area_tipo_auditoria.controller');

// CRUD Endpoints
router.get('/', Area_tipo_auditoriaController.getAll);
router.post('/', Area_tipo_auditoriaController.createOrUpdate);
router.get('/:id', Area_tipo_auditoriaController.getById);
router.delete('/:id', Area_tipo_auditoriaController.deactivate);

module.exports = router;