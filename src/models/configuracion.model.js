const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Configuracion = sequelize.define('Configuracion', {
        
        codigo_configuracion: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        
        nombre_configuracion: {
            type: DataTypes.STRING
        },
        
        valor_configuracion: {
            type: DataTypes.STRING
        },
        
        descripcion: {
            type: DataTypes.TEXT
        },

        estado: {
            type: DataTypes.STRING,
        },
        
        fecha_modificacion: {
            type: DataTypes.STRING
        },
        
        usuario_modificacion: {
            type: DataTypes.STRING
        }
        
    }, {
        tableName: 'configuracion',
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
    Configuracion.associate = (models) => {
        
    };

    return Configuracion;
};