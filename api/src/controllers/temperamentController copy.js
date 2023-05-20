const { Temperament } = require('../db');

const axios = require('axios');

async function fetchData() {
  try {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://api.thedogapi.com/v1/breeds',
      headers: {},
    };

    const response = await axios.request(config);

    if (response.data) {
      // console.log(response.data);

      const temperaments = response.data.reduce((acc, obj) => {
        if (
          obj.temperament &&
          typeof obj.temperament === 'string' &&
          obj.temperament.trim() !== ''
        ) {
          const splitTemperaments = obj.temperament.split(', ');
          splitTemperaments.forEach((temp) => {
            const trimmedTemp = temp.trim();
            const existingTemp = acc.find((item) => item.name === trimmedTemp);
            if (!existingTemp) {
              acc.push({ name: trimmedTemp });
            }
          });
        }
        return acc;
      }, []);

      temperaments.sort((a, b) => a.name.localeCompare(b.name));

      console.log(temperaments);

      await fillDbTemperaments(temperaments);
    }
  } catch (error) {
    console.log(error);
  }
}

const fillDbTemperaments = async (temperaments) => {
  console.log(temperaments);
  try {
    if (temperaments && temperaments.length > 0) {
      await Temperament.bulkCreate(temperaments);
    }
  } catch (error) {
    console.log(error);
  }
};

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
  fetchData,
};
