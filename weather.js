// Create a JS based web site that allows the user to see weather in a given location
//  Just like here - https://practical-mcnulty-b8423f.netlify.app/
// This is the more simple api - https://openweathermap.org/api/hourly-forecast
// This is the more complex with more features - https://openweathermap.org/api/one-call-api
// You can let the user enter a location or use the geolocation api, if time permits offer both!
// Tips:
// Create a key at least 4 hours before you begin
// Start by just getting data into the console
// Then insert some data into the DOM
// Then insert all the data into the DOM
// Then add css classes to make it look nice
// Then solve adding the images
// This will take classwork into the end of next week!

// Map
mapboxgl.accessToken =
  "pk.eyJ1IjoiYXJkbzg4IiwiYSI6ImNrenY1eGk4bDFkcXMydm1vdHlheXg5anMifQ.RG_vO4Pl94-BDg-bz9tQmg";
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/dark-v10", // style URL
  center: [10, 10], // starting position [lng, lat]
  zoom: 1, // starting zoom
});

// adds map controls
map.addControl(new mapboxgl.NavigationControl());

// adds "locate self" button ((MAYBE DELETE))
map.addControl(
  new mapboxgl.GeolocateControl({
    fitBoundsOptions: { maxZoom: 3 },
  })
);

// adds search bar functionality
// map.addControl(
//   new MapboxGeocoder({
//     accessToken: mapboxgl.accessToken,
//     mapboxgl: mapboxgl,
//     // localGeocoder: coordinatesGeocoder,
//   })
// );

let lat = 0;
let lng = 0; // put in one block
const marker = new mapboxgl.Marker();
const userInput = document.getElementById("userInput");
const dayCardContainer = document.getElementById("dayCardContainer");

// Get coords from search bar
userInput.addEventListener("input", (e) => {
  const matchCoords = userInput.value.match(
    /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
  );

  if (!matchCoords) {
    getCoords(userInput.value);
    async function getCoords(place) {
      const result = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?access_token=pk.eyJ1IjoiYXJkbzg4IiwiYSI6ImNrenY1eGk4bDFkcXMydm1vdHlheXg5anMifQ.RG_vO4Pl94-BDg-bz9tQmg`
      );
      lat = result.data.features[0].center[1];
      lng = result.data.features[0].center[0];
      getForecast();
    }
  } else {
    lat = Number(matchCoords[2]);
    lng = Number(matchCoords[1]);
    getForecast();
  }
});

// Get coords from map click
map.on("click", (e) => {
  console.log(`A click event has occurred at ${e.lngLat}`);
  lat = e.lngLat.lat;
  lng = e.lngLat.lng;
  getForecast();
});

// Get forecast data from coords
async function getForecast() {
  updateCoordsDOM();
  const result = await axios.get(
    `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=metric&appid=1c5f2718ceda5720d2b51266a6fa7283`
  );
  forecastData = result.data;
  weekForecastCreator(forecastData.daily);
}

// updates lat/lng on DOM and map marker
function updateCoordsDOM() {
  document.getElementById("lat").textContent = lat;
  document.getElementById("lng").textContent = lng;
  marker.setLngLat([lng, lat]).addTo(map);
  map.flyTo({ center: [lng, lat], zoom: 4 });
}

// create dayCard for each day of week
function weekForecastCreator(dataObj) {
  // delete previous dayCards
  dayCardContainer.innerHTML = "";

  for (let i = 0; i < 7; i++) {
    dayUpdateDom(dataObj[i], i);
    addDayCardInteraction(i);
  }
}

// update DOM with a day's forecast
function dayUpdateDom(dataObj, i) {
  dayCardContainer.insertAdjacentHTML("beforeend", dayCardHTML(dataObj, i));
}

// creates html for a day's forecast
function dayCardHTML(dataObj, i) {
  return `<div class="dayCard" id="dayCard${i}">
              <h2 class="date">${getDayName(dataObj)}</h2>
              <div class="temp" id="temp${i}">
                <p class="temp__actual temp__actual--day" id="temp__actual--day${i}">${dataObj.temp.day.toFixed()}&#8451</p>
                <p class="temp__actual temp__actual--night hide" id="temp__actual--night${i}">${dataObj.temp.night.toFixed()}&#8451</p>
                <div class="temp__feelContainer">
                  <p class="temp__feelLabel">Feels like: <br>
                    <spam class="temp__feel--day" id="temp__feel--day${i}">${dataObj.feels_like.day.toFixed()}&#8451</spam>
                    <spam class="temp__feel--night hide" id="temp__feel--night${i}">${dataObj.feels_like.night.toFixed()}&#8451</spam>
                  </p>
                </div>
              </div>
              <h3 class="description">${capEachLetter(
                dataObj.weather[0].description
              )}</h3> 
              <p class="humidity">Humidity: <spam>${
                dataObj.humidity
              }%</spam></p>
              <p class="windSpeed">Wind-speed: <spam>${dataObj.wind_speed.toFixed()} mph</spam></p>
 
          </div>`;
}

// converts unix time to day of week
function getDayName(dataObj) {
  let unixDate = new Date(dataObj.dt * 1000);
  let dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return dayNames[unixDate.getDay()].toUpperCase();
}

function capEachLetter(string) {
  const words = string.split(" ");
  words.forEach((word, i) => {
    words[i] = word.charAt(0).toUpperCase() + word.slice(1);
  });
  return words.join(" ");
}

// DAY CARD INTERACTION

function addDayCardInteraction(i) {
  dayCardContainer.addEventListener("click", (e) => {
    // day/night temp toggle
    if (e.target.id === `temp${i}`) {
      document.getElementById(`temp__actual--day${i}`).classList.toggle("hide");
      document
        .getElementById(`temp__actual--night${i}`)
        .classList.toggle("hide");
      document.getElementById(`temp__feel--day${i}`).classList.toggle("hide");
      document.getElementById(`temp__feel--night${i}`).classList.toggle("hide");
    }
  });
}
