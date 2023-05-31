import React from 'react';
import PropTypes from 'prop-types';
import './DogCard.css';

const DogCard = ({ dog, onClick }) => {
  const { imagen, nombre, temperaments, peso } = dog;

  return (
    <div className="dog-card" onClick={onClick}>
      {imagen && imagen.url && (
        <img
          src={imagen.url}
          alt={nombre}
          width="200"
          height="150"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'placeholder.jpg'; // Ruta de la imagen de reemplazo en caso de error
          }}
        />
      )}
      <h2>{nombre}</h2>
      <p className="temperaments">
        Temperaments:{' '}
        {Array.isArray(temperaments) ? temperaments.join(', ') : temperaments}
      </p>
      <h2>{peso.imperial} lbs</h2>
      <h2>{peso.metric} kg</h2>
    </div>
  );
};

DogCard.propTypes = {
  dog: PropTypes.shape({
    imagen: PropTypes.shape({
      url: PropTypes.string,
    }),
    nombre: PropTypes.string,
    temperaments: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    peso: PropTypes.shape({
      imperial: PropTypes.string,
      metric: PropTypes.string,
    }),
  }),
  onClick: PropTypes.func,
};

export default DogCard;
