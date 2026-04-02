const express = require('express');
const router = express.Router();
const Auditor_area_responsableController = require('../controllers/auditor_area_responsable.controller');

// CRUD Endpoints
router.get('/', Auditor_area_responsableController.getAll);
router.post('/', Auditor_area_responsableController.createOrUpdate);
router.get('/:id', Auditor_area_responsableController.getById);
router.delete('/:id', Auditor_area_responsableController.deactivate);


router.post('/EvaluadorAreaResponsable', Auditor_area_responsableController.getReporteModeloTipoAuditoria);
module.exports = router;