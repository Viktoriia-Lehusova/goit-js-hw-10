import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputSearch = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputSearch.addEventListener(
  'input',
  debounce(onSearchCountries, DEBOUNCE_DELAY)
);

function onSearchCountries(evt) {
  fetchCountries(evt.target.value.trim())
    .then(data => createMarkup(data))
    .catch(err => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
    });
}

function createMarkup(name) {
  const markup = name.map(
    ({ name: { common }, flags: { svg } }) =>
      `   <li>
        <h2 class="country_title">
        <img src="${svg}" alt="${name}" width = '80px'/>
        ${common}</h2>
      </li>`
  );
  const info = name.map(
    ({
      name: { common },
      capital,
      population,
      flags: { svg },
      languages,
    }) => `<div> 
    <div class="countryAtributes">
    <img src="${svg}" alt="${capital}" width = '80px' />
  <h2 class="country_title">  ${common}</h2> </div>
  <h3 class="country_subtitle">Capital: ${capital}</h3>
  <p class="country_text">Population: ${population}</p>
 <ul class="country_text">Languages: ${Object.values(languages)
   .map(el => `<li>${el}</li>`)
   .join(',')}</ul>
</div>`
  );
  if (name.length === 1) {
    countryInfo.innerHTML = info.join(' ');
    countryList.innerHTML = '';
  } else if (name.length > 1 && name.length <= 10) {
    countryList.innerHTML = markup.join(' ');
    countryInfo.innerHTML = '';
  }
  if (name.length > 10) {
    countryList.innerHTML = '';
    Notiflix.Notify.success(
      'Too many matches found. Please enter a more specific name.'
    );
  }
}
