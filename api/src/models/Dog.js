const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    'dog',
    {
      imagen: {
        type: DataTypes.JSONB,
        allowNull: true,
        get() {
          const image = this.getDataValue('imagen');
          return image ? JSON.parse(image) : null;
        },
        set(value) {
          this.setDataValue('imagen', JSON.stringify(value));
        },
      },

      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      altura: {
        type: DataTypes.JSONB,
        allowNull: true,
        get: function () {
          return JSON.parse(this.getDataValue('altura'));
        },
        set: function (value) {
          this.setDataValue('altura', JSON.stringify(value));
        },
      },

      peso: {
        type: DataTypes.JSONB,
        allowNull: true,
        get: function () {
          return JSON.parse(this.getDataValue('peso'));
        },
        set: function (value) {
          this.setDataValue('peso', JSON.stringify(value));
        },
      },
      anos_vida: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      origen: {
        type: DataTypes.ENUM('API', 'BD'),
        allowNull: false,
        defaultValue: 'API',
      },
    },
    {
      timestamps: false, // Omitir createdAt y updatedAt
    }
  );
};
