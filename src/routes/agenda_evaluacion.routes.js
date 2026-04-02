const express = require('express');
const router = express.Router();
const Agenda_evaluacionController = require('../controllers/agenda_evaluacion.controller');

// CRUD Endpoints
router.get('/', Agenda_evaluacionController.getAll);
router.post('/', Agenda_evaluacionController.createOrUpdate);
router.get('/:id', Agenda_evaluacionController.getById);
router.delete('/:id', Agenda_evaluacionController.deactivate);


router.post('/EvaluacionAgendaPorEvaluador', Agenda_evaluacionController.getCalendarioPorCodigoEmpleadoEvaluador);
router.post('/evaluacionesPorEvaluador', Agenda_evaluacionController.getEvaluacionesEvaluador);
module.exports = router;