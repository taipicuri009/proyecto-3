import {
    searchData,
    sortData,
    filterDataByDirectorProducer,
    filterDataBy,
    getDataFilterBy,
    getNamesDirectorProducer,
    counterData
} from './data.js';
import data from './data/ghibli/ghibli.js';

// Navegation
const menuBurguer = document.querySelector("#menuBurguer");
const menuDropdown = document.querySelector(".menu__dropdown");

// Home page
const searchFilms = document.querySelector('#searchFilm');
const filterByDirectorProducer = document.querySelector("#filterByDirectorProducer");
const sortBy = document.querySelector("#sortBy");
const orderData = document.querySelector("#orderData");
const filmsCounter = document.querySelector("#filmsCounter");
const filmsContainer = document.querySelector('.container__films');

// Film Page
const returnBack = document.querySelector(".container__returnBack");
const filmInformation = document.querySelector(".film__information");
const containerPeople = document.querySelector(".container__people");
const containerLocations = document.querySelector(".container__locations");
const containerVehicles = document.querySelector(".container__vehicle");

//Top ten page
const topTen = document.querySelector("#containerStatistics");

//Modal
const modalContainer = document.querySelector(".modalContainer");
const modal = document.querySelector(".modal");
const closeModal = document.querySelector("#close");
const modalContent = document.querySelector(".modalContent");

// Default variables
const allDataFilms = data.films;
const allCharacters = [];
const allLocations = [];
let pageReturn = 'home';
let dataFilms = data.films;
let sortOrder = 'asc';

const deleteChilds = (container) => {
  while(container.lastChild){
    container.removeChild(container.lastChild);
  }
}

const showDataFilms = (films) => {
  deleteChilds(filmsContainer);
  if(films.length === 0){
    const text = document.createTextNode("Film not found");
    filmsContainer.appendChild(text);
  }else{
    const sortedData = sortData(films, sortBy.value, sortOrder)
    sortedData.forEach(film => {
      // Show Films
      const container = document.createElement('section');
      container.classList.add('container__card');
      container.appendChild(cardTemplate(film));
      filmsContainer.appendChild(container);
      //Show page film
      container.addEventListener("click", () => {
        showFilmSections(film);
      });
    });
  }
  filmsCounter.innerHTML = `Showing ${films.length}`;
}

const showTopTen = () => {
  const sortedData = sortData(allDataFilms, 'rt_score', 'desc').slice(0, 10);
  sortedData.forEach(film => {
    // Show Films
    const container = document.createElement('section');
    container.classList.add('container__card');
    container.appendChild(cardTemplate(film));
    topTen.appendChild(container);
    //Show page film
    container.addEventListener("click", () => {
      showFilmSections(film);
    });
  });
}

const showFilmSections = ({people, locations, vehicles, ...information}) => {
  deleteChilds(containerPeople);
  deleteChilds(containerLocations);
  deleteChilds(containerVehicles);
  navigateTo('film');
  addFilmInformation(information);
  addFilmPeople(people);
  if(locations.length !== 0){
    containerLocations.classList.remove("disable");
    addFilmSection(locations, containerLocations, 'Locations');
  } else containerLocations.classList.add("disable");
  if(vehicles.length !== 0){
    containerVehicles.classList.remove("disable");
    addFilmSection(vehicles, containerVehicles, 'Vehicles');
  } else containerVehicles.classList.add("disable");
}

const cardTemplate = ({title, poster, name, img}) => {
  const template = document.getElementById("card").content,
  fragment = document.createDocumentFragment();
  template.querySelector("figcaption").textContent = (title||name);
  template.querySelector("img").setAttribute("src", (poster||img));
  template.querySelector("img").setAttribute("alt", (title||name));
  const clone = document.importNode(template, true);
  fragment.appendChild(clone);
  return fragment;
}

const addFilmInformation = (film) => {
  deleteChilds(filmInformation);
  filmInformation.innerHTML = `
    <section class='divison'>
      <h1 class='mainTitle'>${film.title}</h1>
      <section class='container__row'>
        <article class='container__text'>
          <div class="starEmpty">
            <div class="starFull" style='width:${film.rt_score}%'></div>
          </div>
          <p class='paragraph'>${film.rt_score}/100</p>
        </article>
        <article class='container__text'>
            <h3 class='subtitle'>Release date: </h3>
            <p class='paragraph'>${film.release_date}</p>
        </article>
      </section>
      <article class='container__description'>
        <p class='paragraph'>${film.description}</p>
      </article>
      <section class='container__row'>
        <article class='container__text'>
          <h3 class='subtitle'>Producer: </h3>
          <p class='paragraph'> ${film.producer}</p>
        </article>
        <article class='container__text'>
          <h3 class='subtitle'>Director: </h3>
          <p class='paragraph'> ${film.director}</p>
        </article>
      </section>
    </section>
    <section class='film__poster'>
      <img class="film__image" src='${film.poster}'loading='lazy'>
    </section>
  `;
}

const addFilmPeople = (people) => {
  // Default Varibles characters
  let characters = people;
  // Container
  containerPeople.innerHTML = `
    <section class="secondaryTitle">
      <h2 class="subtitle">Characters</h2>
    </section>
  `;
  // Menu Characters Bar
  const menuCharactersBar = document.createElement("section");
  menuCharactersBar.className = "menuBar";
  // Add filter character by species
  const containerFilterCharacterBySpecie = document.createElement("section");
  containerFilterCharacterBySpecie.className = "filter";
  const filterCharacterBySpecie = document.createElement("select");
  filterCharacterBySpecie.className = "filter__comboBox";
  filterCharacterBySpecie.innerHTML = `
  <option value="all" disabled selected>Specie</option>
  <option value="all">All</option>
  `;
  addFilterBy(filterCharacterBySpecie, people, "specie");
  containerFilterCharacterBySpecie.appendChild(filterCharacterBySpecie);
  //Add show counter
  const charactersCounter = document.createElement("section");
  charactersCounter.className = "menuBar__showing";
  charactersCounter.innerHTML = `Showing ${people.length}`;
  // Menu character bar
  const containerCharacters = document.createElement("section");
  menuCharactersBar.appendChild(containerFilterCharacterBySpecie);
  menuCharactersBar.appendChild(charactersCounter);
  // Container People
  containerPeople.appendChild(menuCharactersBar);
  containerPeople.appendChild(containerCharacters);
  //Mostrar Character
  showCharacters(containerCharacters, characters, charactersCounter);
  filterCharacterBySpecie.addEventListener("change", ()=>{
    characters = (filterCharacterBySpecie.value === 'all')? people: filterDataBy(people,'specie', filterCharacterBySpecie.value);
    showCharacters(containerCharacters, characters, charactersCounter);
  })
}

const addFilmSection = (data, containerFilmInformation, title) => {
  containerFilmInformation.innerHTML = `
        <section class="container__subtitle">
            <h2 class="subtitle">${title}</h2>
            <p class="showing">Showing ${data.length}</p>
        </section>
  `;
  const containerCards = document.createElement("section");
  containerFilmInformation.appendChild(containerCards);
  const sortedData = sortData(data, 'name', 'asc');
  // Show Data
  containerCards.classList.add('container__cards');
  sortedData.forEach(item => {
    const card = document.createElement('figure');
    card.setAttribute('class', 'container__card container__card-film');
    card.appendChild(cardTemplate(item));
    containerCards.appendChild(card);
    //Add new page
    card.addEventListener("click", ()=>{
      openFilmModal(item);
    });
  });
}

// Show characters
const showCharacters = (containerCharacters, characters, charactersCounter) => {
  deleteChilds(containerCharacters);
  const sortedCharacterData = sortData(characters, 'name', 'asc');
  // Show Data
  containerCharacters.classList.add('container__cards');
  sortedCharacterData.forEach(person => {
    const container = document.createElement('figure');
    container.setAttribute('class', 'container__card container__card-film');
    container.appendChild(cardTemplate(person));
    containerCharacters.appendChild(container);
    container.addEventListener('click', ()=>{
      openFilmModal(person);
    });
  });
  charactersCounter.innerHTML = `Showing ${characters.length}`;
}

const navigateTo = (idPage) => {
  document.querySelectorAll(".container").forEach(page => {
    (page.id == idPage)? page.classList.remove('disable') : page.classList.add('disable');
    window.scrollTo(0,0);
  });
};

const addFilterBy = (filter, data, condition = 'DirectorProducer') => {
  const conditionFiltered = (condition == 'DirectorProducer')? getNamesDirectorProducer(data): getDataFilterBy(data, condition);
  for (const item of conditionFiltered){
    const option = document.createElement("option");
    option.value = item;
    option.text = item;
    filter.appendChild(option);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  allDataFilms.forEach(item => {
    item.people.forEach(person => {
      allCharacters.push(person);
    });
  });
  allDataFilms.forEach(item => {
    item.locations.forEach(location => {
      allLocations.push(location);
    });
  });
  showDataFilms(allDataFilms);
  addFilterBy(filterByDirectorProducer, allDataFilms);
  showTopTen();
  addChart('gender', 'line', allCharacters);
  addChart('specie', 'line', allCharacters);
  addChart('climate', 'doughnut', allLocations);
  addChart('terrain', 'doughnut', allLocations);
});

//Menu Toggle navegation
menuBurguer.addEventListener("click", () => {
  menuBurguer.classList.toggle("fa-times");
  menuDropdown.classList.toggle("disable");
});

document.querySelectorAll(".menu__item").forEach((link) => {
  link.addEventListener("click",(e)=>{
    e.preventDefault();
    pageReturn = link.getAttribute("href").slice(1);
    navigateTo(pageReturn);
    menuBurguer.classList.toggle("fa-times");
    menuDropdown.classList.toggle("disable");
  });
});

returnBack.addEventListener("click", () => {
  navigateTo(pageReturn);
});

searchFilms.addEventListener('keyup', () => {
  dataFilms = searchData(allDataFilms, 'title', searchFilms.value);
  showDataFilms(dataFilms);
});

filterByDirectorProducer.addEventListener("change", () => {
  searchFilms.value = "";
  dataFilms = (filterByDirectorProducer.value === 'all')? allDataFilms : filterDataByDirectorProducer(allDataFilms,filterByDirectorProducer.value);
  showDataFilms(dataFilms);
});

sortBy.addEventListener("change", () => {
  showDataFilms(dataFilms);
});

orderData.addEventListener("click", () => {
  sortOrder = (orderData.classList.length === 3 ? 'asc' : 'desc');
  orderData.classList.toggle("fa-sort-amount-up-alt");
  showDataFilms(dataFilms);
});

/* Modal events*/
closeModal.addEventListener("click",()=>{
  closeFilmModal();
});

window.addEventListener("click",(e)=>{
  if(e.target == modalContainer){
    closeFilmModal();
  }
});

const closeFilmModal = () => {
  modal.classList.add("modalClose");
  setTimeout(()=>{
    modalContainer.classList.add("containerClose");
  }, 550);
}

const openFilmModal = (data) => {
  modalContainer.classList.remove("containerClose");
  modal.classList.remove("modalClose");
  deleteChilds(modalContent);
  const sectionName = document.createElement('h1');
  const sectionImage = document.createElement("section");
  sectionImage.setAttribute('class', 'divide');
  const sectionDetails = document.createElement("section");
  sectionDetails.setAttribute('class', 'divide');
  sectionName.setAttribute('class', 'mainTitle');
  sectionName.innerHTML = `${data['name']}`;
  const image = document.createElement('img');
  image.setAttribute('class', 'card__image');
  image.setAttribute('src', `${data['img']}`);
  sectionImage.appendChild(image);
  modalContent.appendChild(sectionName);
  modalContent.appendChild(sectionImage);
  modalContent.appendChild(sectionDetails);
  for(let key in data){
    if(data[key].length !== 0 && key !== 'id' && key !== 'img' && key !== 'name'){
      const sectionText = document.createElement('section');
      sectionText.setAttribute('class', 'container__text');
      const title = document.createElement('h3');
      title.setAttribute('class', 'subtitle');
      const paragraph = document.createElement('p');
      paragraph.setAttribute('class','paragraph');
      title.innerHTML = `${key}`;
      if(key !== 'residents' && key !== 'pilot'){
        paragraph.innerHTML = `${data[key]}`;
      }else{
        if(key === 'residents'){
          if(data[key] == 'TODO'){
            paragraph.innerHTML = 'All';
          }else {
            paragraph.innerHTML = data[key].map((item) => item['name']).join(",");
          }
        }else{
          paragraph.innerHTML = `${data[key]['name']}`;
        }
      }
      sectionText.appendChild(title);
      sectionText.appendChild(paragraph);
      sectionDetails.appendChild(sectionText);
    }
  }
}

const addChart = (title, typeChart, data) => {
  const graph = document.querySelector(`#${title}`).getContext('2d');
  const labelsChart = getDataFilterBy(data, title);
  const dataChart = counterData(data, title, labelsChart);
  const colors = ['#005580','#008ED2','#006596','#60B6DF','#1FA1E1','#00ADFF','#007DB9','#005077','#00354F',];
  //eslint-disable-next-line
  const chartGender = new Chart(graph, {
    type: `${typeChart}`,
    data: {
      labels: labelsChart,
      datasets: [{
        label: `Average of ${title}`,
        data: dataChart,
        backgroundColor: colors,
        borderColor: colors,
        color: '#fff',
        hoverOffset: 6
      }]
    },
    options: {
      indexAxis: 'y',
      maintainAspectRatio: false,
      layout: {
        padding: 3,
      },
      hoverRadius: 8,
    }
  });
}

