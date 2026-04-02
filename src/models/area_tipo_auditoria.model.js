const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Area_tipo_auditoria = sequelize.define('Area_tipo_auditoria', {
        
        codigo_area_tipo_auditoria: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        
        nombre_area: {
            type: DataTypes.STRING
        },

        area_visibilidad: {
            type: DataTypes.STRING
        },

        correo_reporte: {
            type: DataTypes.STRING
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
        tableName: 'area_tipo_auditoria',
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

    return Area_tipo_auditoria;
};