import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config';
import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';

const RecipesController = async () => {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //update bookmarks
    bookmarksView.update(model.state.bookmarks);

    //loading recipe
    await model.loadRecipe(id);

    // render recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.error(error);
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

const ToggleBookmarkController = () => {
  model.toggleBookmark();
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

const BookmarksController = () => {
  bookmarksView.render(model.state.bookmarks);
};

const AddRecipeController = async newRecipe => {
  try {
    // loading
    addRecipeView.renderSpinner();

    // Upload
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    // Render bookmark
    bookmarksView.render(model.state.bookmarks);

    // change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(() => {
      addRecipeView.toggleModal();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error.message);
  }
};

(function () {
  bookmarksView.addHandlerRender(BookmarksController);
  recipeView.addHandlerRender(RecipesController);
  recipeView.addHandlerUpdateServings(ServingsController);
  recipeView.addHandlerToggleBookmark(ToggleBookmarkController);
  searchView.addHandlerSearch(SearchResultsController);
  paginationView.addHandlerClick(PaginationController);
  addRecipeView.addHandlerUpload(AddRecipeController);
})();
