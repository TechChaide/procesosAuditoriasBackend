const db = require("../models");
const { handleError } = require("../helpers/error.helper");
const { QueryTypes } = require("sequelize");
const { enviarCorreoAuditoria, enviarReporteEvaluacion } = require("../mailer/mailer");
const { Respuestas, Pregunta, Evaluacion, Puesto_trabajo_pregunta } = require("../models");

module.exports = {
  getReporteModeloTipoAuditoria: async (req, res) => {
    const {codigo_puesto_trabajo, codigo_tipo_auditoria} = req.body;
    try {
      const resultado = await db.sequelize.query(
        `EXEC [${process.env.DB_NAME}].[dbo].[sp_TiposAuditoriaModeloPorPuestoTrabajo] :CodigoPuesto, :CodigoTipoAuditoria `,
        {
          type: QueryTypes.SELECT,
            replacements: { CodigoPuesto : codigo_puesto_trabajo, CodigoTipoAuditoria: codigo_tipo_auditoria },
        }
      );

      // Para acceder al valor: resultado.total
      res.status(200).json({
        data: resultado,
        length: resultado.length,
      });
    } catch (error) {
      console.error("Error al obtener el total de registros:", error);
      res.status(500).json({
        msg: "Error en el servidor al obtener el total de registros.",
      });
    }
  },


  getDepartametos: async (req, res) => {
    try {
      const resultado = await db.sequelize.query(
        `EXEC [${process.env.DB_NAME}].[dbo].[sp_Get_DepartamentosReales]`,
        {
          type: QueryTypes.SELECT,
        }
      );

      // Para acceder al valor: resultado.total
      res.status(200).json({
        data: resultado,
        length: resultado.length,
      });
    } catch (error) {
      console.error("Error al obtener el total de registros:", error);
      res.status(500).json({
        msg: "Error en el servidor al obtener el total de registros.",
      });
    }
  },


  reportaAuditoriaGenerada: async (req, res) => {
    const { nombre_area, nombre_puesto_trabajo, fecha_evaluacion, correos_notificar, tipo_auditoria } = req.body;
    try {
      // Validar que todos los campos requeridos estén presentes
      if (!nombre_area || !nombre_puesto_trabajo || !fecha_evaluacion) {
        return res.status(400).json({
          msg: "Faltan campos requeridos: nombre_area, nombre_puesto_trabajo, fecha_evaluacion",
        });
      }

      // Enviar correo solo si hay destinatarios
      if (correos_notificar && typeof correos_notificar === 'string' && correos_notificar.trim().length > 0) {
        try {
          await enviarCorreoAuditoria(
            nombre_area,
            nombre_puesto_trabajo,
            fecha_evaluacion,
            correos_notificar,
            tipo_auditoria
          );
        } catch (emailError) {
          console.error("Error al enviar correo de auditoría:", emailError);
        }
      }

      res.status(200).json({
        msg: "Auditoría reportada exitosamente.",
      });
    } catch (error) {
      console.error("Error al reportar la auditoría generada:", error);
      res.status(500).json({
        msg: "Error en el servidor al reportar la auditoría generada.",
      });
    }
  },


  ///*///////////////////////////////Metodospara el dashboard de auditorias///////////////////////////////*///
  getEvaluacionesPorArea: async (req, res) => {
    const { CodigoArea, year} = req.body;
    try {

      if (!CodigoArea || !year) {
        return res.status(400).json({
          msg: "Faltan campos requeridos: CodigoArea, year",
        });
      }

      const resultado = await db.sequelize.query(
        `EXEC [${process.env.DB_NAME}].[dbo].[sp_Get_EvaluacionesArea] :CodigoArea, :Year `,
        {
          type: QueryTypes.SELECT,
            replacements: { CodigoArea : CodigoArea, Year: year },
        }
      );

      // Para acceder al valor: resultado.total
      res.status(200).json({
        data: resultado,
        length: resultado.length,
      });
    } catch (error) {
      console.error("Error al obtener el total de registros:", error);
      res.status(500).json({
        msg: "Error en el servidor al obtener el total de registros.",
      });
    }
  },



  getNotasEvaluacionPorCodigoPTP: async (req, res) => {
    const { CODIGOPTP } = req.body;
    try {

      if (!CODIGOPTP) {
        return res.status(400).json({
          msg: "Faltan campos requeridos: CODIGOPTP",
        });
      }

      const resultado = await db.sequelize.query(
        `EXEC [${process.env.DB_NAME}].[dbo].[sp_ObtenerNotaPorEvaluacionyPTP] :CODIGOPTP `,
        {
          type: QueryTypes.SELECT,
            replacements: { CODIGOPTP : CODIGOPTP },
        }
      );

      // Para acceder al valor: resultado.total
      res.status(200).json({
        data: resultado,
        length: resultado.length,
      });
    } catch (error) {
      console.error("Error al obtener las notas de evaluación por CODIGOPTP:", error);
      res.status(500).json({
        msg: "Error en el servidor al obtener las notas de evaluación por CODIGOPTP.",
      });
    }
  },


  getTipoAuditoriaPorCodigoPTP: async (req, res) => {
    const { codigo } = req.body;
    try {

      if (!codigo) {
        return res.status(400).json({
          msg: "Faltan campos requeridos: codigo",
        });
      }

      const resultado = await db.sequelize.query(
        `EXEC [${process.env.DB_NAME}].[dbo].[sp_Get_TipoAuditoriaByPTP] :codigo `,
        {
          type: QueryTypes.SELECT,
            replacements: { codigo : codigo },
        }
      );

      // Para acceder al valor: resultado.total
      res.status(200).json({
        data: resultado,
        length: resultado.length,
      });
    } catch (error) {
      console.error("Error al obtener las notas de evaluación por CODIGOPTP:", error);
      res.status(500).json({
        msg: "Error en el servidor al obtener las notas de evaluación por CODIGOPTP.",
      });
    }
  },


  getañosDisponibles: async (req, res) => {
    try {

      const resultado = await db.sequelize.query(
        `EXEC [${process.env.DB_NAME}].[dbo].[get_AniosEvaluacionesUnicos] `,
        {
          type: QueryTypes.SELECT,
        }
      );

      // Para acceder al valor: resultado.total
      res.status(200).json({
        data: resultado,
        length: resultado.length,
      });
    } catch (error) {
      console.error("Error al obtener los años disponibles:", error);
      res.status(500).json({
        msg: "Error en el servidor al obtener los años disponibles.",
      });
    }
  },

  getEvaluacionesRealizadasEvaluador: async (req, res) => {
    const {evaluador, anio} = req.body;
    try {

      const resultado = await db.sequelize.query(
        `EXEC [${process.env.DB_NAME}].[dbo].[get_EvaluacionesAuditorPorAnioYEvaluador] :evaluador, :anio `,
        {
          type: QueryTypes.SELECT,
          replacements: { evaluador: evaluador, anio: anio },
        }
      );

      // Para acceder al valor: resultado.total
      res.status(200).json({
        data: resultado,
        length: resultado.length,
      });
    } catch (error) {
      console.error("Error al obtener los años disponibles:", error);
      res.status(500).json({
        msg: "Error en el servidor al obtener los años disponibles.",
      });
    }
  },

  // Nuevo método para enviar reporte de evaluación
  enviarReporteEvaluacionPorEmail: async (req, res) => {
    try {
      const { correo_destino, codigo_evaluacion, area, puesto_trabajo } = req.body;

      // Validar que todos los campos requeridos estén presentes
      if (!correo_destino || !codigo_evaluacion || !area || !puesto_trabajo) {
        return res.status(400).json({
          msg: "Faltan campos requeridos: correo_destino, codigo_evaluacion, area, puesto_trabajo",
        });
      }

      // Obtener las respuestas por código de evaluación
      const respuestas = await Respuestas.findAll({
        where: {
          codigo_evaluacion: codigo_evaluacion,
          estado: 'A', // Solo registros activos
          codigo_tipo_propiedad: 3 // Solo preguntas de tipo respuesta abierta
        },
        include: [
          { model: Pregunta, as: 'pregunta' },
          { model: Evaluacion, as: 'evaluacion' }
        ]
      });

      if (!respuestas || respuestas.length === 0) {
        return res.status(404).json({
          msg: "No se encontraron respuestas para la evaluación especificada.",
        });
      }

      // Calcular la calificación
      let totalCalificacion = 0;
      respuestas.forEach((respuesta) => {
        const resp = respuesta.respuesta?.toLowerCase();
        if (resp === 'cumple' || resp === 'no_aplica') {
          totalCalificacion += 100;
        } else if (resp === 'no_cumple') {
          totalCalificacion += 0;
        }
      });

      const calificacionPromedio = Math.round(totalCalificacion / respuestas.length);

      // Validar el correo antes de enviar
      if (!correo_destino.includes('@')) {
        return res.status(400).json({
          msg: "El correo destino no es válido.",
        });
      }

      // Enviar el reporte por correo
      await enviarReporteEvaluacion(correo_destino, area, puesto_trabajo, respuestas, calificacionPromedio);

      res.status(200).json({
        msg: "Reporte de evaluación enviado exitosamente.",
        calificacion_promedio: calificacionPromedio + "%",
        respuestas_procesadas: respuestas.length
      });
    } catch (error) {
      console.error("Error al enviar reporte de evaluación:", error);
      res.status(500).json({
        msg: "Error en el servidor al enviar el reporte de evaluación.",
        error: error.message
      });
    }
  },

};
