$(document).ready(function () {
  // Function to fetch weather data and populate the sections
  function fetchWeather(cityName) {
    var apiKey = "8296259287138241bd1f7515d2c66043";

    // URL for current weather and forecast data
    var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

    // Fetch current weather data
    $.getJSON(currentWeatherUrl, function (currentData) {
      // Fetch forecast data
      $.getJSON(forecastUrl, function (forecastData) {
        // Clear existing data
        clearWeatherInfo();
        // Display current weather and forecast
        displayWeather(cityName, currentData, forecastData);
        // Save searched city to local storage
        saveToLocalStorage(cityName);
        // Recreate history buttons
        recreateHistoryButtons();
      });
    });
  }

  // Function to display weather data on the webpage
  function displayWeather(cityName, currentData, forecastData) {
    // Display current weather
    var currentTemperature = currentData.main.temp;
    var currentDescription = currentData.weather[0].description;
    var currentIcon = currentData.weather[0].icon;
    var currentWind = currentData.wind.speed;
    var currentHumidity = currentData.main.humidity;

    // Create HTML for current weather
    var currentWeatherHTML = `
        <div id="current-weather">
      <h2>${cityName} (${new Date().toLocaleDateString("en-GB")})
      <img id="current-weather-icon" src="http://openweathermap.org/img/w/${currentIcon}.png" alt="Weather Icon"></h2>
      <ul>
        <li>Temperature: ${currentTemperature}°C</li>
        <li>Description: ${currentDescription}</li>
        <li>Wind: ${currentWind} MPH</li>
        <li>Humidity: ${currentHumidity}%</li>
      </ul>
    </div>
        `;
    $("#today").html(currentWeatherHTML);

    var forecastHTML = '<h2>5-Day Forecast</h2><div class="row">';
    var forecastsPerDay = {}; // Group forecasts by day
    // Calculate the date for tomorrow
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate());

    // Initialize a counter for the number of days included
    var daysIncluded = 0;

    for (var i = 0; i < forecastData.list.length; i++) {
      var forecast = forecastData.list[i];
      var forecastDate = new Date(forecast.dt_txt.split(" ")[0]); // Convert to Date object

      // Check if the forecast date is from tomorrow to the next 5 days
      if (forecastDate >= tomorrow && daysIncluded < 5) {
        var formattedDate = forecastDate.toLocaleDateString("en-GB"); // Format as dd/mm/yyyy
        if (!forecastsPerDay[formattedDate]) {
          forecastsPerDay[formattedDate] = {
            date: formattedDate,
            icon: forecast.weather[0].icon,
            temperatures: [],
            winds: [],
            humidities: [],
          };

          daysIncluded++; // Increment the counter
        }

        forecastsPerDay[formattedDate].temperatures.push(forecast.main.temp);
        forecastsPerDay[formattedDate].winds.push(forecast.wind.speed);
        forecastsPerDay[formattedDate].humidities.push(forecast.main.humidity);
      }
    }

    // Create a card for each day's forecast
    Object.values(forecastsPerDay).forEach((dayForecast) => {
      forecastHTML += `
        <div class="col-lg">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title">${dayForecast.date}</h3>
              <img src="http://openweathermap.org/img/w/${
                dayForecast.icon
              }.png" alt="Weather Icon">
              <p class="card-text">Temp: ${average(
                dayForecast.temperatures
              )} °C</p>
              <p class="card-text">Wind: ${average(dayForecast.winds)} MPH</p>
              <p class="card-text">Humidity: ${average(
                dayForecast.humidities
              )}%</p>
            </div>
          </div>
        </div>
    `;
    });

    forecastHTML += "</div>";
    $("#forecast").html(forecastHTML);

    // Helper function to calculate average
    function average(arr) {
      return (arr.reduce((sum, value) => sum + value, 0) / arr.length).toFixed(
        2
      );
    }
  }

  function clearWeatherInfo() {
    $("#current-weather").remove();
    $("#forecast").empty();
  }

  // Function to save searched city to local storage
  function saveToLocalStorage(cityName) {
    var cities = JSON.parse(localStorage.getItem("cities")) || [];
    if (!cities.includes(cityName)) {
      cities.push(cityName);
      localStorage.setItem("cities", JSON.stringify(cities));
    }
  }

  // Function to recreate history buttons from local storage
  function recreateHistoryButtons() {
    var cities = JSON.parse(localStorage.getItem("cities")) || [];
    var historyHtml = "";
    cities.forEach(function (city) {
      historyHtml += `
        <button class="btn btn-secondary history-button">${city}</button>
      `;
    });
    $("#history").html(historyHtml);

    // Attach event listener to history buttons
    $(".history-button").click(function () {
      var cityName = $(this).text();
      fetchWeather(cityName);
    });
  }

  // Function to check if a city is in the history
  function isCityInHistory(cityName) {
    var cities = JSON.parse(localStorage.getItem("cities")) || [];
    return cities.includes(cityName);
  }

  // Form submission handler
  $("#search-form").submit(function (event) {
    event.preventDefault();
    var cityName = $("#search-input").val().trim();
    if (cityName !== "") {
      if (isCityInHistory(cityName)) {
        alert(`${cityName} is already in the history.`);
      } else {
        fetchWeather(cityName);
        $("#search-input").val(""); // Clear the input field
      }
    }
  });
  // Recreate history buttons on page load

  recreateHistoryButtons();
});
