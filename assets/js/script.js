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

    });