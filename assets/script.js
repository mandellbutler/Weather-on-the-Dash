// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// fetch("http://api.openweathermap.org/data/2.5/weather?q=Manhattan&appid=f6c1e331ddeaf6a510ea535944b32127&units=imperial")
// .then(function(response) {
//     console.log("response", response);
//     return response.json();
// }) 
// .then(function(data) {
//     console.log("data", data);

//     for (var i = 0; i < data.length; i++) {
//         console.log(data[i].main.humidity)
//         console.log(data[i].main.temp)
//     }//do your work with the data in here
// })
// //--------------------------FECTHING WEATHER DATA FROM OPEN WEATHER API

// var parameter = document.getElementById("citySearch");
//FEATURED CITY WEATHER REQUEST
function fetchWeather(parameter) {
  var baseUrl = "https://api.openweathermap.org";
  var endPoint = "/data/2.5/weather?q=";
  var apiKey = "&appid=f6c1e331ddeaf6a510ea535944b32127&units=imperial";
  var url = baseUrl + endPoint + parameter + apiKey;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(renderSearchResults)
}

//5DAY WEATHER REQUEST
function fetchForecast(parameter) {
  var baseUrl = "https://api.openweathermap.org";
  var endPoint = "/data/2.5/forecast?q=";
  var apiKey = "&appid=f6c1e331ddeaf6a510ea535944b32127&units=imperial";
  var url = baseUrl + endPoint + parameter + apiKey;

  fetch(url)
    .then(function (response) {
      console.log(response)
      return response.json();
    })
    .then(render5DayResults)
    
}



// //========Ben's Example
// var baseURL = "http://api.openweathermap.org";
// var endPoint = "/data/2.5/weather";
// var apiKey = "e8f89c7f6e46ebcce4956f65813111a9"
// var parameters = "?q=houston&appid="+apiKey+"&units=imperial"

// // make a request
// fetch(baseURL + endPoint + parameters)
// // get the response
// .then(function(response) {
//   console.log("response", response);
//   return response.json();
// })
// .then(function(data) {
//   console.log("data", data);
//   // do your work with the data in here
// })

//----------------------------------------------
//SEARCH BUTTON AND SEARCHED CITY LIST

var userInput = document.querySelector("#searchText");
var searchForm = document.querySelector("#searchForm");
var savedList = document.querySelector("#savedCities");
var featuredCity = document.querySelector("#featuredCity");

var searches = [];

// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
//Generate a list of saved searches, using local storage
function renderSearches() {
  savedList.innerHTML = "";

  //update search list with each additional search
  for (var i = 0; i < searches.length; i++) {
    var search = searches[i];
    //create
    var li = document.createElement("li");
    var button = document.createElement("button");
    //build
    button.textContent = search;
    button.classList.add("btn", "btn-secondary", "form-control", "my-1")
    button.onclick = handleLiClick
    li.setAttribute("data-index", i);
    //place
    li.appendChild(button);
    savedList.appendChild(li);
  }
}
//handles the list of previously searched cities
function handleLiClick() {
  var newSearches = []
  fetchWeather(this.textContent)
  fetchForecast(this.textContent)
  
  for (var i = 0; i < searches.length; i++) {
    if (searches[i] !== this.textContent) {
      newSearches.push(searches[i])
    }
  }
  newSearches.unshift(this.textContent)
  searches = newSearches
  
  renderSearches()
  storeSearches()
}
//=========================Rendering weather for Featured City
function renderSearchResults(result) {
  featuredCity.innerHTML = ""
  var city = document.createElement("div")
  city.classList.add("city")
  city.textContent = result.name

  var icon = document.createElement("div")
  icon.classList.add("weather_feature")
  icon.textContent = result.weather[0].icon
  
  var temp = document.createElement("div")
  temp.classList.add("weather_feature")
  temp.textContent = "Temp: " + result.main.temp + " °F"

  var wind = document.createElement("div")
  wind.classList.add("weather_feature")
  wind.textContent = "Wind: " + result.wind.speed + " MPH"
  
  var humidity = document.createElement("div")
  humidity.classList.add("weather_feature")
  humidity.textContent = "Humidity: " + result.main.humidity + "%"

  featuredCity.appendChild(city)
  featuredCity.appendChild(icon)
  featuredCity.appendChild(wind)
  featuredCity.appendChild(temp)
  featuredCity.appendChild(humidity)
  console.log(result)
}
//==========================Rendering weather for 5 Day Forecast
function render5DayResults(result) {
  card1.innerHtml = ""
  var temp = document.createElement("div")
  temp.classList.add("weather_card")
  temp.textContent = "Temp: " + result.main.temp + " °F"

  var wind = document.createElement("div")
  wind.classList.add("weather_card")
  wind.textContent = "Wind: " + result.wind.speed

  var humidity = document.createElement("div")
  humidity.classList.add("weather_card")
  humidity.textContent = "Humidity: " + result.main.humidity + "%"

  card1.appendChild(temp)
  card1.appendChild(wind)
  card1.appendChild(humidity)
  console.log(result)


}
function init() {
  // Retrieve the saved list from local storage and re-convert into object array
  searches = JSON.parse(localStorage.getItem("searches"));
  if (!searches) {
    searches = [];
  }
  
  if (searches.length > 0) {
    fetchWeather(searches[0])
    fetchForecast(searches[0])
  }
  
  renderSearches();
}

function storeSearches() {
  // Convert saved list into a string and save to local storage
  localStorage.setItem("searches", JSON.stringify(searches));
}

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  var searchText = userInput.value.trim();
  userInput.value = ""
  
  if (searchText === "") {
    return;
  }

  var newSearches = []
  for (var i = 0; i < searches.length; i++) {
    if (searches[i] !== searchText) {
      newSearches.push(searches[i])
    }
  }
  newSearches.unshift(searchText)
  searches = newSearches
  
  fetchWeather(searchText)
  searchText.value = "";

  fetchForecast(searchText)
  searchText.value = "";

  
  storeSearches();
  renderSearches();
});


// savedList.addEventListener("click", function(event) {
//   var element = event.target;

//   if (element.matches("button") === true) {
//     var index = element.parentElement.getAttribute("data-index");
//     searches.splice(index, 1);

//     storeSearches();
//     renderSearches();
//   }
// });

init();


// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

