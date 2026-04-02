const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Plan_accion = sequelize.define('Plan_accion', {
        
        codigo_plan_accion: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        
        codigo_evaluacion: {
            type: DataTypes.INTEGER
        },
        
        codigo_tipo_accion: {
            type: DataTypes.INTEGER
        },
        
        descripcion_plan_accion: {
            type: DataTypes.TEXT
        },
        
        fecha_inicio: {
            type: DataTypes.STRING
        },
        
        fecha_objetivo: {
            type: DataTypes.STRING
        },
        
        fecha_extension: {
            type: DataTypes.STRING
        },
        
        responsable_plan_accion: {
            type: DataTypes.STRING,
            allowNull: false
        },
        
        url_evidencia: {
            type: DataTypes.STRING,
            allowNull: false
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
        tableName: 'plan_accion',
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
    Plan_accion.associate = (models) => {
    Plan_accion.belongsTo(models.Evaluacion, {
        foreignKey: 'codigo_evaluacion',
        as: 'evaluacion',
        targetKey: 'codigo_evaluacion'
    });
    Plan_accion.belongsTo(models.Tipo_accion, {
        foreignKey: 'codigo_tipo_accion',
        as: 'tipo_accion',
        targetKey: 'codigo_tipo_accion'
    });
    };

    return Plan_accion;
};