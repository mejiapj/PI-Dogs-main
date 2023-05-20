const { Dog, Temperament } = require('../db');

const createDog = async (req, res, next) => {
  let { imagen, nombre, altura, peso, anos_vida, temperament } = req.body;

  const existingDog = await Dog.findOne({
    where: { nombre: nombre },
  });

  if (existingDog) {
    return res
      .status(500)
      .json({ message: 'El dog ya existe en la base de datos' });
  }

  const temperamentDog = await Temperament.findOne({
    where: { name: temperament },
  });

  if (!temperamentDog) {
    return res
      .status(500)
      .json({ message: 'no existe el temperament seleccionado' });
  }

  try {
    const dogCreated = await Dog.create({
      imagen,
      nombre,
      altura,
      peso,
      anos_vida,
    });

    dogCreated.addTemperaments(temperamentDog);

    res.status(201).json({ message: 'el dog fue creado satisfactoriamente' });
    // .json({ dogCreated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllDogs = async (req, res, next) => {
  try {
    const allDogs = await Dog.findAll({
      include: [
        {
          model: Temperament,
          attributes: ['name'],
          through: {
            attributes: [],
          },
        },
      ],
    });

    return res.status(200).json(allDogs);
  } catch (error) {
    return res.status(404).json({ message: 'No hay dogs en la base de datos' });
  }
};

module.exports = {
  createDog,
  getAllDogs,
};
