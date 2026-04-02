const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Agenda_evaluacion = sequelize.define('Agenda_evaluacion', {
        
        codigo_agenda_evaluacion: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        codigo_puesto_trabajo_pregunta: {
            type: DataTypes.INTEGER
        },
        
        codigo_puesto_trabajo: {
            type: DataTypes.INTEGER
        },
        
        codigo_evaluador: {
            type: DataTypes.INTEGER
        },
        
        codigo_estado: {
            type: DataTypes.INTEGER
        },
        
        fecha_inicio: {
            type: DataTypes.STRING
        },
        
        fecha_fin: {
            type: DataTypes.STRING
        },
        
        fecha_extension: {
            type: DataTypes.STRING
        },
        
        estado: {
            type: DataTypes.STRING
        },
        
        fecha_creacion: {
            type: DataTypes.STRING
        },
        
        usuario_creacion: {
            type: DataTypes.STRING
        },
        
        fecha_modificacion: {
            type: DataTypes.STRING
        },
        
        usuario_modificacion: {
            type: DataTypes.STRING
        }
        
    }, {
        tableName: 'agenda_evaluacion',
        schema: 'dbo',
        timestamps: false,
        // SQL Server specific options
        dialectOptions: {
            options: {
                requestTimeout: 30000,
                encrypt: false,
                trustServerCertificate: true
            }
        }
    });

    // Setup relationships
    Agenda_evaluacion.associate = (models) => {
        Agenda_evaluacion.belongsTo(models.Puesto_trabajo_pregunta, {
            foreignKey: 'codigo_puesto_trabajo_pregunta',
            as: 'puesto_trabajo_pregunta',
            targetKey: 'codigo_puesto_trabajo_pregunta'
        });
        Agenda_evaluacion.belongsTo(models.Estado, {
            foreignKey: 'codigo_estado',
            as: 'estado_obj',
            targetKey: 'codigo_estado'
        });
        Agenda_evaluacion.belongsTo(models.Evaluador, {
            foreignKey: 'codigo_evaluador',
            as: 'evaluador',
            targetKey: 'codigo_evaluador'
        });
        Agenda_evaluacion.belongsTo(models.Puesto_trabajo, {
            foreignKey: 'codigo_puesto_trabajo',
            as: 'puesto_trabajo',
            targetKey: 'codigo_puesto_trabajo'
        });
    };

    return Agenda_evaluacion;
};