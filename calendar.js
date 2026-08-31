let calendarYear = new Date().getFullYear();
let calendarMonth = new Date().getMonth();
let calendarMode = "energy";

function colorForMood(value) {
  if (value === 5) return "#DA797D";
  if (value === 4) return "#C1878B";
  if (value === 3) return "#B19AA1";
  if (value === 2) return "#90959B";
  if (value === 1) return "#788281";
  return "transparent";
}

function colorForEnergy(value) {
  if (value === 5) return "#DA8356";
  if (value === 4) return "#DA9C51";
  if (value === 3) return "#BC986C";
  if (value === 2) return "#888774";
  if (value === 1) return "#868D6D";
  return "transparent";
}

function setCalendarMode(mode) {
  calendarMode = mode;
  applyCalendarColors();
}

function renderCalendar() {
  renderCalendarGrid();
  applyCalendarColors();
}

function renderCalendarGrid() {
  let firstDay = new Date(calendarYear, calendarMonth, 1);
  let daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  let startWeekday = firstDay.getDay();

  let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  let html = "<div class='calendar-controls'>";
  html += "<button onclick='previousMonth()'>‹</button>";
  html += "<div class='mode-toggle'>";
  html += "<button onclick=\"setCalendarMode('energy')\">Energy</button>";
  html += "<button onclick=\"setCalendarMode('mood')\">Mood</button>";
  html += "</div>";
  html += "<button onclick='nextMonth()'>›</button>";
  html += "</div>";

  html += "<h2>" + monthNames[calendarMonth] + " " + calendarYear + "</h2>";

  html += "<div class='calendar-grid'>";

  for (let i = 0; i < startWeekday; i++) {
    html += "<div></div>";
  }

  for (let day = 1; day <= daysInMonth; day++) {
  let month = String(calendarMonth + 1).padStart(2, "0");
  let dayStr = String(day).padStart(2, "0");
  let dateString = calendarYear + "-" + month + "-" + dayStr;

  if (dateString > getToday()) {
    html += "<div class='calendar-day future-day' data-date='" + dateString + "'>" + day + "</div>";
  } else {
    html += "<div class='calendar-day' data-date='" + dateString + "' onclick=\"renderDayView('" + dateString + "'); showScreen('day-view-screen')\">" + day + "</div>";
  }
}

  html += "</div>";

  document.getElementById("calendar-content").innerHTML = html;
}

function applyCalendarColors() {
  let cells = document.getElementsByClassName("calendar-day");
  for (let i = 0; i < cells.length; i++) {
    let date = cells[i].getAttribute("data-date");
    let color;
    if (calendarMode === "mood") {
      color = colorForMood(moodHistory[date]);
    } else {
      color = colorForEnergy(energyHistory[date]);
    }
    cells[i].style.backgroundColor = color;
  }
}

function nextMonth() {
  calendarMonth = calendarMonth + 1;
  if (calendarMonth > 11) {
    calendarMonth = 0;
    calendarYear = calendarYear + 1;
  }
  renderCalendar();
}

function previousMonth() {
  calendarMonth = calendarMonth - 1;
  if (calendarMonth < 0) {
    calendarMonth = 11;
    calendarYear = calendarYear - 1;
  }
  renderCalendar();
}