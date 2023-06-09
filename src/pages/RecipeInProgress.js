import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import copy from 'clipboard-copy';
import foodsApi from '../api/foodsApi';
import drinksApi from '../api/drinksApi';
import normalize from '../api/normalizeData';
import IngredientInProgress from '../components/IngredientInProgress';
// import StartRecipe from '../components/StartRecipe';
import RecipeContext from '../context/RecipeContext';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';

const aSecond = 1000;

// function getRecipeStatus(doneRecipes, inProgress, id) {
//   if (doneRecipes.find((recipe) => recipe.id === id)) {
//     return 'done';
//   }
//   if (Object.keys(inProgress).find((recipe) => recipe.id === id)) {
//     return 'in progress';
//   }
//   return 'undone';
// }

function isFavorite(favorites, id) {
  return favorites.find((recipe) => recipe.id === id);
}

function RecipeDetails() {
  const {
    // getDoneRecipes,
    // getInProgressRecipes,
    getFavoriteRecipes,
    addFavoriteRecipe,
    removeFavoriteRecipe,
    arrayIngredients,
    addDoneRecipe,
  } = useContext(RecipeContext);
  const { location: { pathname } } = useHistory();
  const history = useHistory();
  const { id } = useParams();
  const type = pathname.includes('foods') ? 'foods' : 'drinks';
  const fetch = type === 'foods' ? foodsApi : drinksApi;
  const [recipeState, setRecipeState] = useState({ recipe: {}, isLoad: false });
  // const [status, setStatus] = useState('done');// done , in progress, undone
  const [copiedMensage, setCopiedMensage] = useState(false);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    fetch('Lookup', id).then((response) => {
      setRecipeState({
        recipe: normalize(response)[0],
        isLoad: true,
      });
    });
    // setStatus(getRecipeStatus(
    //   getDoneRecipes(),
    //   getInProgressRecipes(),
    //   id,
    // ));
    setFavorite(isFavorite(getFavoriteRecipes(), id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (copiedMensage) {
    setTimeout(() => setCopiedMensage(false), aSecond);
  }

  const { recipe, isLoad } = recipeState;
  // console.log(recipe?.strMealThumb);
  // console.log(type, isLoad);

  const { name,
    thumb,
    instructions,
    category,
    alcoholic,
    ingredients,
  } = recipe;
  return (
    <div>
      <h1 id="h1">
        Recipe in Progress
      </h1>
      {isLoad && (
        <div className="details-container">
          <img
            id="recipe-photo"
            className="card-details"
            data-testid="recipe-photo"
            alt={ name }
            src={ thumb }
            width="330"
            height="330"
          />
          <h1 className="details-element" data-testid="recipe-title">
            {name}
          </h1>
          <input
            className="details-element"
            type="image"
            alt="shareIcon"
            data-testid="share-btn"
            src={ shareIcon }
            onClick={ () => {
              const copiaLink = `http://localhost:3000${pathname}`;
              copy(copiaLink.replace('/in-progress', ''));
              setCopiedMensage(true);
            } }
          />
          <input
            className="details-element"
            type="image"
            alt="favoriteIcon"
            data-testid="favorite-btn"
            src={ favorite ? blackHeartIcon : whiteHeartIcon }
            onClick={ () => {
              if (favorite) removeFavoriteRecipe(id);
              else addFavoriteRecipe(recipe);
              setFavorite(!favorite);
            } }
          />
          { copiedMensage && <p> Link copied! </p> }
          <div className="card-details">
            <h4 className="details-element" data-testid="recipe-category">
              {alcoholic || category}
            </h4>
            <IngredientInProgress
              ingredients={ ingredients }
              id={ id }
              type={ type }
              inProgress
            />
            <h4
              id="adjustment"
              className="details-element"
              data-testid="instructions"
            >
              {instructions}

            </h4>
          </div>
        </div>
      )}
      <button
        id="finish-recipe-btn"
        type="button"
        data-testid="finish-recipe-btn"
        disabled={ arrayIngredients?.length !== ingredients?.length }
        onClick={ () => {
          addDoneRecipe(recipe);
          history.push('/done-recipes');
        } }
      >
        Finalize Recipe
      </button>
    </div>
  );
}

export default RecipeDetails;
