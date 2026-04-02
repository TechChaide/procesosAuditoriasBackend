const { Plan_accion_estado, Estado, Plan_accion } = require("../models");
const { handleError } = require("../helpers/error.helper");

module.exports = {
  createOrUpdate: async (req, res) => {
    try {
      const {
        codigo_plan_accion_estado,
        detalle,
        estado,
        fecha_modificacion,
        usuario_modificacion,
        codigo_estado,
        codigo_plan_accion,
      } = req.body;

      if (codigo_plan_accion_estado == 0 || codigo_plan_accion_estado === undefined) {
        // Validate required fields
        if (!codigo_estado || !codigo_plan_accion) {
          return res.status(400).json({
            error: 'Missing required fields',
            details: {
              codigo_estado: codigo_estado ? 'present' : 'missing',
              codigo_plan_accion: codigo_plan_accion ? 'present' : 'missing'
            }
          });
        }

        const newRecord = await Plan_accion_estado.create({
          detalle: detalle,
          estado: estado,
          fecha_modificacion: fecha_modificacion,
          usuario_modificacion: usuario_modificacion,
          codigo_estado: codigo_estado,
          codigo_plan_accion: codigo_plan_accion,
        });

        const response = await Plan_accion_estado.findByPk(newRecord.codigo_plan_accion_estado, {
          include: [
            { model: Estado, as: 'estado_obj' },
            { model: Plan_accion, as: 'plan_accion' }
          ]
        });

        return res.status(201).json({ data: response, length: 1 });
      } else {
        const record = await Plan_accion_estado.findByPk(codigo_plan_accion_estado);
        if (!record) return res.status(404).json({ error: 'Record not found' });

        if (detalle !== undefined) record.detalle = detalle;
        if (estado !== undefined) record.estado = estado;
        if (fecha_modificacion !== undefined) record.fecha_modificacion = fecha_modificacion;
        if (usuario_modificacion !== undefined) record.usuario_modificacion = usuario_modificacion;
        if (codigo_estado !== undefined) record.codigo_estado = codigo_estado;
        if (codigo_plan_accion !== undefined) record.codigo_plan_accion = codigo_plan_accion;

        await record.save();

        const updated = await Plan_accion_estado.findByPk(codigo_plan_accion_estado, {
          include: [
            { model: Estado, as: 'estado_obj' },
            { model: Plan_accion, as: 'plan_accion' }
          ]
        });

        return res.status(200).json({ data: updated, length: 1 });
      }
    } catch (error) {
      handleError(res, error, 'Error creating or updating plan_accion_estado');
    }
  },

  getAll: async (req, res) => {
    try {
      const rows = await Plan_accion_estado.findAll({
        include: [
          { model: Estado, as: 'estado_obj' },
          { model: Plan_accion, as: 'plan_accion' }
        ]
      });

      return res.status(200).json({ data: rows, length: rows.length });
    } catch (error) {
      handleError(res, error, 'Error fetching plan_accion_estado records');
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const record = await Plan_accion_estado.findByPk(id, {
        include: [
          { model: Estado, as: 'estado_obj' },
          { model: Plan_accion, as: 'plan_accion' }
        ]
      });

      if (!record) return res.status(404).json({ error: 'Record not found', id });

      return res.status(200).json({ data: record, length: 1 });
    } catch (error) {
      handleError(res, error, 'Error fetching plan_accion_estado by ID');
    }
  },

  // Soft deactivate
  deactivate: async (req, res) => {
    try {
      const { id } = req.params;
      const record = await Plan_accion_estado.findByPk(id);
      if (!record) return res.status(404).json({ error: 'Record not found' });

      record.estado = 'I';
      await record.save();

      return res.status(200).json({ message: 'Record deactivated', id });
    } catch (error) {
      handleError(res, error, 'Error deactivating plan_accion_estado');
    }
  },

  getPlanAccionEsadoByCodigoPlanAccion: async (req, res) => {
    try {
      const { codigo_plan_accion } = req.body;
      const records = await Plan_accion_estado.findAll({
        where: { codigo_plan_accion : codigo_plan_accion, estado: 'A' },
        include: [
          { model: Estado, as: 'estado_obj' },
          { model: Plan_accion, as: 'plan_accion' }
        ],
        order: [['fecha_modificacion', 'DESC']]
      });

      if (!records || records.length === 0) {
        return res.status(404).json({ error: 'Records not found', codigo_plan_accion });
      }

      return res.status(200).json({ data: records, length: records.length });
    } catch (error) {
      handleError(res, error, 'Error fetching plan_accion_estado by codigo_plan_accion');
    }
  }
};     
