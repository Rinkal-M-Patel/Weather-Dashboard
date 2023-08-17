$(document).ready(function() {
    // Function to fetch weather data and populate the sections
    function fetchWeather(cityName) {
        var apiKey = '8296259287138241bd1f7515d2c66043'; 
    
        var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
        var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;
    
        $.getJSON(currentWeatherUrl, function(currentData) {
          $.getJSON(forecastUrl, function(forecastData) {
            displayWeather(cityName, currentData, forecastData);
            });
        });
      }

      function displayWeather(cityName, currentData, forecastData) {
        // Display current weather
        var currentTemperature = currentData.main.temp;
        var currentDescription = currentData.weather[0].description;
        var currentIcon = currentData.weather[0].icon;
        var currentWind = currentData.wind.speed;
      var currentHumidity = currentData.main.humidity;
    
        var currentWeatherHTML = `
        <div id="current-weather">
      <h2>${cityName} (${new Date().toLocaleDateString('en-GB')})
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
  
      }


      
  // Form submission handler
  $("#search-form").submit(function(event) {
    event.preventDefault();
    var cityName = $("#search-input").val().trim();
    if (cityName !== "") {
      fetchWeather(cityName);
      $("#search-input").val(""); // Clear the input field
    }
  });


    });