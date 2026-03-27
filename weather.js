
const cityInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");
const apikey = "603f4794b90bde9a478a70a21bd0900f";
 
const notFoundsection = document.querySelector('.not-found');
const searchCitysection = document.querySelector('.search-city');
const weatherInfosection = document.querySelector('.weather-info');
const countryTxt = document.querySelector('.country-text');
const tempTxt = document.querySelector('.temp-text');
const conditionTxt = document.querySelector('.condition-text');
const humidityValueTxt = document.querySelector('.humidity-value-txt');
const windValueTxt = document.querySelector('.wind-value-txt');
const weatherSummaryImg = document.querySelector('.weather-summary-img');
const currentDateTxt = document.querySelector('.current-date-text');
const forecastItemsContainer = document.querySelector(".forecast-items-container")
searchBtn.addEventListener('click', () => {
    if(cityInput.value.trim() != "") {
       updateWeatherInfo(cityInput.value)
        cityInput.value = "";
        cityInput.blur();
    }
    
});
cityInput.addEventListener('keydown', (event) => {
    if(event.key == 'Enter' && cityInput.value.trim() != '')
   {
       updateWeatherInfo(cityInput.value)
        cityInput.value = "";
        cityInput.blur() ;
    }
});
async function getFetchData(endPoint, city){
     const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apikey}&units=metric`;
     const response = await fetch(apiUrl);
     return response.json()
} 
function getWeatherIcon(id){
    if (id <= 232) return 'thunderstorm.png';
    if (id <= 321) return 'drizzle.png';
    if (id <= 531) return 'rainy-day.png';
    if (id <= 622) return 'snow.png';
    if (id <= 781) return 'mist.png';
    if (id <= 800) return 'sun.png';
    if (id <= 801) return 'cloudy.png'; 
    if (id <= 804) return 'clouds.png'; 
}

function getCurrentDate() {
    const currentDate = new Date()
    const options = {
        weekday:'short',
        day:'2-digit', 
        month:'short'
    }
    return currentDate.toLocaleDateString('en-GB', options)
}
async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city)
    if(weatherData.cod != 200) {
     showDisplaySection(notFoundsection)
     return 
    }
     
    const {
        name:country,
        main:{ temp, humidity },
        weather: [{ id, main }],
        wind: { speed }
    } = weatherData;
    countryTxt.innerText = country;
    tempTxt.innerText = `${Math.round(temp)}°C`;
    conditionTxt.innerText = main;
    humidityValueTxt.innerText = `${humidity}%`;
    windValueTxt.innerText = speed + `m/s`;
    currentDateTxt.textContent = getCurrentDate()
    weatherSummaryImg.src = `images/${getWeatherIcon(id)}`;
    await updateForecastsInfo(city);
    showDisplaySection(weatherInfosection);
}
 async function updateForecastsInfo(city) {
    const forecastsData = await getFetchData('forecast', city)
    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]
    forecastItemsContainer.innerHTML='';
    forecastsData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)) {
  updateForecastsItems(forecastWeather)
        }
    })
}
function updateForecastsItems(weatherData) {
    const {
        dt_txt: date,
        main: { temp },
        weather: [{ id }]
    } = weatherData;
    const dateTaken = new Date(date);
    const dateOption = {
        day: '2-digit',
        month:'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)
    const forecastItem = `
    <div class="forecast-item">
        <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
        <img src="images/${getWeatherIcon(id)}" class="forecast-item-icon">
        <h5 class="forecast-item-temp">${Math.round(temp)}&deg;C</h5>
      </div> 
      `
      forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
}
 
function showDisplaySection(section){
    [weatherInfosection, searchCitysection, notFoundsection].forEach(section => section.style.display = 'none');
    section.style.display = 'flex';
}

