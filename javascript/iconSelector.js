export function iconSelector(main, description) {
  switch (main) {
    case "Clear":
      return "clear-day";

    case "Clouds":
      if (description.includes("few") || description.includes("scattered")) {
        return "cloudy";
      } else {
        return "overcast";
      }

    case "Rain":
      if (description === "light rain") {
        return "drizzle";
      } else if (description === "freezing rain") {
        return "sleet";
      } else {
        return "rain";
      }

    case "Drizzle":
      return "drizzle";

    case "Snow":
      if (description.includes("rain") || description.includes("sleet")) {
        return "sleet";
      } else {
        return "snow";
      }

    case "Thunderstorm":
      if (description.includes("rain") || description.includes("drizzle")) {
        return "thunderstorms-rain";
      } else {
        return "thunderstorms";
      }

    case "Mist":
      return "mist";

    case "Fog":
      return "fog";

    case "Squall":
      return "wind";

    case "Smoke":
      return "smoke";

    case "Haze":
      return "haze";

    case "Tornado":
      return "tornado";

    default:
      // sand/dust
      return "dust-wind";
  }
}
