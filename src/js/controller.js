import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';

if (module.hot) {
  module.hot.accept();
}

const RecipesController = async () => {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //loading recipe
    await model.loadRecipe(id);

    // render recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.log(error);
    recipeView.renderError();
  }
};

const SearchResultsController = async () => {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultsPage(1));

    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const PaginationController = goToPage => {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const ServingsController = newServings => {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

const init = (() => {
  recipeView.addHandlerRender(RecipesController);
  recipeView.addHandlerUpdateServings(ServingsController);
  searchView.addHandlerSearch(SearchResultsController);
  paginationView.addHandlerClick(PaginationController);
})();
