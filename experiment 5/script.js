
const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const statusText = document.getElementById("status");
const result = document.getElementById("weather-result");

const cityName = document.getElementById("city-name");
const weatherIcon = document.getElementById("weather-icon");
const condition = document.getElementById("condition");
const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const updatedTime = document.getElementById("updated-time");

// Convert weather codes into descriptions and icons.
function getWeatherInfo(code) {
    const weatherTypes = {
        0: ["Clear sky", "☀️"],
        1: ["Mainly clear", "🌤️"],
        2: ["Partly cloudy", "⛅"],
        3: ["Overcast", "☁️"],
        45: ["Fog", "🌫️"],
        48: ["Depositing rime fog", "🌫️"],
        51: ["Light drizzle", "🌦️"],
        53: ["Moderate drizzle", "🌦️"],
        55: ["Dense drizzle", "🌧️"],
        56: ["Light freezing drizzle", "🌧️"],
        57: ["Dense freezing drizzle", "🌧️"],
        61: ["Slight rain", "🌧️"],
        63: ["Moderate rain", "🌧️"],
        65: ["Heavy rain", "🌧️"],
        66: ["Light freezing rain", "🌧️"],
        67: ["Heavy freezing rain", "🌧️"],
        71: ["Slight snowfall", "🌨️"],
        73: ["Moderate snowfall", "🌨️"],
        75: ["Heavy snowfall", "❄️"],
        77: ["Snow grains", "❄️"],
        80: ["Slight rain showers", "🌦️"],
        81: ["Moderate rain showers", "🌧️"],
        82: ["Violent rain showers", "⛈️"],
        85: ["Slight snow showers", "🌨️"],
        86: ["Heavy snow showers", "❄️"],
        95: ["Thunderstorm", "⛈️"],
        96: ["Thunderstorm with slight hail", "⛈️"],
        99: ["Thunderstorm with heavy hail", "⛈️"]
    };

    return weatherTypes[code] || ["Unknown conditions", "🌡️"];
}

// Fetch city coordinates using the Geocoding API.
async function getCityCoordinates(city) {
    const url = new URL("https://geocoding-api.open-meteo.com/v1/search");

    url.search = new URLSearchParams({
        name: city,
        count: "1",
        language: "en",
        format: "json"
    });

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to search for this city.");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error("City not found. Please check the spelling.");
    }

    return data.results[0];
}

// Fetch current weather using latitude and longitude.
async function getWeather(latitude, longitude) {
    const url = new URL("https://api.open-meteo.com/v1/forecast");

    url.search = new URLSearchParams({
        latitude: latitude,
        longitude: longitude,
        current: [
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "weather_code",
            "wind_speed_10m"
        ].join(","),
        timezone: "auto"
    });

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to fetch weather data. Try again.");
    }

    const data = await response.json();

    if (!data.current) {
        throw new Error("Weather data is unavailable for this location.");
    }

    return data;
}

// Display fetched weather on the webpage.
function displayWeather(location, data) {
    const current = data.current;
    const info = getWeatherInfo(current.weather_code);

    const placeDetails = [
        location.name,
        location.admin1,
        location.country
    ].filter(Boolean);

    cityName.textContent = [...new Set(placeDetails)].join(", ");
    weatherIcon.textContent = info[1];
    condition.textContent = info[0];

    temperature.textContent =
        `${Math.round(current.temperature_2m)}°C`;

    feelsLike.textContent =
        `Feels like ${Math.round(current.apparent_temperature)}°C`;

    humidity.textContent =
        `${current.relative_humidity_2m}%`;

    wind.textContent =
        `${current.wind_speed_10m} km/h`;

    updatedTime.textContent =
        `Local observation time: ${current.time.replace("T", " ")}`;

    result.hidden = false;
}

// Handle form submission.
form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        statusText.textContent = "Please enter a city name.";
        return;
    }

    searchBtn.disabled = true;
    searchBtn.textContent = "Loading...";
    statusText.textContent = "Fetching weather data...";
    result.hidden = true;

    try {
        const location = await getCityCoordinates(city);

        const data = await getWeather(
            location.latitude,
            location.longitude
        );

        displayWeather(location, data);
        statusText.textContent = "Weather updated successfully.";
    } catch (error) {
        statusText.textContent =
            error.message || "Something went wrong. Please try again.";

        result.hidden = true;
    } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = "Search";
    }
});
