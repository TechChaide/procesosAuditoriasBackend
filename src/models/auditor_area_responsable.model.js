const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Auditor_area_responsable = sequelize.define('Auditor_area_responsable', {
        
        codigo_area_auditor_responsable: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        
        codigo_area_tipo_auditoria: {
            type: DataTypes.INTEGER
        },
        
        codigo_evaluador: {
            type: DataTypes.INTEGER
        },
        
        peso_area: {
            type: DataTypes.FLOAT
        },
        
        estado: {
            type: DataTypes.STRING
        },
        
        fecha_modificacion: {
            type: DataTypes.STRING
        },
        
        usuario_modificacion: {
            type: DataTypes.STRING
        }
        
    }, {
        tableName: 'auditor_area_responsable',
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
    Auditor_area_responsable.associate = (models) => {
        Auditor_area_responsable.belongsTo(models.Area_tipo_auditoria, {
            foreignKey: 'codigo_area_tipo_auditoria',
            as: 'area_tipo_auditoria'
        });
        Auditor_area_responsable.belongsTo(models.Evaluador, {
            foreignKey: 'codigo_evaluador',
            as: 'evaluador'
        });
    };

    return Auditor_area_responsable;
};