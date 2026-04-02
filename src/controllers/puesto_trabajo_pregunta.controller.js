const { Puesto_trabajo_pregunta, Modelo, Pregunta, Puesto_trabajo } = require('../models');
const { handleError } = require('../helpers/error.helper');
const db = require("../models");
const { QueryTypes } = require("sequelize");

module.exports = {
    // Create or update record
    createOrUpdate: async (req, res) => {
        try {
            const {
                codigo_puesto_trabajo_pregunta,
                codigo_modelo,
                codigo_puesto_trabajo,
                estado,
                fecha_modificacion,
                usuario_modificacion
            } = req.body;

            // Validate required fields

            if (codigo_puesto_trabajo_pregunta == 0 || codigo_puesto_trabajo_pregunta === undefined) {
                // Create new record
                const newRecord = await Puesto_trabajo_pregunta.create({
                    codigo_modelo: codigo_modelo,
                    codigo_puesto_trabajo: codigo_puesto_trabajo,
                    estado: estado,
                    fecha_modificacion: fecha_modificacion,
                    usuario_modificacion: usuario_modificacion
                });

                const response = await Puesto_trabajo_pregunta.findByPk(newRecord.codigo_puesto_trabajo_pregunta, {
                    include: [
                        { model: Modelo, as: 'modelo' },
                        { model: Puesto_trabajo, as: 'puesto_trabajo' }
                    ]
                });

                return res.status(201).json({
                    data: response,
                    length: 1
                });
            } else {
                // Update existing record
                const record = await Puesto_trabajo_pregunta.findByPk(codigo_puesto_trabajo_pregunta, {
                    include: [
                        { model: Modelo, as: 'modelo' },
                        { model: Puesto_trabajo, as: 'puesto_trabajo' }
                    ]
                });
                
                if (!record) {
                    return res.status(404).json({ error: 'Record not found' });
                }

                // Update fields
                if (codigo_modelo !== undefined) record.codigo_modelo = codigo_modelo;
                if (codigo_puesto_trabajo !== undefined) record.codigo_puesto_trabajo = codigo_puesto_trabajo;
                if (estado !== undefined) record.estado = estado;
                if (fecha_modificacion !== undefined) record.fecha_modificacion = fecha_modificacion;
                if (usuario_modificacion !== undefined) record.usuario_modificacion = usuario_modificacion;
                
                await record.save();

                const updatedRecord = await Puesto_trabajo_pregunta.findByPk(codigo_puesto_trabajo_pregunta, {
                    include: [
                        { model: Modelo, as: 'modelo' },
                        { model: Puesto_trabajo, as: 'puesto_trabajo' }
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
            const rows = await Puesto_trabajo_pregunta.findAll({
                include: [
                    { model: Modelo, as: 'modelo' },
                    { model: Puesto_trabajo, as: 'puesto_trabajo' }
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
            
            const record = await Puesto_trabajo_pregunta.findByPk(id, {
                include: [
                    { model: Modelo, as: 'modelo' },
                    { model: Puesto_trabajo, as: 'puesto_trabajo' }
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
            
            const record = await Puesto_trabajo_pregunta.findByPk(id);
            
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

    getReporteEvaluacionesPorPuestoTrabajoPregunta: async (req, res) => {
        const { codigo_puesto_trabajo_pregunta} = req.body;
        try {
            const resultado = await db.sequelize.query(
                `EXEC [${process.env.DB_NAME}].[dbo].[sp_Get_evaluacionesPorCodigoPuestoTrabajoPregunta] :Codigo `,
                {
                    type: QueryTypes.SELECT,
                    replacements: { Codigo: codigo_puesto_trabajo_pregunta },
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

    getEvaluacionesVisiblesPorDepartamento: async (req, res) => {
        const { departamento } = req.body;
        try {
            const resultado = await db.sequelize.query(
                `EXEC [${process.env.DB_NAME}].[dbo].[sp_EvaluacionesVisiblesPorDepartamento] :departamento `,
                {
                    type: QueryTypes.SELECT,
                    replacements: { departamento: departamento },
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