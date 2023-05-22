const { Dog, Temperament } = require('../db');
const axios = require('axios');
const { Op } = require('sequelize');

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
      uniqueTemperaments = temperaments
        .split(',')
        .map((temp) => temp.trim())
        .sort();

      console.log(uniqueTemperaments);

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

      if (nonExistingTemperamentNames.length > 0) {
        const message =
          nonExistingTemperamentNames.length === 1
            ? `El temperamento ${nonExistingTemperamentNames[0]} no existe`
            : `Los temperamentos ${nonExistingTemperamentNames.join(
                ', '
              )} no existen`;

        return res.status(500).json({ message });
      }

      const finalTemperaments = existingTemperaments;

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

      if (temperaments.length > 0) {
        dog.temperaments =
          temperaments.length > 1 ? temperaments.join(',') : temperaments[0];
      } else {
        delete dog.temperaments;
      }

      return dog;
    });

    if (modifiedDogs.length === 0) {
      return res
        .status(404)
        .json({ message: 'No hay perros en la base de datos' });
    }

    return res.status(200).json(modifiedDogs);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Ocurrió un error al obtener los perros' });
  }
};
////////////////////////////////////////////
const getDogById = async (req, res) => {
  const idRaza = req.params.idRaza;

  try {
    const dog = await Dog.findByPk(idRaza, {
      include: Temperament,
    });

    if (!dog) {
      return res.status(404).json({ message: 'Raza no encontrada' });
    }

    const temperaments = dog.temperaments
      .map((temperament) => temperament.name)
      .join(', ');

    const dogWithTemperaments = { ...dog.toJSON() };

    if (temperaments) {
      dogWithTemperaments.temperaments = temperaments;
    } else {
      delete dogWithTemperaments.temperaments;
    }

    res.json(dogWithTemperaments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al obtener la raza' });
  }
};

//////////////////////////////////////////
const getDogsByName = async (req, res) => {
  const name = req.query.name;

  try {
    const dogs = await Dog.findAll({
      where: {
        nombre: {
          [Op.iLike]: `%${name}%`,
        },
      },
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

    if (dogs.length === 0) {
      return res.status(404).json({ message: 'No se encontraron razas' });
    }

    const modifiedDogs = dogs.map((dog) => {
      const temperaments = dog.temperaments.map(
        (temperament) => temperament.name
      );
      dog = dog.toJSON();

      if (temperaments.length > 0) {
        dog.temperaments =
          temperaments.length > 1 ? temperaments.join(',') : temperaments[0];
      } else {
        delete dog.temperaments;
      }

      return dog;
    });

    res.json(modifiedDogs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al buscar las razas' });
  }
};

const fetchDataDogs = async () => {
  try {
    const response = await axios.get('https://api.thedogapi.com/v1/breeds');

    if (response.data) {
      const dogData = response.data.map((dog) => {
        const temperaments = dog.temperament
          ? dog.temperament.split(',').map((temp) => temp.trim())
          : [];

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

      let sortedTemperamentNames = Array.from(uniqueTemperamentNames).sort();
      // console.log(sortedTemperamentNames);

      if (sortedTemperamentNames.length > 0) {
        const existingTemperaments = await Temperament.findAll({
          where: { name: sortedTemperamentNames },
        });

        const nonExistingTemperamentNames = sortedTemperamentNames.filter(
          (name) =>
            !existingTemperaments.some(
              (temperament) => temperament.name === name
            )
        );

        const newTemperaments = await Promise.all(
          nonExistingTemperamentNames.map((name) =>
            Temperament.create({ name })
          )
        );

        const createdTemperaments = [
          ...existingTemperaments,
          ...newTemperaments,
        ];

        for (const dog of dogData) {
          if (dog.temperaments.length > 0) {
            const temperaments = dog.temperaments.map((temperament) =>
              createdTemperaments.find((t) => t.name === temperament)
            );

            const createdDog = await Dog.create(dog);
            await createdDog.setTemperaments(temperaments);
          } else {
            await Dog.create(dog);
          }
        }
      } else {
        for (const dog of dogData) {
          await Dog.create(dog);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createDog,
  getAllDogs,
  getDogById,

  getDogsByName,
  fetchDataDogs,
};
