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

// global variables
const coords = { lat: 0, lng: 0 };
const marker = new mapboxgl.Marker();
const userInput = document.getElementById("userInput");
const dayCardContainer = document.getElementById("dayCardContainer");

// Get coords from search bar input
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
      getForecast(
        result.data.features[0].center[1],
        result.data.features[0].center[0]
      );
    }
  } else {
    getForecast(Number(matchCoords[2]), Number(matchCoords[1]));
  }
});

// Get coords from map click
map.on("click", (e) => {
  console.log(`A click event has occurred at ${e.lngLat}`);
  getForecast(e.lngLat.lat, e.lngLat.lng);
});

// Get forecast data from coords
async function getForecast(longitude, latitude) {
  coordsUpdater(longitude, latitude);
  const result = await axios.get(
    `http://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lng}&units=metric&appid=1c5f2718ceda5720d2b51266a6fa7283`
  );
  forecastData = result.data;
  // console.log(forecastData.daily);
  weekForecastCreator(forecastData.daily);
}

// Updates coords and relative DOM
function coordsUpdater(latitude, longitude) {
  coords.lat = latitude;
  coords.lng = longitude;
  document.getElementById("lat").textContent = coords.lat;
  document.getElementById("lng").textContent = coords.lng;
  marker.setLngLat([coords.lng, coords.lat]).addTo(map);
  map.flyTo({ center: [coords.lng, coords.lat], zoom: 4 });
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
                <p class="temp__actual dayNightToggle" id="temp__actual--day${i}">${dataObj.temp.day.toFixed()}&#8451</p>
                <p class="temp__actual dayNightToggle hide" id="temp__actual--night${i}">${dataObj.temp.night.toFixed()}&#8451</p>
                <div class="temp__feelContainer">
                  <p class="temp__feelLabel">Feels like: <br>
                    <spam class="temp__feel dayNightToggle" id="temp__feel--day${i}">${dataObj.feels_like.day.toFixed()}&#8451</spam>
                    <spam class="temp__feel dayNightToggle hide" id="temp__feel--night${i}">${dataObj.feels_like.night.toFixed()}&#8451</spam>
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
      const dayNightElements =
        e.target.getElementsByClassName("dayNightToggle");
      Array.from(dayNightElements).forEach((element) => {
        element.classList.toggle("hide");
      });
      // WHILST RUSSEL SAID USING IDs IS BEST, THE ABOVE SEEMS LIKE A MORE ELEGANT SOLUTION TO THIS PARTICULAR TASK

      // document.getElementById(`temp__actual--day${i}`).classList.toggle("hide");
      // document
      //   .getElementById(`temp__actual--night${i}`)
      //   .classList.toggle("hide");
      // document.getElementById(`temp__feel--day${i}`).classList.toggle("hide");
      // document.getElementById(`temp__feel--night${i}`).classList.toggle("hide");
    }
  });
}
