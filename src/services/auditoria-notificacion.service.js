const { sequelize } = require('../models/index');
const nodemailer = require('nodemailer');
const { Configuracion } = require('../models');

// Configurar transporter con Mail Relay
const transporter = nodemailer.createTransport({
  host: "10.93.2.19",
  port: 25,
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
  // Datos de autenticación si el servidor los requiere
  auth: process.env.MAIL_USER && process.env.MAIL_PASSWORD ? {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  } : undefined
});

/**
 * Obtiene el valor de una configuración
 */
async function obtenerConfiguracion(nombre) {
  try {
    const config = await Configuracion.findOne({
      where: { nombre_configuracion: nombre, estado: 'A' }
    });
    return config ? config.valor_configuracion : null;
  } catch (error) {
    console.error(`Error al obtener configuración ${nombre}:`, error);
    return null;
  }
}

/**
 * Ejecuta el SP sp_Get_evaluacionesMesActual y obtiene las evaluaciones
 */
async function obtenerEvaluacionesMesActual() {
  try {
    const query = `EXEC sp_Get_evaluacionesMesActual`;
    const results = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
    return results;
  } catch (error) {
    console.error('Error al ejecutar sp_Get_evaluacionesMesActual:', error.message);
    return [];
  }
}

/**
 * Calcula los días restantes hasta una fecha
 */
function calcularDiasRestantes(fechaVencimiento) {
  const hoy = new Date();
  const fecha = new Date(fechaVencimiento);
  const diferencia = fecha - hoy;
  const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  return dias;
}

/**
 * Genera el HTML del correo de notificación
 */
function generarHtmlNotificacion(nombreAuditor, dias, area, puesto, fechaInicio, fechaFin) {
  const baseFecha = new Date(fechaInicio);
  const finFecha = new Date(fechaFin);
  
  const formatoFecha = (fecha) => {
    return fecha.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { width: 80%; margin: 20px auto; border: 1px solid #ddd; border-top: 5px solid #0055b6; padding: 20px; border-radius: 8px; }
        .header { font-size: 22px; font-weight: bold; color: #0055b6; margin-bottom: 10px; }
        .alert-box { background-color: #fef4e5; border-left: 4px solid #0055b6; padding: 15px; margin: 20px 0; }
        .details-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .details-table td { padding: 10px; border-bottom: 1px solid #eee; }
        .label { font-weight: bold; width: 30%; color: #555; }
        .urgent { color: #d9534f; font-weight: bold; font-size: 1.1em; }
        .footer { font-size: 12px; color: #888; margin-top: 30px; text-align: center; border-top: 1px solid #eee; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Notificación de Auditoría Pendiente</div>
        
        <p>Estimado(a) <strong>${nombreAuditor || 'Auditor'}</strong>,</p>
        
        <p>Se le notifica que tiene programada una auditoría pendiente de realizar con los siguientes detalles:</p>

        <div class="alert-box">
            Quedan <span class="urgent">${dias} días</span> para la fecha de vencimiento.
        </div>

        <table class="details-table">
            <tr>
                <td class="label">Área:</td>
                <td>${area || 'N/A'}</td>
            </tr>
            <tr>
                <td class="label">Puesto de Trabajo:</td>
                <td>${puesto || 'N/A'}</td>
            </tr>
            <tr>
                <td class="label">Fecha Inicio:</td>
                <td>${formatoFecha(baseFecha)}</td>
            </tr>
            <tr>
                <td class="label">Fecha Vencimiento:</td>
                <td>${formatoFecha(finFecha)}</td>
            </tr>
        </table>

        <p>Por favor, asegúrese de completar el proceso antes de la fecha límite establecida.</p>

        <div class="footer">
            Este es un mensaje automático generado por el Sistema de Auditorías.<br>
        </div>
    </div>
</body>
</html>`;
}

/**
 * Envía notificaciones de auditorías pendientes
 * @param {number} diasAntes - Días antes del vencimiento para enviar notificación (opcional)
 */
async function enviarNotificacionesAuditorias(diasAntes = null) {
  try {
    console.log(`[${new Date().toISOString()}] Iniciando notificación de auditorías...`);
    
    // Obtener configuración de días de notificación
    const diasNotificacion = await obtenerConfiguracion('DIAS_NOTIFICACION');
    const diasUmbrales = diasAntes !== null ? diasAntes : (diasNotificacion ? parseInt(diasNotificacion) : 5);
    
    console.log(`Días de umbral de notificación: ${diasUmbrales}`);
    
    // Obtener evaluaciones del mes actual
    const evaluaciones = await obtenerEvaluacionesMesActual();
    
    console.log(`Evaluaciones obtenidas: ${evaluaciones.length}`);
    
    if (!evaluaciones || evaluaciones.length === 0) {
      return { success: true, mensaje: 'No hay evaluaciones pendientes', notificacionesEnviadas: 0, errores: 0 };
    }

    let notificacionesEnviadas = 0;
    let errores = 0;

    // Procesar cada evaluación
    for (const evaluacion of evaluaciones) {
      try {
        // Usar dias_para_vencer del SP directamente
        const dias = evaluacion.dias_para_vencer || calcularDiasRestantes(evaluacion.fecha_fin);
        
        // TODO: Descomentar validación de umbral después de pruebas
        // if (dias > 0 && dias <= diasUmbrales) {
        if (dias > 0) {
          const htmlContent = generarHtmlNotificacion(
            evaluacion.nombre_evaluador || 'Auditor',
            dias,
            evaluacion.nombre_area || 'N/A',
            evaluacion.nombre_puesto_trabajo || 'N/A',
            evaluacion.fecha_inicio || new Date(),
            evaluacion.fecha_fin || new Date()
          );

          const mailOptions = {
            from: 'info@chaideychaide.com',
            to: evaluacion.correo_evaluador,
            subject: `Auditorías registradas`,
            html: htmlContent
          };

          // Validar que el correo sea válido
          if (!evaluacion.correo_evaluador || !evaluacion.correo_evaluador.includes('@')) {
            errores++;
            continue;
          }

          // Enviar correo
          await transporter.sendMail(mailOptions);
          notificacionesEnviadas++;
        } else if (dias <= 0) {
          // Auditoría ya vencida
        }
      } catch (error) {
        errores++;
      }
    }

    const resultado = {
      success: notificacionesEnviadas > 0,
      notificacionesEnviadas,
      errores,
      timestamp: new Date().toISOString()
    };

    return resultado;
  } catch (error) {
    console.error('Error en enviarNotificacionesAuditorias:', error);
    return { success: false, error: error.message, notificacionesEnviadas: 0, errores: 1 };
  }
}

module.exports = {
  enviarNotificacionesAuditorias,
  obtenerConfiguracion,
  obtenerEvaluacionesMesActual,
  calcularDiasRestantes,
  generarHtmlNotificacion
};
