const express = require('express');
const router = express.Router();
const Puesto_trabajoController = require('../controllers/puesto_trabajo.controller');

// CRUD Endpoints
router.get('/', Puesto_trabajoController.getAll);
router.post('/', Puesto_trabajoController.createOrUpdate);
router.get('/:id', Puesto_trabajoController.getById);
router.delete('/:id', Puesto_trabajoController.deactivate);

router.post('/evalsPorPuestoTrabajo', Puesto_trabajoController.getReporteEvaluacionesPorPuestoTrabajo);
module.exports = router;