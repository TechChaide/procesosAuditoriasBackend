const express = require('express');
const router = express.Router();
const RespuestasController = require('../controllers/respuestas.controller');

// CRUD Endpoints
router.get('/', RespuestasController.getAll);
router.post('/', RespuestasController.createOrUpdate);
router.get('/:id', RespuestasController.getById);
router.delete('/:id', RespuestasController.deactivate);


router.post('/respuestasPorPTP', RespuestasController.getRespuestasPorCodigoPuestoTrabajopregunta);
module.exports = router;