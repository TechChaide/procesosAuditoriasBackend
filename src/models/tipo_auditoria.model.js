const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Tipo_auditoria = sequelize.define('Tipo_auditoria', {
        
        codigo_tipo_auditoria: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        
        nombre_tipo_auditoria: {
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
        tableName: 'tipo_auditoria',
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
    Tipo_auditoria.associate = (models) => {
        
    };

    return Tipo_auditoria;
};