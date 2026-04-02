const { Evaluacion } = require("../models");
const { handleError } = require("../helpers/error.helper");

module.exports = {
  // Create or update record
  createOrUpdate: async (req, res) => {
    try {
      const {
        codigo_evaluacion,
        serie_evaluacion,
        estado,
        fecha_creacion,
        usuario_creacion,
        fecha_modificacion,
        usuario_modificacion,
      } = req.body;

      // Validate required fields

      if (codigo_evaluacion == 0 || codigo_evaluacion === undefined) {
        // Create new record
        const newRecord = await Evaluacion.create({
          serie_evaluacion: serie_evaluacion,
          estado: estado,
          fecha_creacion: fecha_creacion,
          usuario_creacion: usuario_creacion,
          fecha_modificacion: fecha_modificacion,
          usuario_modificacion: usuario_modificacion,
        });

        const response = await Evaluacion.findByPk(newRecord.codigo_evaluacion);

        return res.status(201).json({
          data: response,
          length: 1,
        });
      } else {
        // Update existing record
        const record = await Evaluacion.findByPk(codigo_evaluacion);

        if (!record) {
          return res.status(404).json({ error: "Record not found" });
        }

        // Update fields
        if (serie_evaluacion !== undefined)
          record.serie_evaluacion = serie_evaluacion;
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

        const updatedRecord = await Evaluacion.findByPk(codigo_evaluacion);

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
      const rows = await Evaluacion.findAll({
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

      const record = await Evaluacion.findByPk(id);

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

      const record = await Evaluacion.findByPk(id);

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
};
