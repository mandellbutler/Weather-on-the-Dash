// //--------------------------FECTHING WEATHER DATA FROM OPEN WEATHER API
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
      return response.json();
    })
    .then(render5DayResults)
}
//----------------------------------------------
//SEARCH BUTTON AND SEARCHED CITY LIST

var userInput = document.querySelector("#searchText");
var searchForm = document.querySelector("#searchForm");
var savedList = document.querySelector("#savedCities");
var featuredCity = document.querySelector("#featuredCity");
var weatherCards = document.querySelector("#weatherCards");

var searches = [];

//Generate a list of saved searches, using local storage
function renderSearches() {
  savedList.innerHTML = "";

  //update search list with each additional search
  for (var i = 0; i < searches.length; i++) {
    var search = searches[i];
    //create
    var div = document.createElement("div");
    var button = document.createElement("button");
    //build
    button.textContent = search;
    button.classList.add("btn", "btn-secondary", "form-control", "my-1")
    button.onclick = handleLiClick
    div.setAttribute("data-index", i);
    //place
    div.appendChild(button);
    savedList.appendChild(div);
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
  console.log("Feature City: ", result)
  featuredCity.innerHTML = ""
  var city = document.createElement("div")
  city.classList.add("city", "title")
  city.textContent = result.name + "    (" + new Date().toLocaleDateString() + ")"


  var icon = document.createElement("img")
  icon.classList.add("weather_feature")
  icon.setAttribute("src", "http://openweathermap.org/img/wn/" + result.weather[0].icon + "@2x.png");
  icon.setAttribute("class", "col-3")

  var temp = document.createElement("div")
  temp.classList.add("weather_feature")
  temp.textContent = "Temp: " + (Math.round(result.main.temp)) + " °F"

  var wind = document.createElement("div")
  wind.classList.add("weather_feature")
  wind.textContent = "Wind: " + (Math.round(result.wind.speed)) + " MPH"

  var humidity = document.createElement("div")
  humidity.classList.add("weather_feature")
  humidity.textContent = "Humidity: " + result.main.humidity + "%"


  featuredCity.appendChild(city)
  featuredCity.appendChild(icon)
  featuredCity.appendChild(temp)
  featuredCity.appendChild(wind)
  featuredCity.appendChild(humidity)

}

//==========================Rendering weather for 5 Day Forecast
function render5DayResults(results) {
  weatherCards.innerHTML = ""
  for (var result of results.list) {
    if (result.dt_txt.split(" ")[1] === "12:00:00") {
      render5DayResult(result)
      console.log("5day Result: ", result)
    }
  }
}

function render5DayResult(day) {
  var card = document.createElement("div")
  card.classList.add("container", "cards", "col", "bg-success", "text-light", "rounded", "mr-1")

  var date = document.createElement("div")
  date.textContent = new Date(day.dt_txt).toLocaleDateString()

  var icon = document.createElement("img")
  icon.classList.add("weather_feature")
  icon.setAttribute("src", "http://openweathermap.org/img/wn/" + day.weather[0].icon + "@2x.png");

  var temp = document.createElement("div")
  temp.textContent = "Temp: " + (Math.round(day.main.temp)) + " °F"

  var wind = document.createElement("div")
  wind.textContent = "Wind: " + (Math.round(day.wind.speed)) + " MPH"

  var humidity = document.createElement("div")
  humidity.textContent = "Humidity: " + day.main.humidity + "%"

  weatherCards.appendChild(card)
  card.appendChild(date)
  card.appendChild(icon)
  card.appendChild(temp)
  card.appendChild(wind)
  card.appendChild(humidity)

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

init();


