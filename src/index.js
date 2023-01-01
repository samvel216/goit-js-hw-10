import './css/styles.css';
const DEBOUNCE_DELAY = 300;
import Notiflix from 'notiflix';
const debounce = require('lodash.debounce');
const inputSearchBoxEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const getMassiveLanguages = (countrLanguages, massiveLanguages) => {
    for(let language in countrLanguages) {
        massiveLanguages.push(countrLanguages[language]);
    }
    return massiveLanguages;
    }
const getFetchResponse = (countryName) =>  {
    return  fetch(`https://restcountries.com/v3.1/name/${countryName}`)
    .then(response => {
    if (!response.ok) {
    throw new Error(response.status);
    }
    return response.json();
    })}
const getFlagAndName = (country) => {
    const markup = country.map((countr) => {  
        return `<li class="country-markup">
        <div class="div"> 
        <img src="${countr.flags.svg}" width="50" height="30" alt="Флаг ${countr.name.official}" />
        <h2 class="country-name-small">${countr.name.official}<h2>
        </div>`;
      }).join("");
      countryListEl.innerHTML = markup;
}
const getFullCard = (country) => {
    let massiveLanguages = [];
    const markup = country.map((countr) => {  
  return `<li class="country-markup">
  <div class="div"> 
  <img src="${countr.flags.svg}" width="50" height="30" alt="Флаг ${countr.name.official}" />
  <h2 class="country-name">${countr.name.official}<h2>
  </div>
      <p class="country-capital"><b class="country-capital-b">Capital</b>: ${countr.capital}</p>
      <p class="country-population"><b class="country-population-b">Population</b>: ${countr.population}</p>
      <p class="country-languages"><b class="country-languages-b">Languages</b>: ${getMassiveLanguages(countr.languages,massiveLanguages)}</p>
    </li>`;
})
.join("");
countryListEl.innerHTML = markup;
}
const removeLi = () => {
    const cardLiEl = document.querySelector("li");
    cardLiEl.remove();
}
const removeAllLi = (cardLiAllEl) => {
    for (let cardLi of cardLiAllEl) {
        cardLi.remove();  
     }
}
const getCard = (countryName) => {  
    getFetchResponse(countryName).then(country => {
    let countryKeysLength = Object.keys(country).length;
    if (countryKeysLength > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    } else if (countryKeysLength >= 2 && countryKeysLength <= 10) {
        getFlagAndName(country);
    } else if (countryKeysLength === 1) {
        getFullCard(country);
    }
    }    
    ).catch(error => {
       if (error) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        const cardLiAllEl = document.querySelectorAll("li");
        removeAllLi(cardLiAllEl);
       }
    })   
}
const throttledd = debounce(getCard, DEBOUNCE_DELAY);
let i = 0;
const inputOnGetCard = (event) => {
    event.preventDefault();
    i++;
    let countryName = event.currentTarget.value;
    if (countryName.length > 1) {
        throttledd(countryName);
    } else if (i > 0 && countryName.length < 1) {
     const cardLiAllEl = document.querySelectorAll("li");
     if (cardLiAllEl.length === 1 ) {
        removeLi();
     }
     removeAllLi(cardLiAllEl);
    }
}
inputSearchBoxEl.addEventListener('input', inputOnGetCard);
