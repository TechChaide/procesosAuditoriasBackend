const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Modelo = sequelize.define('Modelo', {
        
        codigo_modelo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        
        codigo_tipo_auditoria: {
            type: DataTypes.INTEGER
        },
        
        nombre_modelo: {
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
        tableName: 'modelo',
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
    Modelo.associate = (models) => {
        Modelo.belongsTo(models.Tipo_auditoria, {
            foreignKey: 'codigo_tipo_auditoria',
            as: 'tipo_auditoria',
            targetKey: 'codigo_tipo_auditoria'
        });
    };

    return Modelo;
};