const { Temperament } = require('../db');

const createTemperament = async (req, res, next) => {
  let { name } = req.body;

  const existingTemperament = await Temperament.findOne({
    where: { name: name },
  });

  if (existingTemperament) {
    return res
      .status(500)
      .json({ message: 'El Temperament ya existe en la base de datos' });
  }

  try {
    const TemperamentCreated = await Temperament.create({
      name,
    });

    res
      .status(201)
      .json({ message: 'El Temperament fue creado satisfactoriamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTemperaments = async (req, res, next) => {
  try {
    const allTemperament = await Temperament.findAll();

    return res.status(200).json(allTemperament);
  } catch (error) {
    return res
      .status(404)
      .json({ message: 'No hay Temperamentos en la base de datos' });
  }
};

module.exports = {
  createTemperament,
  getAllTemperaments,
};
