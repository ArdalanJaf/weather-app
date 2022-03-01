import { getDayName, capEachLetter } from "./util.js";
import { iconSelector } from "./iconSelector.js";

// Map API
mapboxgl.accessToken =
  "pk.eyJ1IjoiYXJkbzg4IiwiYSI6ImNrenY1eGk4bDFkcXMydm1vdHlheXg5anMifQ.RG_vO4Pl94-BDg-bz9tQmg";
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/dark-v10", // style URL
  center: [0, 30], // starting position [lng, lat]
  zoom: 1, // starting zoom
});

// global variables
const coords = { lat: 0, lng: 0 };
const marker = new mapboxgl.Marker();
const userInput = document.getElementById("userInput");
const dayCardContainer = document.getElementById("dayCardContainer");

// Listener: get coords from map click
map.on("click", (e) => {
  console.log(`A click event has occurred at ${e.lngLat}`);
  getForecast(e.lngLat.lat, e.lngLat.lng);
});

// Listener: get coords from search bar input
userInput.addEventListener("input", (e) => {
  const matchCoords = userInput.value.match(
    /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
  );
  if (!matchCoords) {
    getCoordsFromPlace(userInput.value);
  } else {
    getForecast(Number(matchCoords[2]), Number(matchCoords[1]));
  }
});

// uses API to convert place name to coords
async function getCoordsFromPlace(place) {
  try {
    const result = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?access_token=pk.eyJ1IjoiYXJkbzg4IiwiYSI6ImNrenY1eGk4bDFkcXMydm1vdHlheXg5anMifQ.RG_vO4Pl94-BDg-bz9tQmg`
    );
    getForecast(
      result.data.features[0].center[1],
      result.data.features[0].center[0]
    );
  } catch (error) {
    alert("Cannot get coords from searched place name, API down");
  }
}

// Get forecast data from coords
async function getForecast(longitude, latitude) {
  coordsUpdater(longitude, latitude);
  try {
    const result = await axios.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lng}&units=metric&appid=1c5f2718ceda5720d2b51266a6fa7283`
    );
    let forecastData = result.data;
    weekForecastCreator(forecastData.daily);
  } catch (error) {
    alert("API site is down, please try later.");
    console.log(error);
  }
}

// Updates coords and relative DOM
function coordsUpdater(latitude, longitude) {
  coords.lat = latitude;
  coords.lng = longitude;
  marker.setLngLat([coords.lng, coords.lat]).addTo(map);
  map.flyTo({ center: [coords.lng, coords.lat], zoom: 4 });
}

// create dayCard for each day of week
function weekForecastCreator(dataObj) {
  // delete previous dayCards
  dayCardContainer.innerHTML = "";

  for (let i = 0; i < 8; i++) {
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
            <div class="dayStatsContainer">
              <div class="tempBox statHolder" id="temp${i}">
                <img class="temp__icon dayNightToggle" src="../assets/day.svg" />
                <img class="temp__icon dayNightToggle hide" src="../assets/night.svg" />
                <p class="temp__actual dayNightToggle" id="temp__actual--day${i}">${dataObj.temp.day.toFixed()}&#8451</p>
                <p class="temp__actual dayNightToggle hide" id="temp__actual--night${i}">${dataObj.temp.night.toFixed()}&#8451</p>
                <p class="temp__feelLabel">Feels:<br>
                  <spam class="temp__feel dayNightToggle" id="temp__feel--day${i}">${dataObj.feels_like.day.toFixed()}&#8451</spam>
                  <spam class="temp__feel dayNightToggle hide" id="temp__feel--night${i}">${dataObj.feels_like.night.toFixed()}&#8451</spam>
                </p>
              </div>
              <div class="humidBox statHolder">
              <img class="humidity_icon" src="../assets/humidity.svg" />
                <p class="humidity">${dataObj.humidity}%</p>
              </div>
              <div class="windBox statHolder">
              <img class="windSpeed_icon" src="../assets/windspeed.svg" />
                <p class="windSpeed">${dataObj.wind_speed.toFixed()}<spam> mph</spam></p>
              </div>
            </div>
            <img class="weatherIcon" src="../assets/weather_icons/${iconSelector(
              dataObj.weather[0].main,
              dataObj.weather[0].description
            )}.svg"/>
            <h3 class="description">${capEachLetter(
              dataObj.weather[0].description
            )}</h3> 
           </div>`;
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
    }
  });
}
