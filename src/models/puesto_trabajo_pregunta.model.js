const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Puesto_trabajo_pregunta = sequelize.define('Puesto_trabajo_pregunta', {
        
        codigo_puesto_trabajo_pregunta: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        
        codigo_modelo: {
            type: DataTypes.INTEGER
        },
        
        codigo_puesto_trabajo: {
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
        }
        
    }, {
        tableName: 'puesto_trabajo_pregunta',
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
    Puesto_trabajo_pregunta.associate = (models) => {
        Puesto_trabajo_pregunta.belongsTo(models.Modelo, {
        foreignKey: 'codigo_modelo',
        as: 'modelo',
        targetKey: 'codigo_modelo'
    });

    Puesto_trabajo_pregunta.belongsTo(models.Puesto_trabajo, {
        foreignKey: 'codigo_puesto_trabajo',
        as: 'puesto_trabajo',
        targetKey: 'codigo_puesto_trabajo'
    });
    };

    return Puesto_trabajo_pregunta;
};