import View from './View';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _modal = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();

    this._addHandlerShowModal();
    this._addHandlerHideModal();
  }

  toggleModal() {
    this._overlay.classList.toggle('hidden');
    this._modal.classList.toggle('hidden');
  }

  _addHandlerShowModal() {
    this._btnOpen.addEventListener('click', this.toggleModal.bind(this));
  }

  _addHandlerHideModal() {
    this._btnClose.addEventListener('click', this.toggleModal.bind(this));
    this._overlay.addEventListener('click', this.toggleModal.bind(this));
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
