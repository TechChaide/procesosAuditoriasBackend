const express = require('express');
const router = express.Router();
const Tipo_auditoriaController = require('../controllers/tipo_auditoria.controller');

// CRUD Endpoints
router.get('/', Tipo_auditoriaController.getAll);
router.post('/', Tipo_auditoriaController.createOrUpdate);
router.get('/:id', Tipo_auditoriaController.getById);
router.delete('/:id', Tipo_auditoriaController.deactivate);

module.exports = router;