import './css/styles.css';
import Notiflix from 'notiflix';

// Описан в документации
import SimpleLightbox from "simplelightbox";
// Дополнительный импорт стилей
import "simplelightbox/dist/simple-lightbox.min.css";

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const KEY = "32926611-8cada7c2f97f927ebc9aab067"
const BASE_URL="https://pixabay.com/api/?image_type=photo&orientation=horizontal&safesearch=true"

function fetchPictures(name) {
  return fetch(`${BASE_URL}&key=${KEY}&q=${name}&per_page=30`).then(response => {
    if (!response.ok) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
    return response.json();
  });
}

let valueSearching = 'cat';



let inputSearch = document.querySelector('#search-form');
let gallery = document.querySelector('.gallery');

inputSearch.addEventListener('submit', onSearching);

function onSearching(evt) {
  evt.preventDefault();
  // valueSearching = evt.target.elements.searchQuery.value.trim();

  gallery.innerHTML = '';

  if (!valueSearching) {
    return;
  }

  fetchPictures(valueSearching)
    .then(data => {
      gallery.innerHTML=createMarkup(data.hits);
    })
    .catch(err => console.log(err));
}

function createMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<a class="gallery__item" href="${largeImageURL}">
                       
<div class="photo-card">
  <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>  
</a>`).join('');
 
}
