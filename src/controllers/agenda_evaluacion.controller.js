const {
  Agenda_evaluacion,
  Puesto_trabajo,
  Puesto_trabajo_pregunta,
  Evaluador,
  Estado,
} = require("../models");
const { handleError } = require("../helpers/error.helper");
const { where } = require("sequelize");

const db = require("../models");
const { QueryTypes } = require("sequelize");
const { escape } = require("sequelize/lib/sql-string");

module.exports = {
  // Create or update record
  createOrUpdate: async (req, res) => {
    try {
      const {
        codigo_agenda_evaluacion,
        codigo_puesto_trabajo_pregunta,
        codigo_puesto_trabajo,
        codigo_evaluador,
        codigo_estado,
        fecha_inicio,
        fecha_fin,
        fecha_extension,
        estado,
        fecha_creacion,
        usuario_creacion,
        fecha_modificacion,
        usuario_modificacion,
      } = req.body;

      // Validate required fields

      if (
        codigo_agenda_evaluacion == 0 ||
        codigo_agenda_evaluacion === undefined
      ) {
        // Create new record
        const newRecord = await Agenda_evaluacion.create({
          codigo_puesto_trabajo_pregunta: codigo_puesto_trabajo_pregunta,
          codigo_puesto_trabajo: codigo_puesto_trabajo,
          codigo_evaluador: codigo_evaluador,
          codigo_estado: codigo_estado,
          fecha_inicio: fecha_inicio,
          fecha_fin: fecha_fin,
          fecha_extension: fecha_extension,
          estado: estado,
          fecha_creacion: fecha_creacion,
          usuario_creacion: usuario_creacion,
          fecha_modificacion: fecha_modificacion,
          usuario_modificacion: usuario_modificacion,
        });

        const response = await Agenda_evaluacion.findByPk(
          newRecord.codigo_agenda_evaluacion,
          {
            include: [
              { model: Estado, as: "estado_obj" },
              { model: Evaluador, as: "evaluador" },
              { model: Puesto_trabajo, as: "puesto_trabajo" },
              { model: Puesto_trabajo_pregunta, as: "puesto_trabajo_pregunta" },
            ],
          },
        );

        return res.status(201).json({
          data: response,
          length: 1,
        });
      } else {
        // Update existing record
        const record = await Agenda_evaluacion.findByPk(
          codigo_agenda_evaluacion,
          {
            include: [
              { model: Estado, as: "estado_obj" },
              { model: Evaluador, as: "evaluador" },
              { model: Puesto_trabajo, as: "puesto_trabajo" },
              { model: Puesto_trabajo_pregunta, as: "puesto_trabajo_pregunta" },
            ],
          },
        );

        if (!record) {
          return res.status(404).json({ error: "Record not found" });
        }

        // Update fields
        if (codigo_puesto_trabajo_pregunta !== undefined)
          record.codigo_puesto_trabajo_pregunta =
            codigo_puesto_trabajo_pregunta;
        if (codigo_puesto_trabajo !== undefined)
          record.codigo_puesto_trabajo = codigo_puesto_trabajo;
        if (codigo_evaluador !== undefined)
          record.codigo_evaluador = codigo_evaluador;
        if (codigo_estado !== undefined) record.codigo_estado = codigo_estado;
        if (fecha_inicio !== undefined) record.fecha_inicio = fecha_inicio;
        if (fecha_fin !== undefined) record.fecha_fin = fecha_fin;
        if (fecha_extension !== undefined)
          record.fecha_extension = fecha_extension;
        if (estado !== undefined) record.estado = estado;
        if (fecha_creacion !== undefined)
          record.fecha_creacion = fecha_creacion;
        if (usuario_creacion !== undefined)
          record.usuario_creacion = usuario_creacion;
        if (fecha_modificacion !== undefined)
          record.fecha_modificacion = fecha_modificacion;
        if (usuario_modificacion !== undefined)
          record.usuario_modificacion = usuario_modificacion;

        await record.save();

        const updatedRecord = await Agenda_evaluacion.findByPk(
          codigo_agenda_evaluacion,
          {
            include: [
              { model: Estado, as: "estado_obj" },
              { model: Evaluador, as: "evaluador" },
              { model: Puesto_trabajo, as: "puesto_trabajo" },
              { model: Puesto_trabajo_pregunta, as: "puesto_trabajo_pregunta" },
            ],
          },
        );

        return res.status(200).json({
          data: updatedRecord,
          length: 1,
        });
      }
    } catch (error) {
      handleError(res, error, "Error creating or updating record");
    }
  },

  // Get all records
  getAll: async (req, res) => {
    try {
      const rows = await Agenda_evaluacion.findAll({
        include: [
          { model: Estado, as: "estado_obj" },
          { model: Evaluador, as: "evaluador" },
          { model: Puesto_trabajo, as: "puesto_trabajo" },
          { model: Puesto_trabajo_pregunta, as: "puesto_trabajo_pregunta" },
        ],
        where: { estado: "A" }, // Only active records
      });

      return res.status(200).json({
        data: rows,
        length: rows.length
      });
    } catch (error) {
      handleError(res, error, "Error fetching records");
    }
  },

  // Get record by ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const record = await Agenda_evaluacion.findByPk(id, {
        include: [
          { model: Estado, as: "estado_obj" },
          { model: Evaluador, as: "evaluador" },
          { model: Puesto_trabajo, as: "puesto_trabajo" },
          { model: Puesto_trabajo_pregunta, as: "puesto_trabajo_pregunta" },
        ],
      });

      if (!record) {
        return res.status(404).json({
          error: "Record not found",
          id: id,
        });
      }

      return res.status(200).json({
        data: record,
        length: 1,
      });
    } catch (error) {
      handleError(res, error, "Error fetching record by ID");
    }
  },

  // Deactivate record (soft delete)
  deactivate: async (req, res) => {
    try {
      const { id } = req.params;

      const record = await Agenda_evaluacion.findByPk(id);

      if (!record) {
        return res.status(404).json({ error: "Record not found" });
      }

      // Soft delete by setting status
      record.estado = "I";
      await record.save();

      return res.status(200).json({
        message: "Record deactivated successfully",
        id: id,
      });
    } catch (error) {
      handleError(res, error, "Error deactivating record");
    }
  },

  getCalendarioPorCodigoEmpleadoEvaluador: async (req, res) => {
    const { codigoEmpleado } = req.body;
    try {
      const resultado = await db.sequelize.query(
        `EXEC [${process.env.DB_NAME}].[dbo].[sp_Get_CalendarioEvaluacionesPorEvaluador] :CodigoEmpleado `,
        {
          type: QueryTypes.SELECT,
          replacements: { CodigoEmpleado: codigoEmpleado },
        },
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

  getEvaluacionesEvaluador : async (req, res) => {
    const { codigo_evaluador } = req.body;
    try {
      if (!codigo_evaluador) {
        return res.status(400).json({
          msg: "Faltan parámetros requeridos: codigo_evaluador es necesario.",
        });
      }

      const respuesta = await Agenda_evaluacion.findAndCountAll({
        where: { codigo_evaluador: codigo_evaluador, estado: "A" },
        include: [
          { model: Estado, as: "estado_obj" },
          { model: Evaluador, as: "evaluador" },
          { model: Puesto_trabajo, as: "puesto_trabajo" },
          { model: Puesto_trabajo_pregunta, as: "puesto_trabajo_pregunta" },
        ],
      });

      res.status(200).json({
        data: respuesta.rows,
        length: respuesta.count,
      });
    } catch (error) {
      console.error("Error al obtener las evaluaciones realizadas por el evaluador:", error);
      res.status(500).json({
        msg: "Error en el servidor al obtener las evaluaciones realizadas por el evaluador.",
      });
    }
  },
};
