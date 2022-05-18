// creates html for a day's forecast
export function dayCardHTML(dataObj, i) {
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
