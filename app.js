function SkyFetch(apiKey) {
  this.apiKey = apiKey;
  this.apiUrl = 'https://api.openweathermap.org/data/2.5/';
}

SkyFetch.prototype.getWeatherData = async function(city) {
  const weatherDisplay = document.getElementById('weather-display');
  const forecastDisplay = document.getElementById('forecast-display');
  weatherDisplay.innerHTML = '<div class="loading">Fetching weather data...</div>';
  forecastDisplay.innerHTML = '';

  try {
    const currentUrl = `${this.apiUrl}weather?q=${city}&appid=${this.apiKey}&units=metric`;
    const forecastUrl = `${this.apiUrl}forecast?q=${city}&appid=${this.apiKey}&units=metric`;

    const [currentRes, forecastRes] = await Promise.all([
      axios.get(currentUrl),
      axios.get(forecastUrl)
    ]);

    this.displayCurrentWeather(currentRes.data);
    this.displayForecast(forecastRes.data);
  } catch (error) {
    weatherDisplay.innerHTML = `<p class="loading">❌ Could not fetch weather for "${city}". Please check the city name.</p>`;
  }
};

SkyFetch.prototype.displayCurrentWeather = function(data) {
  const cityName = data.name;
  const temperature = Math.round(data.main.temp);
  const description = data.weather[0].description;
  const icon = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  const html = `
    <div class="weather-info">
      <h2 class="city-name">${cityName}</h2>
      <img src="${iconUrl}" alt="${description}" class="weather-icon">
      <div class="temperature">${temperature}°C</div>
      <p class="description">${description}</p>
    </div>
  `;
  document.getElementById('weather-display').innerHTML = html;
};

SkyFetch.prototype.displayForecast = function(data) {
  const forecastDisplay = document.getElementById('forecast-display');
  forecastDisplay.innerHTML = '';

  const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  daily.forEach(day => {
    const date = new Date(day.dt_txt).toLocaleDateString(undefined, {
      weekday: 'short', month: 'short', day: 'numeric'
    });
    const temp = Math.round(day.main.temp);
    const description = day.weather[0].description;
    const icon = day.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const card = `
      <div class="forecast-card">
        <h3>${date}</h3>
        <img src="${iconUrl}" alt="${description}">
        <p>${temp}°C</p>
        <p>${description}</p>
      </div>
    `;
    forecastDisplay.innerHTML += card;
  });
};

// Initialize app
const app = new SkyFetch('caf919bf727035bee8cf79e02938cd8f'); // Replace with your actual API key

document.getElementById('search-btn').addEventListener('click', () => {
  const city = document.getElementById('city-input').value.trim();
  if (city) {
    app.getWeatherData(city);
  } else {
    document.getElementById('weather-display').innerHTML =
      '<p class="loading">⚠️ Please enter a city name.</p>';
  }
});

// Default city on load
app.getWeatherData('London');