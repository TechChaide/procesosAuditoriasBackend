const express = require('express');
const router = express.Router();
const { enviarNotificacionesAuditorias } = require('../services/auditoria-notificacion.service');

/**
 * Prueba las notificaciones de auditorías
 * POST /api/servicios/test-notificaciones
 */
router.post('/test-notificaciones', async (req, res) => {
  try {
    const { diasAntes } = req.body;
    
    console.log('🧪 Prueba manual de notificaciones iniciada...');
    const resultado = await enviarNotificacionesAuditorias(diasAntes);
    
    return res.status(200).json({
      mensaje: 'Prueba de notificaciones completada',
      resultado
    });
  } catch (error) {
    console.error('Error en prueba de notificaciones:', error);
    return res.status(500).json({
      error: 'Error al probar notificaciones',
      detalles: error.message
    });
  }
});

/**
 * Obtiene el estado de las tareas cron
 * GET /api/servicios/status-cron
 */
router.get('/status-cron', async (req, res) => {
  try {
    const ahora = new Date();
    const estado = {
      timestamp: ahora.toISOString(),
      hora_actual: `${ahora.getHours()}:${ahora.getMinutes().toString().padStart(2, '0')}`,
      dia_actual: ahora.getDate(),
      tareas_programadas: [
        {
          nombre: 'Notificación Inicio de Mes',
          hora: '07:55',
          dia: 1,
          estado: 'Activo'
        },
        {
          nombre: 'Notificación Cierre de Mes',
          hora: '07:55',
          dia: 'Día (UltimoDía - DIAS_NOTIFICACION)',
          estado: 'Activo'
        }
      ]
    };
    
    return res.status(200).json(estado);
  } catch (error) {
    console.error('Error obteniendo status cron:', error);
    return res.status(500).json({
      error: 'Error al obtener status de cron',
      detalles: error.message
    });
  }
});

module.exports = router;
