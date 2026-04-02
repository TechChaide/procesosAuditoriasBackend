const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Pregunta = sequelize.define('Pregunta', {
        
        codigo_pregunta: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        
        descripcion_pregunta: {
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
        tableName: 'pregunta',
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
    Pregunta.associate = (models) => {
        
    };

    return Pregunta;
};