import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

let lightbox = new SimpleLightbox('.gallery a');


const KEY = "32926611-8cada7c2f97f927ebc9aab067"
const BASE_URL="https://pixabay.com/api/?image_type=photo&orientation=horizontal&safesearch=true"

let valueSearching = 'cat';

let inputSearch = document.querySelector('#search-form');
let gallery = document.querySelector('.gallery');
let buttonSearch = document.querySelector('.load-more');

inputSearch.addEventListener('submit', onSearching);
let page;
function onSearching(evt) {
  evt.preventDefault();
  page=1;
  valueSearching = evt.target.elements.searchQuery.value.trim();

  gallery.innerHTML = '';

  if (!valueSearching) {
    return;
  }

  fetchPictures(valueSearching,page)
    .then(data => {
  
    const arrayOfPictures = createMarkup(data.hits);
    gallery.insertAdjacentHTML('beforeend', arrayOfPictures);
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

 buttonSearch.addEventListener('click', onLoadMore)

 function onLoadMore(){
  page+=1;
  fetchPictures(valueSearching,page)
    .then(data => {
  
    const arrayOfPictures = createMarkup(data.hits);
    gallery.insertAdjacentHTML('beforeend', arrayOfPictures);
    })
    .catch(err => console.log(err));
}


 

function fetchPictures(name,page) {
  return fetch(`${BASE_URL}&key=${KEY}&q=${name}&per_page=40&page=${page}`).then(response => {
    if (!response.ok) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
    return response.json();
    
  });
}