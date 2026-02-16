function SkyFetch(apiKey) {
  this.apiKey = apiKey;
  this.apiUrl = 'https://api.openweathermap.org/data/2.5/';
}

// Fetch both current weather and forecast
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

    this.saveSearch(city);
    this.renderRecentSearches();
  } catch (error) {
    weatherDisplay.innerHTML = `<p class="loading">❌ Could not fetch weather for "${city}". Please check the city name.</p>`;
  }
};

// Display current weather
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

// Display forecast
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

// Save searches in localStorage
SkyFetch.prototype.saveSearch = function(city) {
  let searches = JSON.parse(localStorage.getItem('skyfetch-searches')) || [];
  // Avoid duplicates
  searches = searches.filter(c => c.toLowerCase() !== city.toLowerCase());
  searches.unshift(city);
  // Keep only last 5
  searches = searches.slice(0, 5);
  localStorage.setItem('skyfetch-searches', JSON.stringify(searches));
};

// Render recent searches as clickable pills
SkyFetch.prototype.renderRecentSearches = function() {
  const container = document.getElementById('recent-searches');
  const searches = JSON.parse(localStorage.getItem('skyfetch-searches')) || [];
  container.innerHTML = '';
  searches.forEach(city => {
    const btn = document.createElement('button');
    btn.textContent = city;
    btn.addEventListener('click', () => this.getWeatherData(city));
    container.appendChild(btn);
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

// Auto-load last searched city
window.addEventListener('load', () => {
  const searches = JSON.parse(localStorage.getItem('skyfetch-searches')) || [];
  if (searches.length > 0) {
    app.getWeatherData(searches[0]);
  } else {
    app.getWeatherData('London');
  }
  app.renderRecentSearches();
});