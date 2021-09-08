import { API_URL, KEY, RESULTS_PER_PAGE } from './config';
import { getJSON, sendJSON } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = data => {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async id => {
  try {
    const data = await getJSON(`${API_URL}/${id}`);

    state.recipe = createRecipeObject(data);

    state.recipe.bookmarked = state.bookmarks.some(
      bookmark => bookmark.id === id
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const loadSearchResults = async query => {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);

    state.search.results = data.data.recipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      image: recipe.image_url,
    }));
  } catch (error) {
    throw error;
  }
};

export const getSearchResultsPage = (page = state.search.page) => {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = newServings => {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = () => {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const clearBookmarks = () => {
  localStorage.clear('bookmarks');
};

export const toggleBookmark = () => {
  const { recipe, bookmarks } = state;
  if (!recipe.bookmarked) {
    bookmarks.push(recipe);
    recipe.bookmarked = true;
  } else {
    const index = bookmarks.findIndex(el => el.id === recipe.id);
    bookmarks.splice(index, 1);
    recipe.bookmarked = false;
  }

  persistBookmarks();
};

export const uploadRecipe = async newRecipe => {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArray = ing[1].replaceAll(' ', '').split(',');
        if (ingArray.length !== 3) {
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );
        }
        const [quantity, unit, description] = ingArray;
        return {
          quantity: quantity ? Number(quantity) : null,
          unit,
          description,
        };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    toggleBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};

(function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) {
    state.bookmarks = JSON.parse(storage);
  }
})();
