const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Estado = sequelize.define('Estado', {
        
        codigo_estado: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        
        nombre_estado: {
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
        tableName: 'estado',
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
    Estado.associate = (models) => {
        
    };

    return Estado;
};