const apiKey = "57ce28e8d2a346925faddc0bcd183c0c";
const body = document.querySelector("body");
const getLocationBtn = document.querySelector('.get-location');
const getWeatherByLocatioBtn = document.querySelector(".get-device");
const notifLabel = document.querySelector("#notif-label");

const renderError = (error) => {
    notifLabel.className = "error-msg notif-red";
    notifLabel.innerText = error;
}

const renderLoading = (msg) => {
    notifLabel.className = "loading-label notif-green";
    notifLabel.innerText = msg;
}

const regionNames = new Intl.DisplayNames(['EN'], { type: 'region' }); //getting region name of any country in english

const countryOf = (countryCode) => {
    return regionNames.of(countryCode);
}

const renderWeather = (data) => {
    let humidity = data.main.humidity;
    let temp = Math.round((data.main.temp) - 273);
    let feelsLike = Math.round((data.main.feels_like) - 273);
    let mainDescription = data.weather[0].main;
    let fullDescription = data.weather[0].description;
    let location = data.name + "/" + countryOf(data.sys.country);
    //still not finished
    body.innerHTML = `   <div class="wrapper2">
    <div class="header">Weather App</div>
    <img src="./icons/${fullDescription}.png" alt="" srcset="" class="description-img">
    <div class="temperature">
        <span class="temperature-numb">${temp}</span>
        <span class="temperature-deg">°</span>
        <span class="temperature-systeme">C</span>
    </div>
    <div class="description-txt">${mainDescription}</div>
    <div class="location">${location}</div>
    <div class="footer">
        <span class="feels-like"> 
            ${feelsLike}°C
            <br>
            Feels like
            
        </span>
        <span class="humididty">
            ${humidity}%
            <br>
            Humididty
        </span></div>
</div>
`;
}

async function getWeather(lat, lon) {
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    let response = await fetch(url).catch(err => renderError(err));
    let data = await response.json();
    return data;
}

async function getCordination(cityName) {

    let url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
    let response = await fetch(url).catch(err => renderError("Can't get your city cordinations!"));
    let data = await response.json();
    return [data[0].lat, data[0].lon];
}

async function showWeather(data) {
    let lat = data.coords.latitude;
    let lon = data.coords.longitude;
    renderLoading("Getting weather...");
    let weatherData = await getWeather(lat, lon);
    renderWeather(weatherData);
}


// here start the event listeners
window.addEventListener('keypress', async function(event) {
    if (event.key == "Enter") {
        let city = document.querySelector('.city-name').value;
        renderLoading("Getting weather...");
        let [lat, lon] = await getCordination(city).catch(err => renderError("Can't get your city cordinations!"));
        let weatherData = await getWeather(lat, lon).catch(err => renderError("Can't get your city weather!"));
        if (lat && lon && weatherData) {
            renderWeather(weatherData);
        }
    }
})

getLocationBtn.addEventListener("click", async function() {

    let city = document.querySelector('.city-name').value;
    renderLoading("Getting weather...");
    let [lat, lon] = await getCordination(city).catch(err => renderError("Can't get your city cordinations!"));
    let weatherData = await getWeather(lat, lon).catch(err => renderError("Can't get yout city weather!"));
    if (lat && lon && weatherData) {
        renderWeather(weatherData);
    }
});

getWeatherByLocatioBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showWeather);

    } else {
        renderError("your browser dosen't support geolocation");
    }
})