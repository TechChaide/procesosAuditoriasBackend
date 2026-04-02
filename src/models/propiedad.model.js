const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Propiedad = sequelize.define('Propiedad', {
        
        codigo_propiedad: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        
        codigo_pregunta: {
            type: DataTypes.INTEGER
        },
        
        codigo_tipo_propiedad: {
            type: DataTypes.INTEGER
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
        tableName: 'propiedad',
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
    Propiedad.associate = (models) => {
        Propiedad.belongsTo(models.Pregunta, {
        foreignKey: 'codigo_pregunta',
        as: 'pregunta',
        targetKey: 'codigo_pregunta'
    });
    Propiedad.belongsTo(models.Tipo_propiedad, {
        foreignKey: 'codigo_tipo_propiedad',
        as: 'tipo_propiedad',
        targetKey: 'codigo_tipo_propiedad'
    });
    };

    return Propiedad;
};