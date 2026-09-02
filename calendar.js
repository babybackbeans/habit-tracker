let calendarMonths = [];
let calendarMode = "energy";
let calendarScrollHandler = null;

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
  renderCalendarBottomNav();
}

function renderCalendarBottomNav() {
  let nav = document.getElementById("calendar-bottom-nav");
  if (!nav) return;
  let energyClass = calendarMode === "energy" ? "active" : "";
  let moodClass = calendarMode === "mood" ? "active" : "";
  let html = "<button class='" + energyClass + "' onclick=\"setCalendarMode('energy')\">Energy</button>";
  html += "<button class='" + moodClass + "' onclick=\"setCalendarMode('mood')\">Mood</button>";
  nav.innerHTML = html;
}

function normalizeMonth(year, month) {
  while (month < 0) {
    month += 12;
    year -= 1;
  }
  while (month > 11) {
    month -= 12;
    year += 1;
  }
  return { year: year, month: month };
}

function monthKey(year, month) {
  return "calendar-month-" + year + "-" + month;
}

function isMonthRendered(year, month) {
  for (let i = 0; i < calendarMonths.length; i++) {
    if (calendarMonths[i].year === year && calendarMonths[i].month === month) {
      return true;
    }
  }
  return false;
}

function renderMonthBlock(year, month) {
  let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let firstDay = new Date(year, month, 1);
  let daysInMonth = new Date(year, month + 1, 0).getDate();
  let startWeekday = firstDay.getDay();

  let html = "<div class='calendar-month-block' id='" + monthKey(year, month) + "'>";
  html += "<div class='health-section-header'><span>" + monthNames[month] + " " + year + "</span></div>";
  html += "<div class='calendar-grid'>";

  for (let i = 0; i < startWeekday; i++) {
    html += "<div></div>";
  }

  for (let day = 1; day <= daysInMonth; day++) {
    let monthStr = String(month + 1).padStart(2, "0");
    let dayStr = String(day).padStart(2, "0");
    let dateString = year + "-" + monthStr + "-" + dayStr;

    if (dateString > getToday()) {
      html += "<div class='calendar-day future-day' data-date='" + dateString + "'>" + day + "</div>";
    } else {
      html += "<div class='calendar-day' data-date='" + dateString + "' onclick=\"renderDayView('" + dateString + "'); showScreen('day-view-screen')\">" + day + "</div>";
    }
  }

  html += "</div>";
  html += "</div>";
  return html;
}

function renderCalendar() {
  let box = document.getElementById("calendar-date-box");
  if (box) {
    box.innerHTML = "<p class='date-display'>" + formatFullDate(getToday()) + "</p>";
    box.onclick = snapToCurrentMonth;
  }

  let today = new Date();
  let center = normalizeMonth(today.getFullYear(), today.getMonth());
  calendarMonths = [];
  for (let i = -24; i <= 2; i++) {
    calendarMonths.push(normalizeMonth(center.year, center.month + i));
  }

  let html = "";
  for (let i = 0; i < calendarMonths.length; i++) {
    html += renderMonthBlock(calendarMonths[i].year, calendarMonths[i].month);
  }
  document.getElementById("calendar-content").innerHTML = html;
  applyCalendarColors();
  renderCalendarBottomNav();
  attachCalendarScrollListener();

  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      let el = document.getElementById(monthKey(center.year, center.month));
      if (el) {
        el.scrollIntoView({ block: "start" });
      }
    });
  });
}

function getCalendarScrollParent() {
  let content = document.getElementById("calendar-content");
  return content ? content.closest(".screen-content") : null;
}

function prependMonth() {
  let first = calendarMonths[0];
  let newMonth = normalizeMonth(first.year, first.month - 1);
  calendarMonths.unshift(newMonth);

  let container = document.getElementById("calendar-content");
  let wrapper = document.createElement("div");
  wrapper.innerHTML = renderMonthBlock(newMonth.year, newMonth.month);
  let newEl = wrapper.firstChild;

  let scrollParent = getCalendarScrollParent();
  let prevScrollHeight = scrollParent ? scrollParent.scrollHeight : 0;
  container.insertBefore(newEl, container.firstChild);
  if (scrollParent) {
    scrollParent.scrollTop += (scrollParent.scrollHeight - prevScrollHeight);
  }
  applyCalendarColors();
}

function appendMonth() {
  let last = calendarMonths[calendarMonths.length - 1];
  let newMonth = normalizeMonth(last.year, last.month + 1);
  calendarMonths.push(newMonth);

  let container = document.getElementById("calendar-content");
  let wrapper = document.createElement("div");
  wrapper.innerHTML = renderMonthBlock(newMonth.year, newMonth.month);
  container.appendChild(wrapper.firstChild);
  applyCalendarColors();
}

let calendarLoadingMonth = false;
let calendarScrollSettleTimer = null;

function attachCalendarScrollListener() {
  let scrollParent = getCalendarScrollParent();
  if (!scrollParent) return;
  if (calendarScrollHandler) {
    scrollParent.removeEventListener("scroll", calendarScrollHandler);
  }
  calendarScrollHandler = function() {
    clearTimeout(calendarScrollSettleTimer);
    calendarScrollSettleTimer = setTimeout(function() {
      checkCalendarScrollEdges(scrollParent);
    }, 150);
  };
  scrollParent.addEventListener("scroll", calendarScrollHandler);
}

function checkCalendarScrollEdges(scrollParent) {
  if (calendarLoadingMonth) return;
  let threshold = 400;
  if (scrollParent.scrollTop + scrollParent.clientHeight > scrollParent.scrollHeight - threshold) {
    calendarLoadingMonth = true;
    appendMonth();
    calendarLoadingMonth = false;
  }
}

function scrollToMonth(year, month, direction) {
  let guard = 0;
  while (!isMonthRendered(year, month) && guard < 24) {
    if (direction >= 0) {
      appendMonth();
    } else {
      prependMonth();
    }
    guard++;
  }
  let el = document.getElementById(monthKey(year, month));
  if (el) {
    el.scrollIntoView({ block: "start", behavior: "smooth" });
  }
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

function snapToCurrentMonth() {
  let today = new Date();
  let target = normalizeMonth(today.getFullYear(), today.getMonth());
  let direction = 1;
  if (calendarMonths.length > 0) {
    let first = calendarMonths[0];
    let targetIndex = target.year * 12 + target.month;
    let firstIndex = first.year * 12 + first.month;
    if (targetIndex < firstIndex) {
      direction = -1;
    }
  }
  scrollToMonth(target.year, target.month, direction);
}
