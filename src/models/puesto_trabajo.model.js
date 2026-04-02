const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Puesto_trabajo = sequelize.define('Puesto_trabajo', {
        
        codigo_puesto_trabajo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        
        nombre_puesto_trabajo: {
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
        
        codigo_area_tipo_auditoria: {
            type: DataTypes.INTEGER
        },
        
        fecha_modificacion: {
            type: DataTypes.STRING
        },
        
        usuario_modificacion: {
            type: DataTypes.STRING
        }
        
    }, {
        tableName: 'puesto_trabajo',
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
    Puesto_trabajo.associate = (models) => {
        Puesto_trabajo.belongsTo(models.Area_tipo_auditoria, {
        foreignKey: 'codigo_area_tipo_auditoria',
        as: 'area_tipo_auditoria',
        targetKey: 'codigo_area_tipo_auditoria'
    });
    };

    return Puesto_trabajo;
};