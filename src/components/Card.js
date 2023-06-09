import React from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';

const Card = (props) => {
  const { index, name, imgSrc, id } = props;
  const { location: { pathname } } = useHistory();
  const path = pathname.includes('foods') ? 'foods' : 'drinks';
  return (
    <Link to={ `/${path}/${id}` } data-testid={ `${index}-recipe-card` }>
      <img
        className="recipe-img"
        alt={ name }
        data-testid={ `${index}-card-img` }
        src={ imgSrc }
        width="150"
        height="150"
      />
      <p className="recipe-name" data-testid={ `${index}-card-name` }>{name}</p>
    </Link>
  );
};

Card.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  imgSrc: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default Card;
