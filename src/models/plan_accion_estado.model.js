const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Plan_accion_estado = sequelize.define('Plan_accion_estado', {
        codigo_plan_accion_estado: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        codigo_estado: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'codigo_estado'
        },

        codigo_plan_accion: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'codigo_plan_accion'
        },

        detalle: {
            type: DataTypes.TEXT,
            field: 'detalle'
        },

        estado: {
            type: DataTypes.STRING(1),
            field: 'estado'
        },

        fecha_modificacion: {
            type: DataTypes.DATE,
            field: 'fecha_modificacion'
        },

        usuario_modificacion: {
            type: DataTypes.STRING(50),
            field: 'usuario_modificacion'
        }

    }, {
        tableName: 'plan_accion_estado',
        schema: 'dbo',
        timestamps: false,
        freezeTableName: true,
        dialectOptions: {
            options: {
                requestTimeout: 30000,
                encrypt: false,
                trustServerCertificate: true
            }
        }
    });

    Plan_accion_estado.associate = (models) => {
        Plan_accion_estado.belongsTo(models.Estado, {
            foreignKey: 'codigo_estado',
            as: 'estado_obj',
            targetKey: 'codigo_estado'
        });

        Plan_accion_estado.belongsTo(models.Plan_accion, {
            foreignKey: 'codigo_plan_accion',
            as: 'plan_accion',
            targetKey: 'codigo_plan_accion'
        });
    };

    return Plan_accion_estado;
};
