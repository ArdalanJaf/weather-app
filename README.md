# Global-Forecaster

Provides weather forecast for anywhere in the world, using Axios to communicate to two APIs (openMapGL and open-weather-map).

## Software

- JS
- Axios
- SASS
- HTML


## Features

- 8 day forecast displayed for anythere in the world.
- Interactive map that can be used to select location.
- Map zooms in on location if user types place-name or co-ordinates as input.
- Can discern co-ordinates from place names input by user.
- Co-ordinates are sent to open-weather-map to retrieve forecast.
- Updates DOM with forecast displayed as "dayCards".

## Method

Using functional-programing, this app starts with an event-listener for input from the user. As well as text, input can come in the form of selecting a location on a map (openMapGL). If text-input is a place-name, an API request is sent to open-weather-map to convert place-name into co-ordinates. 
If input is text, the map zooms onto co-ordinated obtained.

Once co-ordinates are obtained, getForecast function is initialised, which contacts open-weather-map to obtain forecast. Either errors are caught and communicated, or a forecast is returned in the form of an object. 

This initialises weekForecastCreator function, which converts the object into "dayCards" and updates the DOM. 

If user enters new input, the whole process is repeated.
