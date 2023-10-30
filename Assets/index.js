const key = '7c39afbaac786f040b10d144b6c2b843';//api key
const baseUrl = 'https://api.openweathermap.org';
const searchHistory = [];

const elements = {
    history: document.querySelector("#history"),
    searchBar: document.querySelector("#search-bar"),
    searchForm: document.querySelector("#search-form"),
    todayContainer: document.querySelector("#today"),
    forecastContainer: document.querySelector("#forecast")
};

// Function to display today's weather information
function displayTodaysWeather(city, weather) {
    const date = dayjs().format('(M/D/YYYY)');
    const icon = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
    const iconAlt = weather.weather[0].description;
    const temp = weather.main.temp;
    const wind = weather.wind.speed;
    const humid = weather.main.humidity;

    const container = document.createElement('div');
    const heading = document.createElement('h2');
    const iconElement = document.createElement('img');
    const tempElement = document.createElement('p');
    const windElement = document.createElement('p');
    const humidElement = document.createElement('p');

    // Adding classes and content to elements

    elements.todayContainer.innerHTML = ''; // Clear existing content
    elements.todayContainer.append(container);
}
