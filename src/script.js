// Format Date
function formatDate(date) {
    let hours = date.getHours().toString().padStart(2, "0");
    let minutes = date.getMinutes().toString().padStart(2, "0");
  
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = days[date.getDay()];
  
    return `${day} ${hours}:${minutes}`;
  }
  
let units = 'celsius';
const weatherApp = {
  init() {
    this.loadingSpinner = document.getElementById('loading-spinner');
    this.errorMessage = document.getElementById('error-message');
    this.weatherContainer = document.querySelector('.weather-app');
    
    // Add event listeners
    document.getElementById('current-location').addEventListener('click', () => this.getCurrentLocation());
    document.getElementById('unit-toggle').addEventListener('click', () => this.toggleUnits());
    
    // Setup autocomplete
    this.setupAutocomplete();
  },

  showLoading() {
    this.loadingSpinner.classList.remove('d-none');
    this.weatherContainer.classList.add('loading-active');
  },

  hideLoading() {
    this.loadingSpinner.classList.add('d-none');
    this.weatherContainer.classList.remove('loading-active');
  },

  showError(message) {
    this.errorMessage.textContent = message;
    this.errorMessage.classList.remove('d-none');
    setTimeout(() => {
      this.errorMessage.classList.add('d-none');
    }, 3000);
  },

  getCurrentLocation() {
    const loadingSpinner = document.querySelector("#loading-spinner");
    loadingSpinner.classList.remove("d-none");

    const apiKey = "YOUR_API_KEY"; // Make sure to replace with your actual API key

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        ).then((response) => {
          this.displayWeather(response.data);
          loadingSpinner.classList.add("d-none");
        }).catch((error) => {
          loadingSpinner.classList.add("d-none");
          alert("Weather data unavailable. Please try again!");
        });
      });
    } else {
      loadingSpinner.classList.add("d-none");
      alert("Geolocation is not supported by your browser");
    }
  },

  displayWeather(response) {
    document.querySelector("#current-city").innerHTML = response.name;
    document.querySelector("#current-temperature").innerHTML = Math.round(
      response.main.temp
    );
    document.querySelector(
      "#current-details"
    ).innerHTML = `Humidity: ${response.main.humidity}% | Wind: ${Math.round(
      response.wind.speed
    )} km/h | ${response.weather[0].description}`;
  },
    toggleUnits() {
      const temperatureElement = document.querySelector("#current-temperature");
      const unitSymbol = document.querySelector(".fs-4");
      const unitButton = document.getElementById('unit-toggle');
    
      if (unitSymbol.textContent === "°C") {
        const celsiusTemp = Number(temperatureElement.textContent);
        const fahrenheitTemp = (celsiusTemp * 9/5) + 32;
        temperatureElement.textContent = Math.round(fahrenheitTemp);
        unitSymbol.textContent = "°F";
        unitButton.textContent = "Switch to °C";
      } else {
        const fahrenheitTemp = Number(temperatureElement.textContent);
        const celsiusTemp = (fahrenheitTemp - 32) * 5/9;
        temperatureElement.textContent = Math.round(celsiusTemp);
        unitSymbol.textContent = "°C";
        unitButton.textContent = "Switch to °F";
      }
    },
  setupAutocomplete() {
    const searchInput = document.getElementById('search-input');
    const autocompleteContainer = document.createElement('div');
    autocompleteContainer.className = 'city-autocomplete d-none';
    searchInput.parentNode.appendChild(autocompleteContainer);

    searchInput.addEventListener('input', async (e) => {
      const query = e.target.value;
      if (query.length < 3) {
        autocompleteContainer.classList.add('d-none');
        return;
      }

      try {
        // Replace with your actual API endpoint for city suggestions
        const response = await axios.get(`YOUR_AUTOCOMPLETE_API_ENDPOINT?q=${query}`);
        const cities = response.data.slice(0, 5);
        
        autocompleteContainer.innerHTML = cities
          .map(city => `<div class="city-suggestion">${city.name}</div>`)
          .join('');
        
        autocompleteContainer.classList.remove('d-none');
      } catch (error) {
        console.error('Autocomplete error:', error);
      }
    });

    // Handle suggestion clicks
    autocompleteContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('city-suggestion')) {
        searchInput.value = e.target.textContent;
        autocompleteContainer.classList.add('d-none');
        // Trigger weather search for selected city
        this.searchWeather(searchInput.value);
      }
    });
  }
};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => weatherApp.init());

// Display Temperature and Animation
function displayTemperature(response) {
  let cityElement = document.querySelector("#current-city");
  let temperatureElement = document.querySelector("#current-temperature");
  let detailsElement = document.querySelector("#current-details");
  let animationContainer = document.querySelector("#weather-animation");

  let temperature = Math.round(response.data.main.temp);
  let city = response.data.name;
  let weatherDescription = response.data.weather[0].description;
  let humidity = response.data.main.humidity;
  let windSpeed = response.data.wind.speed;
  let weatherMain = response.data.weather[0].main.toLowerCase();

  // Update Weather Details
  cityElement.innerHTML = city;
  temperatureElement.innerHTML = temperature;
  detailsElement.innerHTML = `
    ${weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1)}<br />
    Humidity: <strong>${humidity}%</strong>, Wind: <strong>${windSpeed} km/h</strong>
  `;

  // Load Appropriate Animation
  animationContainer.innerHTML = "";
  if (weatherMain.includes("clear")) {
    animationContainer.innerHTML = `<dotlottie-player src="https://lottie.host/9482a99c-aab9-4156-b674-f7834fe7f411/eGQk9Wd6jH.lottie" background="transparent" speed="1" style="width: 300px; height: 300px" loop autoplay></dotlottie-player>`;
  } else if (weatherMain.includes("rain")) {
    animationContainer.innerHTML = `<dotlottie-player src="https://lottie.host/6da3dac0-8895-4e7f-b642-52148893a665/AbVDM0Osgt.lottie" background="transparent" speed="1" style="width: 300px; height: 300px" loop autoplay></dotlottie-player>`;
  } else if (weatherMain.includes("cloud")) {
    animationContainer.innerHTML = `<dotlottie-player src="https://lottie.host/6e587795-6eac-4141-96f9-d0dce3eede57/nN0ZoDBMfK.lottie" background="transparent" speed="1" style="width: 300px; height: 300px" loop autoplay></dotlottie-player>`;
  } else if (weatherMain.includes("snow")) {
    animationContainer.innerHTML = `<dotlottie-player src="https://lottie.host/58aaa1aa-f982-4ae3-a9e1-765a5e21b7e9/rXJ1jCvCiq.lottie" background="transparent" speed="1" style="width: 300px; height: 300px" loop autoplay></dotlottie-player>`;
  } else {
    animationContainer.innerHTML = `<p>No animation available for this weather condition.</p>`;
  }
}

// Search Function
function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");
  let city = searchInput.value.trim();

  if (city) {
    let apiKey = "18453971e9e6e708226886b286dabdef"; // Use your valid API key
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    axios
      .get(apiUrl)
      .then(displayTemperature)
      .catch((error) => {
        console.error("Error fetching data:", error);
        alert("City not found. Please enter a valid city name.");
      });
  } else {
    alert("Please enter a city name!");
  }
}

// Initialize Date
document.querySelector("#current-date").innerHTML = formatDate(new Date());

// Event Listener
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", search);

async function fetchWeatherByCoords(lat, lon) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    
    // Get the search input element
    const searchInput = document.getElementById("search-input");
    
    // Set the search input value to the detected city name
    searchInput.value = response.data.name;
    
    // Display the weather data
    displayWeatherData(response.data);
  } catch (error) {
    showError("Unable to fetch weather data. Please try again.");
  } finally {
    hideLoading();
  }
}

function displayWeeklyForecast(forecastData) {
  const container = document.getElementById("forecast-container");
  container.innerHTML = "";
  
  const dailyForecasts = forecastData.filter((item, index) => index % 8 === 0);
  
  dailyForecasts.forEach(forecast => {
    const date = new Date(forecast.dt * 1000);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    
    const forecastItem = `
      <div class="forecast-item">
        <span class="forecast-day">${dayName}</span>
        <img 
          src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" 
          alt="${forecast.weather[0].description}"
          class="forecast-icon"
        >
        <span class="forecast-temp">${Math.round(forecast.main.temp)}°C</span>
      </div>
    `;
    
    container.innerHTML += forecastItem;
  });
}

function updateBackground(weatherData) {
  const weatherApp = document.querySelector('.weather-app');
  const weatherCondition = weatherData.weather[0].main.toLowerCase();
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour > 18;

  let gradientStyle = '';

  switch(weatherCondition) {
    case 'clear':
      gradientStyle = isNight 
        ? 'linear-gradient(to right, #0f2027, #203a43, #2c5364)'
        : 'linear-gradient(to right, #00b4db, #0083b0)';
      break;
    case 'clouds':
      gradientStyle = isNight
        ? 'linear-gradient(to right, #292E49, #536976)'
        : 'linear-gradient(to right, #bdc3c7, #2c3e50)';
      break;
    case 'rain':
    case 'drizzle':
      gradientStyle = 'linear-gradient(to right, #373B44, #4286f4)';
      break;
    case 'thunderstorm':
      gradientStyle = 'linear-gradient(to right, #232526, #414345)';
      break;
    case 'snow':
      gradientStyle = 'linear-gradient(to right, #E6DADA, #274046)';
      break;
    default:
      gradientStyle = 'linear-gradient(to right, #2C3E50, #3498DB)';
  }

  weatherApp.style.background = gradientStyle;
  weatherApp.style.transition = 'background 1s ease';
}

// Call this function when displaying weather data
function displayWeatherData(data) {
  const cityElement = document.getElementById("current-city");
  const temperatureElement = document.getElementById("current-temperature");
  const detailsElement = document.getElementById("current-details");
  
  cityElement.textContent = data.name;
  temperatureElement.textContent = Math.round(data.main.temp);
  detailsElement.textContent = `${data.weather[0].description} | Humidity: ${data.main.humidity}% | Wind: ${data.wind.speed} m/s`;

  // Call updateBackground with the weather data
  updateBackground(data);
}
