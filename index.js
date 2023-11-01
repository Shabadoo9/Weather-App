const key = '7c39afbaac786f040b10d144b6c2b843';//api key
const baseUrl = 'https://api.openweathermap.org';
let searchHistory = [];

const select = (selector) => document.querySelector(selector);

const elements = {
    history: select("#history"),
    searchBar: select("#search-bar"),
    searchForm: select("#search-form"),
    todayContainer: select("#today"),
    forecastContainer: select("#forecast")
};

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

const createEl = (tag, className) => {
    const el = document.createElement(tag);
    el.setAttribute('class', className);
    return el;
};

const appendChildren = (parent, children) => {
    children.forEach(child => parent.append(child));
};

function getTodaysWeather(city, weather) {
    const { weather: [{ icon, description }], main: { temp, humidity }, wind } = weather;
    const date = dayjs().format('(M/D/YYYY)');
    const iconElement = createEl('img', 'weatherText');
    const heading = createEl('h2', 'dayHead');
    const tempElement = createEl('p', 'weatherText');
    const windElement = createEl('p', 'weatherText');
    const humidElement = createEl('p', 'weatherText');

    heading.textContent = `${city} ${date}`;
    iconElement.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
    iconElement.setAttribute('alt', description);
    tempElement.textContent = `Temp: ${temp}°F`;
    windElement.textContent = `Wind: ${wind.speed} MPH`;
    humidElement.textContent = `Humidity: ${humidity} %`;

    elements.todayContainer.innerHTML = '';
    appendChildren(elements.todayContainer, [heading, iconElement, tempElement, windElement, humidElement]);
}

const forecastContainerElement = document.querySelector("#forecast");

function makeCard(forecast) {
    const { weather: [{ icon, description }], main: { temp, humidity }, wind } = forecast;
    const column = createEl('div', 'col-md forecast-card');
    const cardHead = createEl('h4', 'forehead');
    const elements = [
        createEl('img', 'foretext'),
        createEl('p', 'foretext'),
        createEl('p', 'foretext'),
        createEl('p', 'foretext')
    ];

    cardHead.textContent = dayjs(forecast.dt_txt).format("M/D/YYYY");
    elements[0].setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
    elements[0].setAttribute('alt', description);
    elements[1].textContent = `Temp: ${temp}°F`;
    elements[2].textContent = `Wind: ${wind.speed} MPH`;
    elements[3].textContent = `Humidity: ${humidity} %`;

    appendChildren(column, [cardHead, ...elements]);

    forecastContainerElement.append(column);
}

function getForecast(forecast) {
    const start = dayjs().add(1, 'day').startOf('day').unix();
    const end = dayjs().add(6, 'day').startOf('day').unix();
    const container = createEl('div', 'col-12');
    const heading = createEl('h3', 'dayHead');

    heading.textContent = '5-Day Forecast:';
    container.append(heading);

    elements.forecastContainer.innerHTML = '';
    elements.forecastContainer.append(container);

    forecast.forEach(item => {
        if (item.dt >= start && item.dt < end && item.dt_txt.slice(11, 13) === "12") {
            makeCard(item);
        }
    });
}

function displayHistory() {
    elements.history.innerHTML = '';

    searchHistory.slice().reverse().forEach(city => {
        const btn = createEl('button', 'history-btn');
        btn.setAttribute('type', 'button');
        btn.setAttribute('data-city', city);
        btn.textContent = city;
        elements.history.append(btn);
    });
}

function addHistory(cityInput) {
    if (!searchHistory.includes(cityInput)) {
        searchHistory.push(cityInput);
        localStorage.setItem('history', JSON.stringify(searchHistory));
        displayHistory();
    }
}

function startupHistory() {
    const rememberedHistory = localStorage.getItem('history');
    if (rememberedHistory) {
        searchHistory = JSON.parse(rememberedHistory);
    }
    displayHistory();
}

function getWeather(cityInput) {
    const { lat, lon, name } = cityInput;
    const url = `${baseUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            getTodaysWeather(name, data.list[0]);
            getForecast(data.list);
        })
        .catch(error => console.error(error));
}

function getCoordinates(cityInput) {
    const url = `${baseUrl}/geo/1.0/direct?q=${cityInput}&limit=5&appid=${key}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data[0]) {
                alert('Not Found');
            } else {
                addHistory(cityInput);
                getWeather(data[0]);
            }
        })
        .catch(error => console.error(error));
}

function handleSearchButton(event) {
    if (!elements.searchBar.value.trim()) {
        return;
    }

    event.preventDefault();
    getCoordinates(elements.searchBar.value);
    elements.searchBar.value = '';
}

function handleHistoryButton(event) {
    if (!event.target.matches('.history-btn')) {
        return;
    }

    const city = event.target.getAttribute('data-city');
    getCoordinates(city);
}

elements.searchForm.addEventListener("submit", handleSearchButton);
elements.history.addEventListener("click", handleHistoryButton);
startupHistory();