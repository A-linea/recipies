// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
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


elements.searchResPages.addEventListener('click', event => {
  const button = event.target.closest('.btn-inline');
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
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    //Highlight selected
    if (state.search)
      searchView.activeSelected(id);

    //Create new recipe obj
    state.recipe = new Recipe(id);

    try {
      //Get recipe data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      //Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      //Render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe,
        state.likes.isLiked(id));

    } catch (e) {
      alert('Error processing recipe');
    }
  }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**SHOPPING LIST CONTROLLER**/
const controlList = () => {
  //Create a new list IF there in none yet
  if (!state.list) state.list = new List();

  //Add each ingredients to the list
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

//Handle delete and update list item events
elements.shopping.addEventListener('click', event => {
  const id = event.target.closest('.shopping__item').dataset.itemid;


  //Handle the delete button
  if (event.target.matches(`.shopping__delete, .shopping__delete *`)) {

    //Delete from state
    state.list.deleteItem(id);

    //Delete from UI
    listView.deleteItem(id);

    //Handle the count update
  } else if (event.target.matches('.shopping__count-value')) {
    const val = parseFloat(event.target.value, 10);
    state.list.updateCount(id, val);
  }
});

/**LIKES CONTROLLER**/
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;
  //User has not yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
    //Add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );

    //Toggle the like button
    likesView.toggleLikeBtn(true);

    //Add like to UI list
    likesView.renderLike(newLike);
    //User has not yet liked current recipe
  } else {
    //Remove like to the state
    state.likes.deleteLike(currentID);
    //Toggle the like button
    likesView.toggleLikeBtn(false);


    //Remove like from UI list
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//Restore liked recipes on page load

window.addEventListener('load', () => {
 state.likes = new Likes();
 //Restore likes
 state.likes.readStorage();
 //Toggle like menu button
 likesView.toggleLikeMenu(state.likes.getNumLikes());
 //Render existing likes
  state.likes.likes.forEach(like => likesView.renderLike(like));
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', event => {
  if (event.target.matches('.btn-decrease, .btn-decrease *')) {
    //Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (event.target.matches('.btn-increase, .btn-increase *')) {
    //Increase button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    //Add ingredients to shopping list
    controlList();
  } else if (event.target.matches('.recipe__love, .recipe__love *')) {
    //Like controller
    controlLike();
  }
});

