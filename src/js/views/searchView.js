import {elements} from './base';

export const getInput = () => elements.searchInput.value;
export const clearInput = () => {
  elements.searchInput.value = '';
};
export const clearResults = () => {
  elements.searchResList.innerHTML = '';
};

// Pasta with tomato and spinach
/*
acc : 0 - first iteration
acc + cur.length = 5 ---pasta/ push newTitle ['pasta']
acc: 5 + cur.length = 9 /---with / push newTitle['pasta','with']
acc: 9 + cur.length = 15 /---tomato / push newTitle['pasta','with', 'tomato']
acc: 15 + cur.length = 18 /---and > than limit.
* */
const limitRecipeTitle = (title, limit = 18) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(' ').reduce((acc, curr) => {
      if (acc + curr.length <= limit) {
        newTitle.push(curr)
      }
      return acc + curr.length;
    }, 0);
    //return the result
    return `${newTitle.join(' ')}...`;
  }
  return title;
};

const renderRecipe = recipe => {
  const markup = `
  <li>
     <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
           <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
           <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
           <p class="results__author">${recipe.publisher}</p>
        </div>
     </a>
  </li>
  `;
  elements.searchResList.insertAdjacentHTML('beforeend', markup)
};

export const renderResults = recipes => {
  recipes.forEach(renderRecipe)
};