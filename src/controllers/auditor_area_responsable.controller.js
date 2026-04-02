const { Auditor_area_responsable, Area_tipo_auditoria, Evaluador } = require('../models');
const { handleError } = require('../helpers/error.helper');

const db = require("../models");
const { QueryTypes } = require("sequelize");

module.exports = {
    // Create or update record
    createOrUpdate: async (req, res) => {
        try {
            const {
                codigo_area_auditor_responsable,
                codigo_area_tipo_auditoria,
                codigo_evaluador,
                peso_area,
                estado,
                fecha_modificacion,
                usuario_modificacion
            } = req.body;

            // Validate required fields

            if (codigo_area_auditor_responsable == 0 || codigo_area_auditor_responsable === undefined) {
                // Create new record
                const newRecord = await Auditor_area_responsable.create({
                    codigo_area_tipo_auditoria: codigo_area_tipo_auditoria,
                    codigo_evaluador: codigo_evaluador,
                    peso_area: peso_area,
                    estado: estado,
                    fecha_modificacion: fecha_modificacion,
                    usuario_modificacion: usuario_modificacion
                });

                const response = await Auditor_area_responsable.findByPk(newRecord.codigo_area_auditor_responsable, {
                    include: [
                        { model: Area_tipo_auditoria, as: 'area_tipo_auditoria' },
                        { model: Evaluador, as: 'evaluador' }
                    ]
                });

                return res.status(201).json({
                    data: response,
                    length: 1
                });
            } else {
                // Update existing record
                const record = await Auditor_area_responsable.findByPk(codigo_area_auditor_responsable, {
                    include: [
                        { model: Area_tipo_auditoria, as: 'area_tipo_auditoria' },
                        { model: Evaluador, as: 'evaluador' }
                    ]
                });
                
                if (!record) {
                    return res.status(404).json({ error: 'Record not found' });
                }

                // Update fields
                if (codigo_area_tipo_auditoria !== undefined) record.codigo_area_tipo_auditoria = codigo_area_tipo_auditoria;
                if (codigo_evaluador !== undefined) record.codigo_evaluador = codigo_evaluador;
                if (peso_area !== undefined) record.peso_area = peso_area;
                if (estado !== undefined) record.estado = estado;
                if (fecha_modificacion !== undefined) record.fecha_modificacion = fecha_modificacion;
                if (usuario_modificacion !== undefined) record.usuario_modificacion = usuario_modificacion;
                
                await record.save();

                const updatedRecord = await Auditor_area_responsable.findByPk(codigo_area_auditor_responsable, {
                    include: [
                        { model: Area_tipo_auditoria, as: 'area_tipo_auditoria' },
                        { model: Evaluador, as: 'evaluador' }
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
            const rows = await Auditor_area_responsable.findAll({
                include: [
                    { model: Area_tipo_auditoria, as: 'area_tipo_auditoria' },
                    { model: Evaluador, as: 'evaluador' }
                ],
                where: {estado: 'A'}
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
            
            const record = await Auditor_area_responsable.findByPk(id, {
                include: [
                    { model: Area_tipo_auditoria, as: 'area_tipo_auditoria' },
                    { model: Evaluador, as: 'evaluador' }
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
            
            const record = await Auditor_area_responsable.findByPk(id);
            
            if (!record) {
                return res.status(404).json({ error: 'Record not found' });
            }

            // Soft delete by setting status
            record.estado = 'INACTIVE';
            await record.save();

            return res.status(200).json({
                message: 'Record deactivated successfully',
                id: id
            });
        } catch (error) {
            handleError(res, error, 'Error deactivating record');
        }
    },

    getReporteModeloTipoAuditoria: async (req, res) => {
        const {CodigoEvaluador} = req.body;
        try {
          const resultado = await db.sequelize.query(
            `EXEC [${process.env.DB_NAME}].[dbo].[sp_Get_AreasPorEvaluadorResposable] :CodigoEvaluador`,
            {
              type: QueryTypes.SELECT,
                replacements: { CodigoEvaluador : CodigoEvaluador },
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