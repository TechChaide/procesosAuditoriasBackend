const express = require('express');
const router = express.Router();
const Puesto_trabajo_preguntaController = require('../controllers/puesto_trabajo_pregunta.controller');

// CRUD Endpoints
router.get('/', Puesto_trabajo_preguntaController.getAll);
router.post('/', Puesto_trabajo_preguntaController.createOrUpdate);
router.get('/:id', Puesto_trabajo_preguntaController.getById);
router.delete('/:id', Puesto_trabajo_preguntaController.deactivate);

router.post('/reporteRespuestaPorPTP', Puesto_trabajo_preguntaController.getReporteEvaluacionesPorPuestoTrabajoPregunta);
router.post('/evaluacionesVisiblesPorDepartamento', Puesto_trabajo_preguntaController.getEvaluacionesVisiblesPorDepartamento);

module.exports = router;