const { Plan_accion, Evaluacion, Tipo_accion } = require("../models");
const { handleError } = require("../helpers/error.helper");

module.exports = {
  // Create or update record
  createOrUpdate: async (req, res) => {
    try {
      const {
        codigo_plan_accion,
        codigo_evaluacion,
        codigo_tipo_accion,
        descripcion_plan_accion,
        fecha_inicio,
        fecha_objetivo,
        fecha_extension,
        responsable_plan_accion,
        url_evidencia,
        estado,
        fecha_creacion,
        usuario_creacion,
        fecha_modificacion,
        usuario_modificacion,
      } = req.body;

      // Validate required fields
      if (
        responsable_plan_accion === undefined ||
        responsable_plan_accion === null ||
        url_evidencia === undefined ||
        url_evidencia === null
      ) {
        return res.status(400).json({
          error: "Missing required fields",
          details: {
            responsable_plan_accion:
              responsable_plan_accion === undefined
                ? "undefined"
                : responsable_plan_accion === null
                  ? "null"
                  : "present",
            url_evidencia:
              url_evidencia === undefined
                ? "undefined"
                : url_evidencia === null
                  ? "null"
                  : "present",
          },
        });
      }

      if (codigo_plan_accion == 0 || codigo_plan_accion === undefined) {
        // Create new record
        const newRecord = await Plan_accion.create({
          codigo_evaluacion: codigo_evaluacion,
          codigo_tipo_accion: codigo_tipo_accion,
          descripcion_plan_accion: descripcion_plan_accion,
          fecha_inicio: fecha_inicio,
          fecha_objetivo: fecha_objetivo,
          fecha_extension: fecha_extension,
          responsable_plan_accion: responsable_plan_accion,
          url_evidencia: url_evidencia,
          estado: estado,
          fecha_creacion: fecha_creacion,
          usuario_creacion: usuario_creacion,
          fecha_modificacion: fecha_modificacion,
          usuario_modificacion: usuario_modificacion,
        });

        const response = await Plan_accion.findByPk(
          newRecord.codigo_plan_accion,
          {
            include: [
              { model: Evaluacion, as: "evaluacion" },
              { model: Tipo_accion, as: "tipo_accion" },
            ],
          },
        );

        return res.status(201).json({
          data: response,
          length: 1,
        });
      } else {
        // Update existing record
        const record = await Plan_accion.findByPk(codigo_plan_accion, {
          include: [
            { model: Evaluacion, as: "evaluacion" },
            { model: Tipo_accion, as: "tipo_accion" },
          ],
        });

        if (!record) {
          return res.status(404).json({ error: "Record not found" });
        }

        // Update fields
        if (codigo_evaluacion !== undefined)
          record.codigo_evaluacion = codigo_evaluacion;
        if (codigo_tipo_accion !== undefined)
          record.codigo_tipo_accion = codigo_tipo_accion;
        if (descripcion_plan_accion !== undefined)
          record.descripcion_plan_accion = descripcion_plan_accion;
        if (fecha_inicio !== undefined) record.fecha_inicio = fecha_inicio;
        if (fecha_objetivo !== undefined)
          record.fecha_objetivo = fecha_objetivo;
        if (fecha_extension !== undefined)
          record.fecha_extension = fecha_extension;
        if (responsable_plan_accion !== undefined)
          record.responsable_plan_accion = responsable_plan_accion;
        if (url_evidencia !== undefined) record.url_evidencia = url_evidencia;
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

        const updatedRecord = await Plan_accion.findByPk(codigo_plan_accion, {
          include: [
            { model: Evaluacion, as: "evaluacion" },
            { model: Tipo_accion, as: "tipo_accion" },
          ],
        });

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
      const rows = await Plan_accion.findAll({
        include: [
          { model: Evaluacion, as: "evaluacion" },
          { model: Tipo_accion, as: "tipo_accion" },
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

      const record = await Plan_accion.findByPk(id, {
        include: [
          { model: Evaluacion, as: "evaluacion" },
          { model: Tipo_accion, as: "tipo_accion" },
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

      const record = await Plan_accion.findByPk(id);

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

  getPlanesAccionPorCodigoEvaluacion: async (req, res) => {
    try {
      
      const { codigo_evaluacion } = req.body;

      const records = await Plan_accion.findAll({
        where: { codigo_evaluacion: codigo_evaluacion, estado: "A" },
        include: [
          { model: Evaluacion, as: "evaluacion" },
          { model: Tipo_accion, as: "tipo_accion" },
        ],
      });

      return res.status(200).json({
        data: records,
        length: records.length,
      });
    } catch (error) {
      handleError(res, error, "Error fetching records by evaluation code");
    }
  },


};
