// btn Dark/light mode
const btn = document.querySelector('.btn');

btn.addEventListener('click', function (e) {
  const html = document.querySelector('html');

  if (html.classList.contains('dark')) {
    html.classList.remove('dark');
    e.target.innerHTML = 'Dark Mode';
  } else {
    html.classList.add('dark');
    e.target.innerHTML = 'Light Mode';
  }
});

// clock
const hourEl = document.querySelector('.hour');
const minuteEl = document.querySelector('.minute');
const secondEl = document.querySelector('.second');
const timeEl = document.querySelector('.time');
const dateEl = document.querySelector('.date');

const days = [
  'Sunday',
  'Monday',
  'Thuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const months = [
  'Jan',
  ' Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const setTime = function () {
  const time = new Date();
  const date = time.getDate();
  const day = time.getDay();
  const month = time.getMonth();
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const hourForClock = hours % 24;
  const ampm = hours < 12 ? 'AM' : 'PM';

  hourEl.style.transform = `translate(-50%, -100%) rotate(${scale(
    hourForClock,
    0,
    11,
    0,
    360
  )}deg)`;
  minuteEl.style.transform = `translate(-50%, -100%) rotate(${scale(
    minutes,
    0,
    59,
    0,
    360
  )}deg)`;
  secondEl.style.transform = `translate(-50%, -100%) rotate(${scale(
    seconds,
    0,
    59,
    0,
    360
  )}deg)`;

  timeEl.innerHTML = `${hourForClock}:${
    minutes < 10 ? `${minutes}` : minutes
  } ${ampm}`;

  dateEl.innerHTML = `${days[day]}, ${months[month]} <span class="circle">${date}</span>`;
};
const scale = (num, in_min, in_max, out_min, out_max) => {
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

setTime();
setInterval(setTime, 1000);

// navigation
const timezone = document.querySelector('.time-zone');
const countryEl = document.querySelector('.country');
const currentWeatherItem = document.querySelector('.weather-container');
const weatherForcastEl = document.querySelector('.weather-forecast');
const currentTempEl = document.querySelector('#current-temp');

const API_KEY = `4a0c877b8aa2d659fa5fc96e9ca1b11d`;
function getWeatherData() {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        showWeatherData(data);
      });
  });
}
getWeatherData();

function showWeatherData(data) {
  const { humidity, pressure, sunrise, sunset, wind_speed, temp } =
    data.current;

  timezone.innerHTML = data.timezone;
  countryEl.innerHTML = data.lat + 'N ' + data.lon + 'E';

  currentWeatherItem.innerHTML = `<div class="weather-item">
  <div>Humidity:</div>
  <div>${humidity}%</div>
</div>

<div class="weather-item">
  <div>Pressure:</div>
  <div>${pressure}</div>
</div>

<div class="weather-item">
  <div>Wind Speed:</div>
  <div>${wind_speed}</div>
</div>

<div class="weather-item">
 <div>Temperature:</div>
 <div>${temp}&#176;C</div>
</div>
<div class="weather-item">
 <div>Sunrise</div>
 <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
</div>
<div class="weather-item">
 <div>Sunrise</div>
 <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
</div>`;

  let otherDayForecast = '';

  data.daily.forEach((day, idx) => {
    if (idx === 0) {
      currentTempEl.innerHTML = `
      <img src="http://openweathermap.org/img/wn//${
        day.weather[0].icon
      }@2x.png" alt="weather icon" class="w-icon">
      <div class="other">
          <div class="day">${window.moment(day.dt * 1000).format('dddd')}</div>
          <div class="temp">Night - ${day.temp.night}&#176;C</div>
          <div class="temp">Day - ${day.temp.day}&#176;C</div>
      </div>
      
      `;
    } else {
      otherDayForecast += `
            <div class="weather-forecast-item">
                <div class="day">${window
                  .moment(day.dt * 1000)
                  .format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `;
    }
  });
  weatherForcastEl.innerHTML = otherDayForecast;
}
