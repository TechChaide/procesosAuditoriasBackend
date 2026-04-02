const { Area_tipo_auditoria, Tipo_auditoria } = require("../models");
const { handleError } = require("../helpers/error.helper");

module.exports = {
  // Create or update record
  createOrUpdate: async (req, res) => {
    try {
      const {
        codigo_area_tipo_auditoria,
        nombre_area,
        area_visibilidad,
        correo_reporte,
        estado,
        fecha_modificacion,
        usuario_modificacion,
      } = req.body;

      // Validate required fields

      if (
        codigo_area_tipo_auditoria == 0 ||
        codigo_area_tipo_auditoria === undefined
      ) {
        // Create new record
        const newRecord = await Area_tipo_auditoria.create({
          nombre_area: nombre_area,
          area_visibilidad: area_visibilidad,
          correo_reporte: correo_reporte,
          estado: estado,
          fecha_modificacion: fecha_modificacion,
          usuario_modificacion: usuario_modificacion,
        });

        const response = await Area_tipo_auditoria.findByPk(
          newRecord.codigo_area_tipo_auditoria,
          {
          },
        );

        return res.status(201).json({
          data: response,
          length: 1,
        });
      } else {
        // Update existing record
        const record = await Area_tipo_auditoria.findByPk(
          codigo_area_tipo_auditoria
        );

        if (!record) {
          return res.status(404).json({ error: "Record not found" });
        }

        // Update fields
        if (nombre_area !== undefined) record.nombre_area = nombre_area;
        if (area_visibilidad !== undefined) record.area_visibilidad = area_visibilidad;
        if (correo_reporte !== undefined) record.correo_reporte = correo_reporte;
        if (estado !== undefined) record.estado = estado;
        if (fecha_modificacion !== undefined)
          record.fecha_modificacion = fecha_modificacion;
        if (usuario_modificacion !== undefined)
          record.usuario_modificacion = usuario_modificacion;

        await record.save();

        const updatedRecord = await Area_tipo_auditoria.findByPk(
          codigo_area_tipo_auditoria
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
      const rows = await Area_tipo_auditoria.findAll({
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

      const record = await Area_tipo_auditoria.findByPk(id);

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

      const record = await Area_tipo_auditoria.findByPk(id);

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
