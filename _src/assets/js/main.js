'use strict';

const urlBase = 'http://api.tvmaze.com/search/shows?q=';
const defaultImage = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV%20SHOW';
const list = document.querySelector('.series__list');
const input = document.querySelector('.input--serie');
const button = document.querySelector('.btn');

//Array to save favorites shows
let myFavs = [];

//function so we can use enter to valid the value
function preshEnter(event) {
  if (event.keyCode === 13) {
    getName();
  }
}

function getName() {
  const name = input.value.replace(/\s+/gi, '-'); //to put - instead of spaces
  const endpoint = urlBase + name;
  list.innerHTML = '';

  fetch(endpoint)
    .then(response => response.json())
    .then(data => getShow(data));
}

//Function to add a default photo if there is no one in the array for the show
function getImage(array, i) {
  if (array[i].show.image === null) {
    return defaultImage;
  }
  else {
    return array[i].show.image.medium || array[i].show.image.original;
  }
}

//Function to save faves in an array
function saveFavs (event) {
  const currentLi = event.currentTarget;
  const picShow = currentLi.querySelector('.show--image').src;
  const nameShow = currentLi.querySelector('.show--title').innerHTML;
  const idShow = currentLi.getAttribute('data-id');
  currentLi.classList.toggle('faveShow');
  const faveShowSaved = {'id': idShow, 'pic': picShow, 'name': nameShow};

  if (currentLi.classList.contains('faveShow') === true){
    let favShows = myFavs.find(faveShowSaved => faveShowSaved.id === idShow);
    if (favShows === undefined) {
      myFavs.push(faveShowSaved);
    } else {
      const index = myFavs.indexOf(faveShowSaved);
      if (index > -1) {
        myFavs.splice(index, 1);
      }
    }
  } else {
    myFavs = [];
    myFavs.push(faveShowSaved);
  }
    console.log(myFavs);

}

//Function to click on any li and got it selected as fave
function markFavs() {
  const showLi = document.querySelectorAll('.show--li');

  for (const item of showLi) {
    item.addEventListener('click', saveFavs);
  }
}

function getShow (array){

  for (let i = 0; i < array.length; i++) {
    const show = document.createElement('li');
    show.setAttribute('data-id', array[i].show.id);
    show.classList.add('show--li');
    const image = document.createElement('img');
    image.classList.add('show--image');
    const title = document.createElement('h2');
    title.classList.add('show--title');
    const titleContent = document.createTextNode(array[i].show.name);
    title.appendChild(titleContent);
    show.appendChild(title);

    image.src= getImage(array, i);
    image.alt = array[i].show.name;
    show.appendChild(image);
    list.appendChild(show);
  }
  markFavs();
}

button.addEventListener('click', getName);
input.addEventListener('keydown', preshEnter);
