import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startBtn = document.querySelector('button[data-start]');
const dateInput = document.querySelector('#datetime-picker');

const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const picked = selectedDates[0];
    if (!picked) {
      userSelectedDate = null;
      setStartButtonState(false);
      return;
    }

    if (picked.getTime() <= Date.now()) {
      userSelectedDate = null;
      setStartButtonState(false);
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      return;
    }
    userSelectedDate = picked;
    setStartButtonState(true);
  },
};

flatpickr(dateInput, options);
setStartButtonState(false);
startBtn.addEventListener('click', () => {
  if (!userSelectedDate) return;

  setStartButtonState(false);
  setInputState(false);

  if (timerId) return;
  updateDisplay(convertMs(userSelectedDate.getTime() - Date.now()));

  timerId = setInterval(() => {
    const diff = userSelectedDate.getTime() - Date.now();

    if (diff <= 0) {
      clearInterval(timerId);
      timerId = null;
      updateDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setInputState(true); 
      return;
    }

    updateDisplay(convertMs(diff));
  }, 1000);
});

function setStartButtonState(active) {
  startBtn.disabled = !active;
}

function setInputState(enabled) {
  dateInput.disabled = !enabled;
}

function updateDisplay({ days, hours, minutes, seconds }) {
  daysSpan.textContent = addLeadingZero(days);
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}