'use strict';
const navAncors = document.querySelector('.navbar-nav').children;

const todayHeader = document.querySelector('#todayHeader');
const tomorrowHeader = document.querySelector('#tomorrowHeader');
const dayAfterTomorrowHeader = document.querySelector(
  '#dayAfterTomorrowHeader'
);

const pElement = document.createElement('p');
const p2Element = document.createElement('p');
const p3Element = document.createElement('p');
const p4Element = document.createElement('p');
const p5Element = document.createElement('p');
const p6Element = document.createElement('p');
const p7Element = document.createElement('p');
const p8Element = document.createElement('p');
const imgElement = document.createElement('img');
const img2Element = document.createElement('img');
const img3Element = document.createElement('img');

const cityName = document.querySelector('#cityName');
const firstTemp = document.querySelector('#firstTemp');
const textFirst = document.querySelector('#textFirst');
const spanOne = document.querySelector('#spanOne');
const spanTwo = document.querySelector('#spanTwo');
const spanThree = document.querySelector('#spanThree');
const iconTomorrow = document.querySelector('#iconTomorrow');
const iconDayAfterTomorrow = document.querySelector('#iconDayAfterTomorrow');
const tomorrowContent = document.querySelector('#tomorrowContent');
const dayAfterTomorrowContent = document.querySelector(
  '#dayAfterTomorrowContent'
);

const searchInput = document.querySelector('#searchInput');

// header time definitions
const dayNameArr = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const monthNameArr = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const today = new Date();
const tomorrow = new Date(new Date().setDate(today.getDate() + 1));
const afterTomorrow = new Date(new Date().setDate(today.getDate() + 2));

pElement.textContent = dayNameArr[today.getDay()];
pElement.style.marginBottom = '0px';

todayHeader.append(pElement);
todayHeader.append(today.getDate() + ' ' + monthNameArr[today.getMonth()]);
tomorrowHeader.append(dayNameArr[tomorrow.getDay()]);
dayAfterTomorrowHeader.append(dayNameArr[afterTomorrow.getDay()]);


const apiKey = '9ef993ae12bb495aa26101107241304';

// Fetch weather data function
async function fetchWeatherData(lat, lon, days = 3) {
  const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=${days}`;
  try {
    const response = await fetch(url);
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

// Update weather function
async function updateWeather(lat, lon) {
  try {
    const weatherData = await fetchWeatherData(lat, lon);
    const currentWeather = weatherData.current;
    const location = weatherData.location;

    // Update DOM with current weather data
    cityName.textContent = location.name;
    firstTemp.textContent = p2Element.textContent = currentWeather.temp_c + '°C';
    imgElement.src = currentWeather.condition.icon;
    imgElement.alt = currentWeather.condition.text;
    imgElement.style.width = '100px';
    firstTemp.append(imgElement);
    textFirst.textContent = currentWeather.condition.text;
    // Update wind information
    const wind = {
      windDegree: currentWeather.wind_degree,
      windSpeed: currentWeather.wind_kph,
      windDirection: currentWeather.wind_dir,
    };
    spanOne.textContent = ' ' + wind.windDegree + '%';
    spanTwo.textContent = ' ' + Math.round(+wind.windSpeed) + ' km/h';
    if (wind.windDirection.startsWith('N')) {
      wind.windDirection = 'North';
    } else if (wind.windDirection.startsWith('S')) {
      wind.windDirection = 'South';
    } else if (wind.windDirection.startsWith('E')) {
      wind.windDirection = 'East';
    } else if (wind.windDirection.startsWith('W')) {
      wind.windDirection = 'West';
    }
    spanThree.textContent = ' ' + wind.windDirection;

    // Update forecast for the next two days
    const forecast = weatherData.forecast.forecastday.slice(1, 3);
    forecast.forEach(function(day, index) {
      const dayElement = index === 0 ? tomorrowContent : dayAfterTomorrowContent;
      const iconElement = index === 0 ? img2Element : img3Element;
      const maxTempElement = index === 0 ? p5Element : p6Element;
      const maxWindElement = index === 0 ? p7Element : p8Element;
      const conditionElement = index === 0 ? p3Element : p4Element;

      iconElement.src = day.day.condition.icon;
      if (index === 1 || index === 0) {
        iconElement.style.width = '76px';
      }
      dayElement.append(iconElement);

      maxTempElement.textContent = day.day.maxtemp_c + ' °C';
      dayElement.append(maxTempElement);

      maxWindElement.textContent = day.day.maxwind_mph + ' °';
      dayElement.append(maxWindElement);

      conditionElement.textContent = day.day.condition.text;
      dayElement.append(conditionElement);
    });
  } catch (error) {
    console.error('Error updating weather:', error);
  }
}

// Function to handle search input
async function handleSearchInput() {
  const searchedFor = searchInput.value.toLowerCase().trim();
  const response = await fetch(`http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${searchedFor}`);
  const searchData = await response.json();

  if (searchData.length > 0) {
    const { lat, lon } = searchData[0];
    await updateWeather(lat, lon);
  } else {
    console.error('No results found for the search query.');
  }
}

// Event listener for search input
searchInput.addEventListener('input', handleSearchInput);

// Function to get current location and update weather
async function updateWeatherWithCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        await updateWeather(lat, lon);
      },
      function (error) {
        console.error('Error getting current location:', error);
      }
    );
  } else {
    console.error('Geolocation not supported by this browser.');
  }
}


updateWeatherWithCurrentLocation();





async function searchFunc() {  
  const searchedFor = searchInput.value.toLowerCase().trim();
  const response = await fetch(`http://api.weatherapi.com/v1/search.json?key=9ef993ae12bb495aa26101107241304&q=${searchedFor}`);
    const data = await response.json();
    let singleData = data[0];
    const {lat, lon} = singleData; 
    await fetchWeatherData(lat, lon, 3);   
}

searchInput.addEventListener('input',searchFunc);



// change active
for (let i = 0; i < navAncors.length; i++) {
  navAncors[i].addEventListener('mouseover', function () {
    for (let j = 0; j < navAncors.length; j++) {
      navAncors[j].classList.remove('active');
    }
    navAncors[i].classList.add('active');
  });
}
