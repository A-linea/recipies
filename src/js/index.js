// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import {elements, renderLoader, clearLoader} from './views/base';


/**Global state of the app
 * Search obj
 * Current recipe obj
 * Shopping list obj
 * Liked recipes
 */
const state = {};
/**SEARCH CONTROLLER**/
const controlSearch = async () => {
  //1. Get a query from the view
  const query = searchView.getInput();
  console.log(query);

  if (query) {
    //2. New search obj and add to state
    state.search = new Search(query);

    //3. Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    try {

      //4. Search for recipes
      await state.search.getResults();

      //5. Render results on UI
      clearLoader(elements.searchRes);
      searchView.renderResults(state.search.result);
    } catch (e) {
      alert('Search error');
      clearLoader(elements.searchRes);
    }
  }
};

elements.searchForm.addEventListener('submit', event => {
  event.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
  const button = e.target.closest('.btn-inline');
  if (button) {
    const goToPage = parseInt(button.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

/**RECIPE CONTROLLER**/
const controlRecipe = async () => {
  //Get ID from the url
  const id = window.location.hash.replace('#', '');
  if (id) {
    //Prepare UI for changes

    //Create new recipe obj
    state.recipe = new Recipe(id);
    try {
      //Get recipe data
      await state.recipe.getRecipe();
      //Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      //Render recipe
      console.log(state.recipe);
    } catch (e) {
      alert('Error processing recipe');
    }
  }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));