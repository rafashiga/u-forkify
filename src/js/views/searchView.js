class SearchView {
  _parentElment = document.querySelector('.search');

  getQuery() {
    return this._parentElment.querySelector('.search__field').value;
  }

  _clearInput() {
    this._parentElment.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._parentElment.addEventListener('submit', ev => {
      ev.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
