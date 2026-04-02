const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Respuestas = sequelize.define('Respuestas', {
        
        codigo_respuesta: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        codigo_pregunta: {
            type: DataTypes.INTEGER
        },

        codigo_tipo_propiedad: {
            type: DataTypes.INTEGER
        },
        
        codigo_evaluacion: {
            type: DataTypes.INTEGER
        },
        
        codigo_puesto_trabajo_pregunta: {
            type: DataTypes.INTEGER
        },
        
        respuesta: {
            type: DataTypes.STRING
        },
        
        fecha_evaluacion: {
            type: DataTypes.STRING
        },
        
        tiempo_evaluacion: {
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
        tableName: 'respuestas',
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

    // Setup relationships (only belongsTo)
    Respuestas.associate = (models) => {
        Respuestas.belongsTo(models.Pregunta, {
            foreignKey: 'codigo_pregunta',
            as: 'pregunta',
            targetKey: 'codigo_pregunta'
        });

        Respuestas.belongsTo(models.Tipo_propiedad, {
            foreignKey: 'codigo_tipo_propiedad',
            as: 'tipo_propiedad',
            targetKey: 'codigo_tipo_propiedad'
        });

        Respuestas.belongsTo(models.Puesto_trabajo_pregunta, {
            foreignKey: 'codigo_puesto_trabajo_pregunta',
            as: 'puesto_trabajo_pregunta',
            targetKey: 'codigo_puesto_trabajo_pregunta'
        });

        Respuestas.belongsTo(models.Evaluacion, {
            foreignKey: 'codigo_evaluacion',
            as: 'evaluacion',
            targetKey: 'codigo_evaluacion'
        });
    };

    return Respuestas;
};