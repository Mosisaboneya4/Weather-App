// Format Date
function formatDate(date) {
    let hours = date.getHours().toString().padStart(2, "0");
    let minutes = date.getMinutes().toString().padStart(2, "0");
  
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = days[date.getDay()];
  
    return `${day} ${hours}:${minutes}`;
  }
  
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
  