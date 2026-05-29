const express = require('express');
const router = express.Router();
const serviciosController = require('../controllers/servicios.controller');

// CRUD Endpoints
router.post('/PuestoModeloTipoAuditoria', serviciosController.getReporteModeloTipoAuditoria);

router.get('/departamentos', serviciosController.getDepartametos);

//Este endpoint envia el reporte de que ya se evaluó al puesto de trabajo.
router.post('/reportaAuditoriaGenerada', serviciosController.reportaAuditoriaGenerada);

// Nuevo endpoint para enviar reporte de evaluación por correo
router.post('/enviarReporteEvaluacion', serviciosController.enviarReporteEvaluacionPorEmail);

//Endpoints para el dashboard
router.post('/EvaluacionesPorAreaY', serviciosController.getEvaluacionesPorArea);
router.post('/EvaluacionesPorAreaYM', serviciosController.getEvaluacionesPorAreaAnioMes);
router.post('/NotasPTP', serviciosController.getNotasEvaluacionPorCodigoPTP);
router.post('/TipoAuditoriaPTP', serviciosController.getTipoAuditoriaPorCodigoPTP);

router.get('/anioDisponibles', serviciosController.getañosDisponibles);
router.post('/getEvaluacionesRealizadasEvaluador', serviciosController.getEvaluacionesRealizadasEvaluador);
module.exports = router;