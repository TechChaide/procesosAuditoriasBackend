const express = require('express');
const router = express.Router();
const PlanAccionEstadoController = require('../controllers/plan_accion_estado.controller');

router.get('/', PlanAccionEstadoController.getAll);
router.post('/', PlanAccionEstadoController.createOrUpdate);
router.get('/:id', PlanAccionEstadoController.getById);
router.delete('/:id', PlanAccionEstadoController.deactivate);

router.post('/getPorPlanAccion', PlanAccionEstadoController.getPlanAccionEsadoByCodigoPlanAccion);

module.exports = router;
