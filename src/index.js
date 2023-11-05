import axios from "axios";
import Notiflix, { Notify } from "notiflix";

const input = document.querySelector('input[name="searchQuery"]');
// const subBtn = document.querySelector('button[type="submit"]');
const form = document.querySelector('.search-form');
const gallery =document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

let page = 1;
let per_page = 40;
let totalPages = 1;
let searchImg = '';

btnLoadMore.style.display = 'none';

async function getApi(searchImg, page, perPage) {
    const URL = 'https://pixabay.com/api/';
    const API_KEY = "40376854-8dce2a421219bab32f4b26962";

    try {
      const response = await axios.get(
        `${URL}?key=${API_KEY}&q=${searchImg}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`);
        // console.log(response.data);
      return response.data;
      
    } catch (error) {
        // console.log(error)
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
    
  }
  
 
input.addEventListener('submit', pressSearch);

async function pressSearch(e){
    e.preventDefault();
     searchImg = input.value;
    input.value = '';
    page = 1;
    gallery.innerHTML= '';
    try {
        const data = await getApi(searchImg, page, per_page);
        const images = data.hits;
        const markup = createMarkup(images);
        gallery.insertAdjacentHTML('beforeend', markup);
        totalPages = Math.ceil(data.totalHits / per_page);
        if(images.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        } else if (images.length < per_page){
            btnLoadMore.style.display = 'none';
        } else {
            btnLoadMore.style.display = 'block';
        }

    }catch (error) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again');
    }
}
 function createMarkup(images){
    return images.map(
        ({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) =>
        `<div class="photo-card">
        <a href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
    <div class="info">
      <p class="info-item">
        <b>Likes:${likes}</b>
      </p>
      <p class="info-item">
        <b>Views:${views}</b>
      </p>
      <p class="info-item">
        <b>Comments:${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads:${downloads}</b>
      </p>
    </div>
  </div>`).join('');
}


async function loadMore() {
    page += 1;
//    searchImg = input.value;
  
    try {
      const data = await getApi(searchImg, page, per_page);
      const images = data.hits;
      const markup = createMarkup(images);
      gallery.insertAdjacentHTML('beforeend', markup);
      if (page >= totalPages) {
        btnLoadMore.style.display = 'none';
      }
    } catch (error) {
      // Обробка помилок API-запиту
    }
  }
  
  btnLoadMore.addEventListener('click', loadMore);
  form.addEventListener('submit', pressSearch);

