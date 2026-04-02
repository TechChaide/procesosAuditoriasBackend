const { Puesto_trabajo, Area_tipo_auditoria } = require('../models');
const { handleError } = require('../helpers/error.helper');
const db = require("../models");
const { QueryTypes } = require("sequelize");

module.exports = {
    // Create or update record
    createOrUpdate: async (req, res) => {
        try {
            const {
                codigo_puesto_trabajo,
                nombre_puesto_trabajo,
                estado,
                fecha_creacion,
                usuario_creacion,
                codigo_area_tipo_auditoria,
                fecha_modificacion,
                usuario_modificacion
            } = req.body;

            // Validate required fields

            if (codigo_puesto_trabajo == 0 || codigo_puesto_trabajo === undefined) {
                // Create new record
                const newRecord = await Puesto_trabajo.create({
                    nombre_puesto_trabajo: nombre_puesto_trabajo,
                    estado: estado,
                    fecha_creacion: fecha_creacion,
                    usuario_creacion: usuario_creacion,
                    codigo_area_tipo_auditoria: codigo_area_tipo_auditoria,
                    fecha_modificacion: fecha_modificacion,
                    usuario_modificacion: usuario_modificacion
                });

                const response = await Puesto_trabajo.findByPk(newRecord.codigo_puesto_trabajo, {
                    include: [
                        { model: Area_tipo_auditoria, as: 'area_tipo_auditoria' }
                    ]
                });

                return res.status(201).json({
                    data: response,
                    length: 1
                });
            } else {
                // Update existing record
                const record = await Puesto_trabajo.findByPk(codigo_puesto_trabajo, {
                    include: [
                        { model: Area_tipo_auditoria, as: 'area_tipo_auditoria' }
                    ]
                });

                if (!record) {
                    return res.status(404).json({ error: 'Record not found' });
                }

                // Update fields
                if (nombre_puesto_trabajo !== undefined) record.nombre_puesto_trabajo = nombre_puesto_trabajo;
                if (estado !== undefined) record.estado = estado;
                if (fecha_creacion !== undefined) record.fecha_creacion = fecha_creacion;
                if (usuario_creacion !== undefined) record.usuario_creacion = usuario_creacion;
                if (codigo_area_tipo_auditoria !== undefined) record.codigo_area_tipo_auditoria = codigo_area_tipo_auditoria;
                if (fecha_modificacion !== undefined) record.fecha_modificacion = fecha_modificacion;
                if (usuario_modificacion !== undefined) record.usuario_modificacion = usuario_modificacion;

                await record.save();

                const updatedRecord = await Puesto_trabajo.findByPk(codigo_puesto_trabajo, {
                    include: [
                        { model: Area_tipo_auditoria, as: 'area_tipo_auditoria' }
                    ]
                });

                return res.status(200).json({
                    data: updatedRecord,
                    length: 1
                });
            }
        } catch (error) {
            handleError(res, error, 'Error creating or updating record');
        }
    },

    // Get all records
    getAll: async (req, res) => {
        try {
            const rows = await Puesto_trabajo.findAll({
                include: [
                    { model: Area_tipo_auditoria, as: 'area_tipo_auditoria' }
                ],
                where: { estado: 'A' } // Only active records
            });

            return res.status(200).json({
                data: rows,
                length: rows.length
            });
        } catch (error) {
            handleError(res, error, 'Error fetching records');
        }
    },

    // Get record by ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;

            const record = await Puesto_trabajo.findByPk(id, {
                include: [
                    { model: Area_tipo_auditoria, as: 'area_tipo_auditoria' }
                ]
            });

            if (!record) {
                return res.status(404).json({
                    error: 'Record not found',
                    id: id
                });
            }

            return res.status(200).json({
                data: record,
                length: 1
            });
        } catch (error) {
            handleError(res, error, 'Error fetching record by ID');
        }
    },

    // Deactivate record (soft delete)
    deactivate: async (req, res) => {
        try {
            const { id } = req.params;

            const record = await Puesto_trabajo.findByPk(id);

            if (!record) {
                return res.status(404).json({ error: 'Record not found' });
            }

            // Soft delete by setting status
            record.estado = 'I';
            await record.save();

            return res.status(200).json({
                message: 'Record deactivated successfully',
                id: id
            });
        } catch (error) {
            handleError(res, error, 'Error deactivating record');
        }
    },

    getReporteEvaluacionesPorPuestoTrabajo: async (req, res) => {
        const { codigo_puesto_trabajo} = req.body;
        try {
            const resultado = await db.sequelize.query(
                `EXEC [${process.env.DB_NAME}].[dbo].[sp_Get_evaluacionesPorPuestoTrabajo] :CodigoPuestoTrabajo `,
                {
                    type: QueryTypes.SELECT,
                    replacements: { CodigoPuestoTrabajo: codigo_puesto_trabajo },
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


};