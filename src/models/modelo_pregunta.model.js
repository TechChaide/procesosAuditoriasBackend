const { DataTypes } = require('sequelize');
const { OrderToken } = require('tedious/lib/token/token');

module.exports = (sequelize) => {
    const Modelo_pregunta = sequelize.define('Modelo_pregunta', {
        
        codigo_modelo_pregunta: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        orden : {
            type: DataTypes.INTEGER
        },
        
        estado: {
            type: DataTypes.STRING
        },
        
        fecha_modificacion: {
            type: DataTypes.STRING
        },
        
        usuario_modificacion: {
            type: DataTypes.STRING
        },
        
        codigo_modelo: {
            type: DataTypes.INTEGER
        },
        
        codigo_pregunta: {
            type: DataTypes.INTEGER
        }
        
    }, {
        tableName: 'modelo_pregunta',
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
    Modelo_pregunta.associate = (models) => {
        Modelo_pregunta.belongsTo(models.Modelo, {
            foreignKey: 'codigo_modelo',
            as: 'modelo',
            targetKey: 'codigo_modelo'
        });
        
        Modelo_pregunta.belongsTo(models.Pregunta, {
            foreignKey: 'codigo_pregunta',
            as: 'pregunta',
            targetKey: 'codigo_pregunta'
        });
    };

    return Modelo_pregunta;
};