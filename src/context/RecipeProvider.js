import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import RecipeContext from './RecipeContext';
import foodsApi from '../api/foodsApi';
import drinksApi from '../api/drinksApi';

function RecipeProvider({ children }) {
  const history = useHistory();
  const [getFood, setGetFood] = useState({ meals: [] });
  const [getDrink, setGetDrink] = useState({ drinks: [] });
  const [arrayIngredients, setArrayIngredients] = useState([]);

  function salvaEmail(emailLogin) {
    const emailStorage = { email: emailLogin };
    localStorage.setItem('user', JSON.stringify(emailStorage));
    localStorage.setItem('mealsToken', JSON.stringify(1));
    localStorage.setItem('cocktailsToken', JSON.stringify(1));
    localStorage.setItem('inProgressRecipes', JSON.stringify({
      cocktails: {}, meals: {} }));
  }

  function getDoneRecipes() {
    return JSON.parse(localStorage.getItem('doneRecipes')) || [];
  }

  function getInProgressRecipes(id, type) {
    const getInProgress = JSON.parse(localStorage.getItem('inProgressRecipes'));
    if (type === 'foods') {
      setArrayIngredients(getInProgress?.meals[id] ? getInProgress.meals[id] : []);
    } else {
      setArrayIngredients(getInProgress?.cocktails[id]
        ? getInProgress.cocktails[id]
        : []);
    }
    return getInProgress;
  }

  function getFavoriteRecipes() {
    return JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
  }

  function addDoneRecipe(recipe) {
    const date = new Date();
    const doneDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const {
      id,
      type,
      nationality,
      category,
      alcoholic,
      thumb: image,
      tags,
    } = recipe;

    const doneRecipe = {
      id,
      type,
      nationality: nationality || '',
      category: category || '',
      alcoholicOrNot: alcoholic || '',
      image,
      tags,
      doneDate,
    };
    console.log(doneRecipe);
    localStorage.setItem(
      'doneRecipes', JSON.stringify([...getDoneRecipes(), doneRecipe]),
    );
  }

  function addFavoriteRecipe(recipe) {
    const {
      id,
      type,
      nationality,
      category,
      alcoholic,
      name,
      thumb: image,
    } = recipe;
    const favoriteRecipe = {
      id,
      type,
      nationality: nationality || '',
      category,
      alcoholicOrNot: alcoholic || '',
      name,
      image,
    };
    localStorage.setItem(
      'favoriteRecipes', JSON.stringify([...getFavoriteRecipes(), favoriteRecipe]),
    );
  }

  function addInProgressRecipes(id, index, type) { // TRABALHANDO AQUI
    let inProgressRecipesStorage = JSON.parse(localStorage.getItem('inProgressRecipes'))
    || { meals: {}, cocktails: {} };
    console.log(inProgressRecipesStorage);
    const { meals } = inProgressRecipesStorage;
    const indexes = meals[id] || [];
    console.log(id, type, index);

    let typeOnStorage = '';
    typeOnStorage = type === 'foods' ? 'meals' : 'cocktails';

    console.log(inProgressRecipesStorage[typeOnStorage][id]);
    if (inProgressRecipesStorage[typeOnStorage][id]
      && inProgressRecipesStorage[typeOnStorage][id]
        .some((element) => (element === index))) {
      const possitionIndex = inProgressRecipesStorage[typeOnStorage][id].indexOf(index);
      inProgressRecipesStorage[typeOnStorage][id].splice(possitionIndex, 1);
      localStorage.setItem('inProgressRecipes', JSON.stringify(inProgressRecipesStorage));
    } else {
      inProgressRecipesStorage = {
        ...inProgressRecipesStorage,
        typeOnStorage: { [id]: [...indexes, index] } };
      console.log(inProgressRecipesStorage);
      localStorage.setItem('inProgressRecipes', JSON.stringify(inProgressRecipesStorage));
    }

    //   let recipeInProgress
    // const recipeInProgress = {
    //  cocktails: {
    //  id-da-bebida: [lista-de-ingredientes-utilizados],
    //  },
    //  meals: {
    //  id-da-comida: [lista-de-ingredientes-utilizados],
    //  }
    //  }
    // localStorage.setItem(
    //  'favoriteRecipes', JSON.stringify([...getFavoriteRecipes(), favoriteRecipe]),
    // );
  }

  function removeFavoriteRecipe(id) {
    const favoriteRecipes = getFavoriteRecipes();
    const newFavoriteRecipes = favoriteRecipes.filter(
      (recipe) => recipe.id !== id,
    );
    localStorage.setItem('favoriteRecipes', JSON.stringify(newFavoriteRecipes));
  }

  async function fetchFood(searchType, searchValue, local) {
    if (searchType === 'FirstLetter' && searchValue.length > 1) {
      global.alert('Your search must have only 1 (one) character');
    }
    if (local === '/foods') {
      const food = await foodsApi(searchType, searchValue);
      setGetFood(food);
      if (food.meals?.length === 1) {
        history.push(`/foods/${food.meals[0].idMeal}`);
      } else if (!food.meals) {
        global.alert('Sorry, we haven\'t found any recipes for these filters.');
      }
    } else {
      const drink = await drinksApi(searchType, searchValue) || {};
      setGetDrink(drink);
      if (drink?.drinks?.length === 1 && drink) {
        history.push(`/drinks/${drink.drinks[0].idDrink}`);
      } else if (!drink.drinks) {
        global.alert('Sorry, we haven\'t found any recipes for these filters.');
      }
    }
  }

  const contextValue = {
    salvaEmail,
    fetchFood,
    getDrink,
    getFood,
    setGetFood,
    setGetDrink,
    getDoneRecipes,
    getInProgressRecipes,
    getFavoriteRecipes,
    addDoneRecipe,
    addFavoriteRecipe,
    addInProgressRecipes,
    removeFavoriteRecipe,
    arrayIngredients,
  };

  return (
    <RecipeContext.Provider value={ contextValue }>
      {children}
    </RecipeContext.Provider>
  );
}

RecipeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  // history: PropTypes.node.isRequired,
};

export default RecipeProvider;
