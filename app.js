// Your OpenWeatherMap API Key
const API_KEY = 'caf919bf727035bee8cf79e02938cd8f';  // Replace with your actual API key
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Function to fetch weather data using async/await
async function getWeather(city) {
    const weatherDisplay = document.getElementById('weather-display');
    // Show loading spinner
    weatherDisplay.innerHTML = '<div class="loading">Fetching weather data...</div>';

    try {
        const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;
        const response = await axios.get(url);
        displayWeather(response.data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        // Handle invalid city names or network issues
        weatherDisplay.innerHTML = `
            <p class="loading">❌ Could not fetch weather for "${city}". 
            Please check the city name and try again.</p>
        `;
    }
}

// Function to display weather data
function displayWeather(data) {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const weatherHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;

    document.getElementById('weather-display').innerHTML = weatherHTML;
}

// Event listener for search button
document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value.trim();
    if (city) {
        getWeather(city);
    } else {
        document.getElementById('weather-display').innerHTML =
            '<p class="loading">⚠️ Please enter a city name.</p>';
    }
});

// Default weather on page load
getWeather('London');