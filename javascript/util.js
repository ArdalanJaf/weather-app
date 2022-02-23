export function getDayName(dataObj) {
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

export function capEachLetter(string) {
  const words = string.split(" ");
  words.forEach((word, i) => {
    words[i] = word.charAt(0).toUpperCase() + word.slice(1);
  });
  return words.join(" ");
}
