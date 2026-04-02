const { Respuestas, Evaluacion, Puesto_trabajo_pregunta, Pregunta, Tipo_propiedad, Tipo_pregunta } = require('../models');
const { handleError } = require('../helpers/error.helper');

module.exports = {
    // Create or update record
    createOrUpdate: async (req, res) => {
        try {
            const {
                codigo_respuesta,
                codigo_pregunta,
                codigo_tipo_propiedad,
                codigo_evaluacion,
                codigo_puesto_trabajo_pregunta,
                respuesta,
                fecha_evaluacion,
                tiempo_evaluacion,
                estado,
                fecha_creacion,
                usuario_creacion,
                fecha_modificacion,
                usuario_modificacion
            } = req.body;

            // Validate required fields

            if (codigo_respuesta == 0 || codigo_respuesta === undefined) {
                // Create new record
                const newRecord = await Respuestas.create({
                    codigo_pregunta: codigo_pregunta,
                    codigo_tipo_propiedad: codigo_tipo_propiedad,
                    codigo_evaluacion: codigo_evaluacion,
                    codigo_puesto_trabajo_pregunta: codigo_puesto_trabajo_pregunta,
                    respuesta: respuesta,
                    fecha_evaluacion: fecha_evaluacion,
                    tiempo_evaluacion: tiempo_evaluacion,
                    estado: estado,
                    fecha_creacion: fecha_creacion,
                    usuario_creacion: usuario_creacion,
                    fecha_modificacion: fecha_modificacion,
                    usuario_modificacion: usuario_modificacion
                });

                const response = await Respuestas.findByPk(newRecord.codigo_respuesta, {
                    include: [
                        { model: Pregunta, as: 'pregunta' },
                        { model: Tipo_propiedad, as: 'tipo_propiedad' },
                        { model: Puesto_trabajo_pregunta, as: 'puesto_trabajo_pregunta' },
                        { model: Evaluacion, as: 'evaluacion' }
                    ]
                });

                return res.status(201).json({
                    data: response,
                    length: 1
                });
            } else {
                // Update existing record
                const record = await Respuestas.findByPk(codigo_respuesta, {
                    include: [
                        { model: Pregunta, as: 'pregunta' },
                        { model: Tipo_propiedad, as: 'tipo_propiedad' },
                        { model: Puesto_trabajo_pregunta, as: 'puesto_trabajo_pregunta' },
                        { model: Evaluacion, as: 'evaluacion' }
                    ]
                });
                
                if (!record) {
                    return res.status(404).json({ error: 'Record not found' });
                }

                // Update fields
                if (codigo_evaluacion !== undefined) record.codigo_evaluacion = codigo_evaluacion;
                if (codigo_pregunta !== undefined) record.codigo_pregunta = codigo_pregunta;
                if (codigo_tipo_propiedad !== undefined) record.codigo_tipo_propiedad = codigo_tipo_propiedad;
                if (codigo_puesto_trabajo_pregunta !== undefined) record.codigo_puesto_trabajo_pregunta = codigo_puesto_trabajo_pregunta;
                if (respuesta !== undefined) record.respuesta = respuesta;
                if (fecha_evaluacion !== undefined) record.fecha_evaluacion = fecha_evaluacion;
                if (tiempo_evaluacion !== undefined) record.tiempo_evaluacion = tiempo_evaluacion;
                if (estado !== undefined) record.estado = estado;
                if (fecha_creacion !== undefined) record.fecha_creacion = fecha_creacion;
                if (usuario_creacion !== undefined) record.usuario_creacion = usuario_creacion;
                if (fecha_modificacion !== undefined) record.fecha_modificacion = fecha_modificacion;
                if (usuario_modificacion !== undefined) record.usuario_modificacion = usuario_modificacion;
                
                await record.save();

                const updatedRecord = await Respuestas.findByPk(codigo_respuesta, {
                    include: [
                        { model: Tipo_propiedad, as: 'tipo_propiedad' },
                        { model: Puesto_trabajo_pregunta, as: 'puesto_trabajo_pregunta' },
                        { model: Evaluacion, as: 'evaluacion' }
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
            const rows = await Respuestas.findAll({
                include: [
                    { model: Pregunta, as: 'pregunta' },
                    { model: Tipo_pregunta, as: 'tipo_pregunta' },
                    { model: Puesto_trabajo_pregunta, as: 'puesto_trabajo_pregunta' },
                    { model: Evaluacion, as: 'evaluacion' }
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
            
            const record = await Respuestas.findByPk(id, {
                include: [
                    { model: Pregunta, as: 'pregunta' },
                    { model: Tipo_pregunta, as: 'tipo_pregunta' },
                    { model: Puesto_trabajo_pregunta, as: 'puesto_trabajo_pregunta' },
                    { model: Evaluacion, as: 'evaluacion' }
                ],
                where: { estado: 'A' } // Only active records
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
            
            const record = await Respuestas.findByPk(id);
            
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

    getRespuestasPorCodigoPuestoTrabajopregunta : async (req, res) => {
        try {
            const { codigo_puesto_trabajo_pregunta } = req.body;
            const respuestas = await Respuestas.findAll({
                where: {
                    codigo_puesto_trabajo_pregunta: codigo_puesto_trabajo_pregunta,
                    estado: 'A' // Only active records
                },
                include: [
                    { model: Pregunta, as: 'pregunta' },
                    { model: Tipo_propiedad, as: 'tipo_propiedad' },
                    { model: Evaluacion, as: 'evaluacion' }
                ]
            });

            return res.status(200).json({
                data: respuestas,
                length: respuestas.length
            });
        } catch (error) {
            handleError(res, error, 'Error fetching respuestas by codigo_puesto_trabajo_pregunta');
        }
    },

    getRespuestasPorCodigoEvaluacion: async (req, res) => {
        try {
            const { codigo_evaluacion } = req.body;
            const respuestas = await Respuestas.findAll({
                where: {
                    codigo_evaluacion: codigo_evaluacion,
                    estado: 'A', // Only active records
                    codigo_tipo_propiedad : 3 // Solo preguntas de tipo respuesta abierta
                },
                include: [
                    { model: Pregunta, as: 'pregunta' },
                    { model: Tipo_propiedad, as: 'tipo_propiedad' },
                    { model: Evaluacion, as: 'evaluacion' }
                ]
            });

            return res.status(200).json({
                data: respuestas,
                length: respuestas.length
            });
        } catch (error) {
            handleError(res, error, 'Error fetching respuestas by codigo_evaluacion');
        }
    }
};