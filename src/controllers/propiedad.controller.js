const { Propiedad, Pregunta, Tipo_propiedad } = require('../models');
const { handleError } = require('../helpers/error.helper');

module.exports = {
    // Create or update record
    createOrUpdate: async (req, res) => {
        try {
            const {
                codigo_propiedad,
                codigo_pregunta,
                codigo_tipo_propiedad,
                estado,
                fecha_creacion,
                usuario_creacion,
                fecha_modificacion,
                usuario_modificacion
            } = req.body;

            // Validate required fields

            if (codigo_propiedad == 0 || codigo_propiedad === undefined) {
                // Create new record
                const newRecord = await Propiedad.create({
                    codigo_pregunta: codigo_pregunta,
                    codigo_tipo_propiedad: codigo_tipo_propiedad,
                    estado: estado,
                    fecha_creacion: fecha_creacion,
                    usuario_creacion: usuario_creacion,
                    fecha_modificacion: fecha_modificacion,
                    usuario_modificacion: usuario_modificacion
                });

                const response = await Propiedad.findByPk(newRecord.codigo_propiedad, {
                    include: [
                        { model: Pregunta, as: 'pregunta' },
                        { model: Tipo_propiedad, as: 'tipo_propiedad' }
                    ]
                });

                return res.status(201).json({
                    data: response,
                    length: 1
                });
            } else {
                // Update existing record
                const record = await Propiedad.findByPk(codigo_propiedad, {
                    include: [
                        { model: Pregunta, as: 'pregunta' },
                        { model: Tipo_propiedad, as: 'tipo_propiedad' }
                    ]
                });
                
                if (!record) {
                    return res.status(404).json({ error: 'Record not found' });
                }

                // Update fields
                if (codigo_pregunta !== undefined) record.codigo_pregunta = codigo_pregunta;
                if (codigo_tipo_propiedad !== undefined) record.codigo_tipo_propiedad = codigo_tipo_propiedad;
                if (estado !== undefined) record.estado = estado;
                if (fecha_creacion !== undefined) record.fecha_creacion = fecha_creacion;
                if (usuario_creacion !== undefined) record.usuario_creacion = usuario_creacion;
                if (fecha_modificacion !== undefined) record.fecha_modificacion = fecha_modificacion;
                if (usuario_modificacion !== undefined) record.usuario_modificacion = usuario_modificacion;
                
                await record.save();

                const updatedRecord = await Propiedad.findByPk(codigo_propiedad, {
                    include: [
                        { model: Pregunta, as: 'pregunta' },
                        { model: Tipo_propiedad, as: 'tipo_propiedad' }
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
            const rows = await Propiedad.findAll({
                include: [
                    { model: Pregunta, as: 'pregunta' },
                    { model: Tipo_propiedad, as: 'tipo_propiedad' }
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
            
            const record = await Propiedad.findByPk(id, {
                include: [
                    { model: Pregunta, as: 'pregunta' },
                    { model: Tipo_propiedad, as: 'tipo_propiedad' }
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
            
            const record = await Propiedad.findByPk(id);
            
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

    getPropiedadesPorCodigoPregunta: async (req, res) => {
        try {
            const { codigo_pregunta } = req.body;
            const { count, rows } = await Propiedad.findAndCountAll({
                where: { 
                    codigo_pregunta: codigo_pregunta, estado: 'A' 
                },
                include: [
                    { model: Pregunta, as: 'pregunta' },
                    { model: Tipo_propiedad, as: 'tipo_propiedad' }
                ]   
            });

            return res.status(200).json({
                data: rows,
                length: rows.length,
            });
        } catch (error) {
            handleError(res, error, 'Error fetching records by codigo_pregunta');
        }
    },
};