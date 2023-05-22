const { Dog, Temperament } = require('../db');
const axios = require('axios');

const createDog = async (req, res, next) => {
  try {
    const { imagen, nombre, altura, peso, anos_vida, temperaments } = req.body;

    const existingDog = await Dog.findOne({
      where: { nombre },
    });

    if (existingDog) {
      return res
        .status(500)
        .json({ message: 'El perro ya existe en la base de datos' });
    }

    let dog;

    let uniqueTemperaments = [];

    if (temperaments) {
      const xtemperaments = temperaments.split(',').map((temp) => temp.trim());
      uniqueTemperaments = [...new Set(xtemperaments)];

      if (uniqueTemperaments.length === 0) {
        return res.status(500).json({
          message: 'Se requiere al menos un temperamento para crear un perro',
        });
      }

      const existingTemperaments = await Temperament.findAll({
        where: { name: uniqueTemperaments },
      });

      const existingTemperamentNames = existingTemperaments.map(
        (temperament) => temperament.name
      );

      const nonExistingTemperamentNames = uniqueTemperaments.filter(
        (name) => !existingTemperamentNames.includes(name)
      );

      const newTemperaments = await Promise.all(
        nonExistingTemperamentNames.map((name) => Temperament.create({ name }))
      );

      const finalTemperaments = [...existingTemperaments, ...newTemperaments];

      dog = await Dog.create({
        nombre,
        imagen,
        altura,
        peso,
        anos_vida,
      });

      await dog.setTemperaments(finalTemperaments);
    } else {
      dog = await Dog.create({
        nombre,
        imagen,
        altura,
        peso,
        anos_vida,
      });
    }

    res.status(201).json({ message: 'El perro fue creado satisfactoriamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fetchDataDogs = async () => {
  try {
    const response = await axios.get('https://api.thedogapi.com/v1/breeds');

    if (response.data) {
      const dogData = response.data.map((dog) => {
        const temperaments = dog.temperament
          ? dog.temperament.split(',').map((temp) => temp.trim())
          : ['Sin temperamento'];

        return {
          imagen: dog.image.url,
          nombre: dog.name,
          altura: parseFloat(dog.height.metric),
          peso: parseFloat(dog.weight.metric),
          anos_vida: parseInt(dog.life_span.split(' ')[0]),
          temperaments: temperaments.filter((temp, index, self) => {
            return self.indexOf(temp) === index;
          }),
        };
      });

      const uniqueTemperamentNames = new Set();

      dogData.forEach((dog) => {
        dog.temperaments.forEach((temperament) => {
          uniqueTemperamentNames.add(temperament);
        });
      });

      const existingTemperaments = await Temperament.findAll({
        where: { name: Array.from(uniqueTemperamentNames) },
      });

      const existingTemperamentNames = existingTemperaments.map(
        (temperament) => temperament.name
      );

      const nonExistingTemperamentNames = Array.from(
        uniqueTemperamentNames
      ).filter((name) => !existingTemperamentNames.includes(name));

      const newTemperaments = await Promise.all(
        nonExistingTemperamentNames.map((name) => Temperament.create({ name }))
      );

      const createdTemperaments = [...existingTemperaments, ...newTemperaments];

      const createdDogs = await Dog.bulkCreate(dogData, {
        ignoreDuplicates: true,
      });

      for (const createdDog of createdDogs) {
        const dog = dogData.find((dog) => dog.nombre === createdDog.nombre);
        const temperaments = dog.temperaments.map((temperament) =>
          createdTemperaments.find((t) => t.name === temperament)
        );

        await createdDog.setTemperaments(temperaments);
      }
    }
  } catch (error) {
    console.log(error);
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

    const modifiedDogs = allDogs.map((dog) => {
      const temperaments = dog.temperaments.map(
        (temperament) => temperament.name
      );
      dog = dog.toJSON();
      dog.temperaments =
        temperaments.length > 1 ? temperaments.join(',') : temperaments[0];

      if (dog.temperaments === 'Sin temperamento') {
        delete dog.temperaments;
      }

      return dog;
    });

    return res.status(200).json(modifiedDogs);
  } catch (error) {
    return res
      .status(404)
      .json({ message: 'No hay perros en la base de datos' });
  }
};

module.exports = {
  createDog,
  getAllDogs,
  fetchDataDogs,
};
