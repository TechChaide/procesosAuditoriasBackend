const express = require('express');
const router = express.Router();
const Plan_accionController = require('../controllers/plan_accion.controller');

// CRUD Endpoints
router.get('/', Plan_accionController.getAll);
router.post('/', Plan_accionController.createOrUpdate);
router.get('/:id', Plan_accionController.getById);
router.delete('/:id', Plan_accionController.deactivate);


router.post('/PlanesByEvaluacion', Plan_accionController.getPlanesAccionPorCodigoEvaluacion);
module.exports = router;