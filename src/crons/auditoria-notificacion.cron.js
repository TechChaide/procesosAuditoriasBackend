const { enviarNotificacionesAuditorias } = require('../services/auditoria-notificacion.service');

/**
 * Calcula la próxima ejecución para un tiempo específico
 */
function calcularProximaEjecucion(hora, minuto) {
  const ahora = new Date();
  let proxima = new Date();
  proxima.setHours(hora, minuto, 0, 0);

  if (proxima <= ahora) {
    proxima.setDate(proxima.getDate() + 1);
  }

  return proxima;
}

/**
 * Planifica una tarea para una hora específica cada día
 */
function planificarTareaDiaria(hora, minuto, callback, nombre) {
  console.log(`📅 Programando tarea: ${nombre} a las ${hora}:${minuto.toString().padStart(2, '0')}`);

  const ejecutar = () => {
    const ahora = new Date();
    if (ahora.getHours() === hora && ahora.getMinutes() === minuto) {
      console.log(`▶️  Ejecutando: ${nombre} a las ${ahora.toLocaleTimeString()}`);
      callback();
    }
  };

  // Ejecutar cada minuto para verificar si es la hora exacta
  setInterval(ejecutar, 60000);

  // Ejecutar inmediatamente si ya es la hora
  const ahora = new Date();
  if (ahora.getHours() === hora && ahora.getMinutes() === minuto) {
    console.log(`▶️  Ejecutando inmediatamente: ${nombre}`);
    callback();
  }
}

/**
 * Obtiene el día para ejecutar la notificación de cierre
 * (Último día del mes menos DIAS_NOTIFICACION)
 */
function obtenerDiaEjecucionCierre(diasAntes = 5) {
  const ahora = new Date();
  const ultimoDia = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0).getDate();
  return Math.max(1, ultimoDia - diasAntes);
}

/**
 * Planifica la notificación del primer día del mes
 */
function planificarNotificacionInicio() {
  const nombre = 'Notificación de Auditorías - Inicio de Mes';
  
  planificarTareaDiaria(7, 55, async () => {
    const ahora = new Date();
    // Solo ejecutar si es el día 1 del mes
    if (ahora.getDate() === 1) {
      console.log('📬 Enviando notificaciones: Inicio de Mes');
      await enviarNotificacionesAuditorias();
    }
  }, nombre);
}

/**
 * Planifica la notificación previa al cierre del mes
 */
function planificarNotificacionCierre() {
  const nombre = 'Notificación de Auditorías - Cierre de Mes';
  
  planificarTareaDiaria(7, 55, async () => {
    const ahora = new Date();
    const diaEjecucion = obtenerDiaEjecucionCierre();
    
    // Solo ejecutar en el día calculado del mes
    if (ahora.getDate() === diaEjecucion) {
      console.log(`📬 Enviando notificaciones: Cierre de Mes (${diaEjecucion})`);
      await enviarNotificacionesAuditorias();
    }
  }, nombre);
}

/**
 * Inicializa todas las tareas cron
 */
function inicializarCronJobs() {
  console.log('\n🚀 Inicializando tareas de Cron...\n');

  try {
    // Tarea 1: Notificación al inicio del mes
    planificarNotificacionInicio();

    // Tarea 2: Notificación previa al cierre del mes
    planificarNotificacionCierre();

    console.log('\n✅ Todas las tareas cron han sido programadas correctamente\n');
  } catch (error) {
    console.error('❌ Error al inicializar tareas cron:', error);
  }
}

module.exports = {
  inicializarCronJobs,
  planificarTareaDiaria,
  obtenerDiaEjecucionCierre
};
