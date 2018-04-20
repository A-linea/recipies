// Global app controller
import Search from './models/Search';
import * as searchView from './views/searchView';
import {elements, renderLoader, clearLoader} from './views/base';


/**Global state of the app
 * Search obj
 * Current recipe obj
 * Shopping list obj
 * Liked recipes
*/
const  state = {};

const controlSearch = async()=> {
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
    //4. Search for recipes
    await state.search.getResults();

    //5. Render results on UI
    clearLoader(elements.searchRes);
    searchView.renderResults(state.search.result);

  }
};

elements.searchForm.addEventListener('submit', event=> {
  event.preventDefault();
  controlSearch();
});

