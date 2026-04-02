const { Modelo_pregunta, Pregunta, Modelo } = require('../models');
const { handleError } = require('../helpers/error.helper');
const { or } = require('sequelize');

module.exports = {
    // Create or update record
    createOrUpdate: async (req, res) => {
        try {
            const {
                codigo_modelo_pregunta,
                estado,
                orden,
                fecha_modificacion,
                usuario_modificacion,
                codigo_modelo,
                codigo_pregunta
            } = req.body;

            // Validate required fields

            if (codigo_modelo_pregunta == 0 || codigo_modelo_pregunta === undefined) {
                // Create new record
                const newRecord = await Modelo_pregunta.create({
                    orden: orden,
                    estado: estado,
                    fecha_modificacion: fecha_modificacion,
                    usuario_modificacion: usuario_modificacion,
                    codigo_modelo: codigo_modelo,
                    codigo_pregunta: codigo_pregunta
                });

                const response = await Modelo_pregunta.findByPk(newRecord.codigo_modelo_pregunta, {
                    include: [
                        { model: Modelo, as: 'modelo' },
                        { model: Pregunta, as: 'pregunta' }
                    ]
                });

                return res.status(201).json({
                    data: response,
                    length: 1
                });
            } else {
                // Update existing record
                const record = await Modelo_pregunta.findByPk(codigo_modelo_pregunta, {
                    include: [
                        { model: Modelo, as: 'modelo' },
                        { model: Pregunta, as: 'pregunta' }
                    ]
                });
                
                if (!record) {
                    return res.status(404).json({ error: 'Record not found' });
                }

                // Update fields
                if (orden !== undefined) record.orden = orden;
                if (estado !== undefined) record.estado = estado;
                if (fecha_modificacion !== undefined) record.fecha_modificacion = fecha_modificacion;
                if (usuario_modificacion !== undefined) record.usuario_modificacion = usuario_modificacion;
                if (codigo_modelo !== undefined) record.codigo_modelo = codigo_modelo;
                if (codigo_pregunta !== undefined) record.codigo_pregunta = codigo_pregunta;
                
                await record.save();

                const updatedRecord = await Modelo_pregunta.findByPk(codigo_modelo_pregunta, {
                    include: [
                        { model: Modelo, as: 'modelo' },
                        { model: Pregunta, as: 'pregunta' }
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
            const rows = await Modelo_pregunta.findAll({
                include: [
                    { model: Modelo, as: 'modelo' },
                    { model: Pregunta, as: 'pregunta' }
                ]
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
            
            const record = await Modelo_pregunta.findByPk(id, {
                include: [
                    { model: Modelo, as: 'modelo' },
                    { model: Pregunta, as: 'pregunta' }
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
            
            const record = await Modelo_pregunta.findByPk(id);
            
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
    }
};