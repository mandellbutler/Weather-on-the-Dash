// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
fetch("http://api.openweathermap.org/data/2.5/weather?q=Manhattan&appid=f6c1e331ddeaf6a510ea535944b32127&units=imperial")
.then(function(response) {
    console.log("response", response);
    return response.json();
}) 
.then(function(data) {
    console.log("data", data);

    for (var i = 0; i < data.length; i++) {
        console.log(data[i].main.humidity)
        console.log(data[i].main.temp)
    }//do your work with the data in here
})
//--------------------------

// var baseUrl = "http://api.openweathermap.org/";
// var endPoint = "/data/2.5/weather?q="; 
// var parameter = document.getElementById("citySearch");
// var apiKey = "&appid=f6c1e331ddeaf6a510ea535944b32127&units=imperial";


// function fetchWeather() {
//     fetch("baseUrl" + "endPoint" + "parameter" + "apiKey")
//     .then(function(response) {
//         console.log("response", response);
//         return response.json();
//     })
//     .then(function(data) {
//         console.log("data", data);
//     })
// }



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
    li.setAttribute("data-index", i);
    //place
    li.appendChild(button);
    savedList.appendChild(li);
  }
}


function init() {
  // Retrieve the saved list from local storage and re-convert into object array
  var storedSearches = JSON.parse(localStorage.getItem("searches"));

  if (storedSearches !== null) {
    searches = storedSearches;
  }
  renderSearches();
}

function storeSearches() {
  // Convert saved list into a string and save to local storage
  localStorage.setItem("searches", JSON.stringify(searches));
}

searchForm.addEventListener("submit", function(event) {
  event.preventDefault();
  var searchText = userInput.value.trim();
  
  if (searchText === "") {
    return;
  }
 
  searches.push(searchText);
  searchInput.value = "";
 
  
  storeSearches();
  renderSearches();
});


savedList.addEventListener("click", function(event) {
  var element = event.target;
  
  if (element.matches("button") === true) {
    var index = element.parentElement.getAttribute("data-index");
    searches.splice(index, 1);
    
    storeSearches();
    renderSearches();
  }
});

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