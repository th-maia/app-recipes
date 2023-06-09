import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import RecipeContext from '../context/RecipeContext';

function SearchBar() {
  const { fetchFood } = useContext(RecipeContext);
  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState('Ingredient');
  const history = useHistory();
  const local = history.location.pathname;
  return (
    <div className="search-bar">
      <input
        className="search-component"
        type="text"
        data-testid="search-input"
        value={ searchValue }
        onChange={ ({ target }) => setSearchValue(target.value) }
      />
      <input
        className="search-component"
        type="radio"
        data-testid="ingredient-search-radio"
        value="Ingredient"
        onChange={ ({ target }) => setSearchType(target.value) }
        name="typeSearch"
      />
      ingrediente
      <input
        className="search-component"
        type="radio"
        data-testid="name-search-radio"
        value="Name"
        onChange={ ({ target }) => setSearchType(target.value) }
        name="typeSearch"
      />
      nome
      <input
        className="search-component"
        type="radio"
        data-testid="first-letter-search-radio"
        value="FirstLetter"
        onChange={ ({ target }) => setSearchType(target.value) }
        name="typeSearch"
      />
      primeira letra
      <button
        className="search-component"
        type="button"
        data-testid="exec-search-btn"
        onClick={ () => fetchFood(searchType, searchValue, local) }
      >
        Buscar
      </button>
    </div>
  );
}

export default SearchBar;
