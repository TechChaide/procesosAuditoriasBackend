const nodemailer = require('nodemailer');

// Configurar transporter con Mail Relay
const transporter = nodemailer.createTransport({
  host: "10.93.2.19",
  port: 25,
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
});



async function enviarCorreoAuditoria(area, puesto_trabajo, fecha, correos, tipo_auditoria) {
  // Si no hay correos, no hacer nada
  if (!correos || typeof correos !== 'string' || correos.trim().length === 0) {
    return;
  }

  // Procesar la lista de correos: dividir por comas y limpiar espacios
  const listaCorreos = correos
    .split(',')
    .map(correo => correo.trim())
    .filter(correo => correo.length > 0 && correo.includes('@'));

  // Si no hay correos válidos después de filtrar, no hacer nada
  if (listaCorreos.length === 0) {
    return;
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notificación de Auditoría</title>
    <style>
        body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8f9fa;
            padding: 20px;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            line-height: 1.6;
        }
        .header {
            border-bottom: 2px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
        .content {
            margin: 20px 0;
        }
        .footer {
            border-top: 1px solid #e0e0e0;
            padding-top: 20px;
            margin-top: 30px;
            font-size: 14px;
            color: #666;
        }
        .highlight {
            background-color: #f0f8ff;
            padding: 2px 6px;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin: 0; color: #007bff;">Notificación de ${tipo_auditoria}</h2>
        </div>

        <div class="content">
            <p>Estimados,</p>

            <p>Le informamos que se ha realizado la auditoría
            correspondiente a <span class="highlight">${area}</span> - <span class="highlight">${puesto_trabajo}</span> el día <span class="highlight">${fecha}</span>.</p>

            <p>El informe completo se encuentra disponible en el sistema
            para su revisión.</p>

            <p>En caso de existir no conformidades, le solicitamos
            gestionar las acciones correctivas correspondientes dentro del plazo
            establecido en el sistema.</p>

            <p>Para cualquier consulta adicional, puede comunicarse con el
            área de Calidad.</p>

            <p>Agradecemos su atención y gestión oportuna.</p>

            <p>Saludos cordiales.</p>
        </div>
    </div>
</body>
</html>
  `; 

  try {
    await transporter.sendMail({
      from: 'info@chaideychaide.com',
      to: listaCorreos.join(', '),
      subject: `Notificación de Auditoría - ${area} - ${puesto_trabajo}`,
      html: htmlContent
    });
    console.log(`Correo de auditoría enviado exitosamente a: ${listaCorreos.join(', ')}`);
  } catch (err) {
    console.error('Error al enviar correo de auditoría:', err);
    throw err;
  }
}

async function enviarReporteEvaluacion(correoDestino, area, puesto_trabajo, respuestas, calificacionPromedio) {
  // Si no hay correo, no hacer nada
  if (!correoDestino || typeof correoDestino !== 'string' || correoDestino.trim().length === 0) {
    return;
  }

  // Validar que el correo sea válido
  if (!correoDestino.includes('@')) {
    return;
  }

  // Construir las filas de la tabla
  let tablasFilas = '';
  respuestas.forEach((respuesta) => {
    const descripcion = respuesta.pregunta?.descripcion_pregunta || 'N/A';
    const respuestaTexto = respuesta.respuesta || 'N/A';
    
    // Mapear respuestas ternarias a texto legible
    let respuestaMapeada = respuestaTexto;
    if (respuestaTexto.toLowerCase() === 'cumple') {
      respuestaMapeada = 'Cumple';
    } else if (respuestaTexto.toLowerCase() === 'no_cumple') {
      respuestaMapeada = 'No Cumple';
    } else if (respuestaTexto.toLowerCase() === 'no_aplica') {
      respuestaMapeada = 'No Aplica';
    }

    // Calcular calificación individual
    const calificacion = (respuestaTexto.toLowerCase() === 'cumple' || respuestaTexto.toLowerCase() === 'no_aplica') ? '100%' : '0%';

    tablasFilas += `
      <tr>
        <td style="padding: 12px; border: 1px solid #ddd; text-align: left;">${descripcion}</td>
        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${respuestaMapeada}</td>
        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${calificacion}</td>
      </tr>
    `;
  });

  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Evaluación</title>
    <style>
        body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8f9fa;
            padding: 20px;
            color: #333;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            line-height: 1.6;
        }
        .header {
            border-bottom: 2px solid #28a745;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
        .content {
            margin: 20px 0;
        }
        .footer {
            border-top: 1px solid #e0e0e0;
            padding-top: 20px;
            margin-top: 30px;
            font-size: 14px;
            color: #666;
        }
        .highlight {
            background-color: #f0f8ff;
            padding: 2px 6px;
            border-radius: 3px;
        }
        .table-container {
            margin: 20px 0;
            overflow-x: auto;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background-color: #fff;
        }
        th {
            background-color: #28a745;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .score-container {
            margin-top: 20px;
            padding: 15px;
            background-color: #e8f5e9;
            border-left: 4px solid #28a745;
            border-radius: 4px;
        }
        .score-value {
            font-size: 24px;
            font-weight: bold;
            color: #28a745;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin: 0; color: #28a745;">Reporte de Evaluación - Auditoría Completada</h2>
        </div>

        <div class="content">
            <p>Estimado Auditor,</p>

            <p>Le informamos que la evaluación ha sido realizada <strong>exitosamente</strong> para:</p>
            
            <p>
                <strong>Área:</strong> <span class="highlight">${area}</span><br>
                <strong>Puesto de Trabajo:</strong> <span class="highlight">${puesto_trabajo}</span>
            </p>

            <h3>Detalle de Respuestas</h3>
            
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Descripción de Pregunta</th>
                            <th>Respuesta</th>
                            <th>Calificación</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tablasFilas}
                    </tbody>
                </table>
            </div>

            <div class="score-container">
                <p style="margin: 0; color: #666;">Calificación General:</p>
                <div class="score-value">${calificacionPromedio}%</div>
            </div>

            <p style="margin-top: 20px;">El informe completo se encuentra disponible en el sistema para su revisión y gestión de acciones correctivas si fuese necesario.</p>

            <p>Agradecemos su dedicación y compromiso con la calidad.</p>
        </div>

        <div class="footer">
            <p style="margin: 0;">Este es un correo automático del sistema de Procesos de Auditorías.</p>
        </div>
    </div>
</body>
</html>
  `;

  try {
    await transporter.sendMail({
      from: 'info@chaideychaide.com',
      to: correoDestino,
      subject: `Reporte de Evaluación - ${area} - ${puesto_trabajo}`,
      html: htmlContent
    });
    console.log(`Correo de reporte de evaluación enviado exitosamente a: ${correoDestino}`);
  } catch (err) {
    console.error('Error al enviar correo de reporte de evaluación:', err);
    throw err;
  }
}

module.exports = { enviarCorreoAuditoria, enviarReporteEvaluacion };