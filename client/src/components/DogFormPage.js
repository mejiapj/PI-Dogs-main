import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './DogFormPage.css';

const DogFormPage = () => {
  const history = useHistory();

  const [dogForm, setDogForm] = useState({
    imagenUrl: '',
    nombre: '',
    alturaMinima: '',
    alturaMaxima: '',
    pesoMinimo: '',
    pesoMaximo: '',
    anosVida: '',
    temperamentos: [],
  });

  const [temperamentos, setTemperamentos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTemperamentos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/temperaments');
        setTemperamentos(response.data);
      } catch (error) {
        console.error('Error al obtener los temperamentos:', error);
      }
    };

    fetchTemperamentos();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDogForm({ ...dogForm, [name]: value });
  };

  const handleTemperamentoChange = (event) => {
    const selectedTemperamentos = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setDogForm({ ...dogForm, temperamentos: selectedTemperamentos });
  };

  const validateForm = () => {
    const {
      imagenUrl,
      nombre,
      alturaMinima,
      alturaMaxima,
      pesoMinimo,
      pesoMaximo,
      anosVida,
      temperamentos,
    } = dogForm;

    // Validación de la URL
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (!urlRegex.test(imagenUrl)) {
      setError('La URL de la imagen no es válida');
      setTimeout(() => {
        setError('');
      }, 5000); // Ocultar el mensaje de error después de 5 segundos
      focusOnErrorField('imagenUrl');
      return false;
    }

    // Validación del nombre (no debe contener números)
    const nameRegex = /^[a-zA-Z ]*$/;
    if (!nameRegex.test(nombre)) {
      setError('El nombre no puede contener números');
      setTimeout(() => {
        setError('');
      }, 5000);
      focusOnErrorField('nombre');
      return false;
    }

    // Validación de la altura mínima y máxima
    if (
      Number(alturaMinima) > Number(alturaMaxima) ||
      Number(alturaMinima) <= 0 ||
      Number(alturaMaxima) <= 0
    ) {
      setError(
        'La altura mínima debe ser menor que la altura máxima y ambos valores deben ser mayores a cero'
      );
      setTimeout(() => {
        setError('');
      }, 5000);
      focusOnErrorField('alturaMinima');
      return false;
    }

    // Validación del peso mínimo y máximo
    if (
      Number(pesoMinimo) > Number(pesoMaximo) ||
      Number(pesoMinimo) <= 0 ||
      Number(pesoMaximo) <= 0
    ) {
      setError(
        'El peso mínimo debe ser menor que el peso máximo y ambos valores deben ser mayores a cero'
      );
      setTimeout(() => {
        setError('');
      }, 5000);
      focusOnErrorField('pesoMinimo');
      return false;
    }

    // Validación de los años de vida
    const anosVidaPattern = /^(\d+-\d+|\d+)$/;

    if (!anosVidaPattern.test(anosVida)) {
      setError(
        'El formato de los años de vida es inválido. Debe ser en el formato: número-número (ejemplo: 1-10) o un solo número mayor a cero'
      );
      setTimeout(() => {
        setError('');
      }, 5000);
      focusOnErrorField('anosVida');
      return false;
    }

    if (anosVida.includes('-')) {
      const [minAnosVida, maxAnosVida] = anosVida.split('-');
      if (parseInt(minAnosVida) > parseInt(maxAnosVida)) {
        setError(
          'El primer número de los años de vida no puede ser mayor al segundo número'
        );
        setTimeout(() => {
          setError('');
        }, 5000);
        focusOnErrorField('anosVida');
        return false;
      }
    } else {
      if (parseInt(anosVida) <= 0) {
        setError('El número de años de vida debe ser mayor a cero');
        setTimeout(() => {
          setError('');
        }, 5000);
        focusOnErrorField('anosVida');
        return false;
      }
    }

    // Validación de los temperamentos (debe seleccionar al menos uno)
    if (temperamentos.length === 0) {
      setError('Debe seleccionar al menos un temperamento');
      setTimeout(() => {
        setError('');
      }, 5000);
      focusOnErrorField('temperamentos');
      return false;
    }

    return true;
  };
  const focusOnErrorField = (fieldName) => {
    const fieldElement = document.getElementById(fieldName);
    if (fieldElement) {
      fieldElement.focus();
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const dogData = {
      imagen: {
        url: dogForm.imagenUrl,
      },
      altura: {
        imperial: `${dogForm.alturaMinima} - ${dogForm.alturaMaxima}`,
        metric: `${dogForm.alturaMinima * 2.54} - ${
          dogForm.alturaMaxima * 2.54
        }`,
      },
      peso: {
        imperial: `${dogForm.pesoMinimo} - ${dogForm.pesoMaximo}`,
        metric: `${dogForm.pesoMinimo * 0.45} - ${dogForm.pesoMaximo * 0.45}`,
      },
      nombre: dogForm.nombre,
      anos_vida: dogForm.anosVida,
      temperaments: dogForm.temperamentos.join(','),
      origen: 'BD',
    };

    axios
      .post('http://localhost:3001/dogs', dogData)
      .then((response) => {
        history.goBack();
      })
      .catch((error) => {
        setError('Error al crear la raza: ' + error.response.data.message);
        setTimeout(() => {
          setError('');
        }, 5000);
      });
  };

  const handleCancel = () => {
    history.goBack();
  };

  return (
    <div className="dog-form-container">
      <form className="dog-form" onSubmit={handleSubmit}>
        <h1>Dog Form Page</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="imagenUrl">Imagen URL:</label>
          <input
            type="text"
            id="imagenUrl"
            name="imagenUrl"
            value={dogForm.imagenUrl}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={dogForm.nombre}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="alturaMinima">Altura Mínima (en cm):</label>
          <input
            type="number"
            id="alturaMinima"
            name="alturaMinima"
            value={dogForm.alturaMinima}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="alturaMaxima">Altura Máxima (en cm):</label>
          <input
            type="number"
            id="alturaMaxima"
            name="alturaMaxima"
            value={dogForm.alturaMaxima}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="pesoMinimo">Peso Mínimo (en kg):</label>
          <input
            type="number"
            id="pesoMinimo"
            name="pesoMinimo"
            value={dogForm.pesoMinimo}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="pesoMaximo">Peso Máximo (en kg):</label>
          <input
            type="number"
            id="pesoMaximo"
            name="pesoMaximo"
            value={dogForm.pesoMaximo}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="anosVida">Años de Vida:</label>
          <input
            type="text"
            id="anosVida"
            name="anosVida"
            value={dogForm.anosVida}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="temperamentos">Temperamentos:</label>

          <select
            multiple
            id="temperamentos"
            name="temperamentos"
            value={dogForm.temperamentos}
            onChange={handleTemperamentoChange}
            required
          >
            {temperamentos.map((temperamento) => (
              <option key={temperamento.name} value={temperamento.name}>
                {temperamento.name}
              </option>
            ))}
          </select>
        </div>
        <div className="button-group">
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
          >
            Cancelar
          </button>
          <button type="submit">Crear Raza</button>
        </div>
      </form>
    </div>
  );
};

export default DogFormPage;
