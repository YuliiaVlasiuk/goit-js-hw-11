import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

let page;
let totalCounts;
const count = 40;
const KEY = '32926611-8cada7c2f97f927ebc9aab067';
const BASE_URL =
  'https://pixabay.com/api/?image_type=photo&orientation=horizontal&safesearch=true';

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionsPositions: 'bottom',
  captionDelay: 250,
});

let inputSearch = document.querySelector('#search-form');
let gallery = document.querySelector('.gallery');
let buttonSearch = document.querySelector('.load-more');
buttonSearch.style.display = 'none';

inputSearch.addEventListener('submit', onSearching);

function onSearching(evt) {
  buttonSearch.style.display = 'none';
  evt.preventDefault();
  page = 1;
  valueSearching = evt.currentTarget.elements.searchQuery.value.trim();

  gallery.innerHTML = '';

  if (!valueSearching) {
    Notiflix.Notify.failure('Please, enter a search value!');
    return;
  }

  fetchPictures(valueSearching, page)
    .then(data => {
      totalCounts = data.totalHits;
      if (totalCounts === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      const arrayOfPictures = createMarkup(data.hits);
      gallery.insertAdjacentHTML('beforeend', arrayOfPictures);
      buttonSearch.style.display = 'block';
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
</a>`
    )
    .join('');
}

buttonSearch.addEventListener('click', onLoadMore);

function onLoadMore() {
  page += 1;
  fetchPictures(valueSearching, page)
    .then(data => {
      const arrayOfPictures = createMarkup(data.hits);
      gallery.insertAdjacentHTML('beforeend', arrayOfPictures);
    })
    .catch(err => {
      console.log(err.message);
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });

  if (page * count > totalCounts) {
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    buttonSearch.style.display = 'none';
    return;
  }
}

async function fetchPictures(name, page) {
  const response = await axios.get(
    `${BASE_URL}&key=${KEY}&q=${name}&per_page=${count}&page=${page}`
  );
  return await response.data;
}

Notiflix.Notify.init({
  position: 'right-top',
  width: '300px',
  distance: '10px',
  opacity: 1,
  rtl: false,
  timeout: 1000,
});