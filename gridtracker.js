function startOfWeekDate(dateString) {
  let parts = dateString.split("-");
  let dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  dateObj.setDate(dateObj.getDate() - dateObj.getDay());
  let year = dateObj.getFullYear();
  let month = String(dateObj.getMonth() + 1).padStart(2, "0");
  let day = String(dateObj.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function formatShortDate(dateString) {
  let parts = dateString.split("-");
  let month = parseInt(parts[1]);
  let day = parseInt(parts[2]);
  let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return monthNames[month - 1] + " " + day;
}

let gridWeekStart = null;

function renderGrid(weekStart) {
  if (!weekStart) {
    weekStart = startOfWeekDate(getToday());
  }
  gridWeekStart = weekStart;

  let box = document.getElementById("grid-week-box");
  if (box) {
    let prevWeek = offsetDateString(weekStart, -7);
    let nextWeek = offsetDateString(weekStart, 7);
    let isCurrentWeek = weekStart === startOfWeekDate(getToday());
    let nextDisabled = isCurrentWeek ? " disabled" : "";
    let nextOnclick = isCurrentWeek ? "" : " onclick=\"renderGrid('" + nextWeek + "')\"";
    box.innerHTML = "<button class='date-nav-arrow date-nav-prev' onclick=\"renderGrid('" + prevWeek + "')\"></button>" +
      "<p class='date-display'>Week of " + formatShortDate(weekStart) + "</p>" +
      "<button class='date-nav-arrow date-nav-next" + nextDisabled + "'" + nextOnclick + "></button>";
  }

  try {
    document.getElementById("grid-content").innerHTML = renderGridTable(weekStart);
    sizeGridSquares();
    fitGridLabels();
  } catch (err) {
    document.getElementById("grid-content").innerHTML = "<p style='padding:1rem;color:#DA797D;'>Grid error: " + err.message + "</p>";
  }
}

function sizeGridSquares() {
  let table = document.querySelector("#grid-content .grid-table");
  if (!table) return;
  let dayCell = table.querySelector(".grid-day-cell, .grid-day-header");
  if (!dayCell) return;
  let width = dayCell.getBoundingClientRect().width;
  if (width > 0) {
    table.style.setProperty("--grid-row-height", (width * 1.7) + "px");
  }
}

function fitGridLabels() {
  let cells = document.querySelectorAll("#grid-content .grid-label-cell:not(.grid-header-cell)");
  for (let i = 0; i < cells.length; i++) {
    let cell = cells[i];
    let fontSize = 0.7;
    cell.style.fontSize = fontSize + "rem";
    let guard = 0;
    while ((cell.scrollHeight > cell.clientHeight + 1 || cell.scrollWidth > cell.clientWidth + 1) && fontSize > 0.4 && guard < 20) {
      fontSize -= 0.05;
      cell.style.fontSize = fontSize + "rem";
      guard++;
    }
  }
}

window.addEventListener("resize", function() {
  let wrapper = document.querySelector('[data-screen="grid-screen"]');
  if (wrapper && wrapper.style.display === "block") {
    sizeGridSquares();
    fitGridLabels();
  }
});

function renderGridTable(weekStart) {
  let weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let today = getToday();

  let html = "<div class='grid-table'>";

  html += "<div class='grid-label-cell grid-header-cell'></div>";
  for (let i = 0; i < 7; i++) {
    html += "<div class='grid-day-header grid-header-cell'>" + weekdayNames[i] + "</div>";
  }

  for (let h = 0; h < habits.length; h++) {
    let history = habits[h].history || {};
    let color = habits[h].color || "#888774";
    let name = habits[h].name || "";
    html += "<div class='grid-label-cell' onclick=\"renderTracker(" + h + "); showScreen('tracker-screen')\">" + name + "</div>";
    for (let i = 0; i < 7; i++) {
      let dateString = offsetDateString(weekStart, i);
      let done = history[dateString] === true;
      let futureClass = dateString > today ? " future-day" : "";
      let shape = done ? "<div class='grid-day-shape' style='background-color:" + color + "'></div>" : "";
      html += "<div class='grid-day-cell" + futureClass + "'>" + shape + "</div>";
    }
  }
  html += "</div>";
  return html;
}

function attachGridSwipeListener() {
  let wrapper = document.querySelector('[data-screen="grid-screen"]');
  let container = wrapper ? wrapper.querySelector(".screen-content") : null;
  if (!container) return;

  let startX = null;
  let startY = null;

  container.addEventListener("touchstart", function(e) {
    if (e.touches.length === 1) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }
  }, { passive: true });

  container.addEventListener("touchend", function(e) {
    if (startX === null || !gridWeekStart) return;
    let touch = e.changedTouches[0];
    let dx = touch.clientX - startX;
    let dy = touch.clientY - startY;
    startX = null;
    startY = null;

    let minSwipeDistance = 50;
    if (Math.abs(dx) < minSwipeDistance || Math.abs(dx) < Math.abs(dy) * 1.5) return;

    if (dx < 0) {
      if (gridWeekStart !== startOfWeekDate(getToday())) {
        renderGrid(offsetDateString(gridWeekStart, 7));
      }
    } else {
      renderGrid(offsetDateString(gridWeekStart, -7));
    }
  }, { passive: true });
}

let trackerHabitIndex = 0;
let trackerMonths = [];
let trackerScrollHandler = null;
let trackerLoadingMonth = false;
let trackerScrollSettleTimer = null;

function trackerMonthKey(year, month) {
  return "tracker-month-" + year + "-" + month;
}

function renderTrackerMonthBlock(year, month) {
  let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let firstDay = new Date(year, month, 1);
  let daysInMonth = new Date(year, month + 1, 0).getDate();
  let startWeekday = firstDay.getDay();

  let html = "<div class='calendar-month-block' id='" + trackerMonthKey(year, month) + "'>";
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
      html += "<div class='calendar-day tracker-day' data-date='" + dateString + "' onclick=\"renderDayView('" + dateString + "'); showScreen('day-view-screen')\">" + day + "</div>";
    }
  }

  html += "</div>";
  html += "</div>";
  return html;
}

function renderTracker(habitIndex) {
  let box = document.getElementById("tracker-habit-box");

  if (!habits || habits.length === 0) {
    if (box) {
      box.innerHTML = "<p class='date-display'>No habits yet</p>";
    }
    document.getElementById("tracker-content").innerHTML = "";
    return;
  }

  if (habitIndex < 0) habitIndex = habits.length - 1;
  if (habitIndex >= habits.length) habitIndex = 0;
  trackerHabitIndex = habitIndex;

  if (box) {
    box.innerHTML = "<button class='date-nav-arrow date-nav-prev' onclick=\"renderTracker(" + (habitIndex - 1) + ")\"></button>" +
      "<p class='date-display'>" + habits[habitIndex].name + "</p>" +
      "<button class='date-nav-arrow date-nav-next' onclick=\"renderTracker(" + (habitIndex + 1) + ")\"></button>";
  }

  let today = new Date();
  let center = normalizeMonth(today.getFullYear(), today.getMonth());
  trackerMonths = [];
  for (let i = -24; i <= 2; i++) {
    trackerMonths.push(normalizeMonth(center.year, center.month + i));
  }

  let html = "";
  for (let i = 0; i < trackerMonths.length; i++) {
    html += renderTrackerMonthBlock(trackerMonths[i].year, trackerMonths[i].month);
  }
  document.getElementById("tracker-content").innerHTML = html;
  applyTrackerColors();
  attachTrackerScrollListener();

  setTimeout(function() {
    let el = document.getElementById(trackerMonthKey(center.year, center.month));
    if (el) {
      el.scrollIntoView({ block: "start" });
    }
  }, 100);
}

function applyTrackerColors() {
  if (!habits[trackerHabitIndex]) return;
  let habit = habits[trackerHabitIndex];
  let cells = document.getElementsByClassName("tracker-day");
  for (let i = 0; i < cells.length; i++) {
    let date = cells[i].getAttribute("data-date");
    let done = habit.history[date] === true;
    cells[i].style.backgroundColor = done ? habit.color : "transparent";
  }
}

function getTrackerScrollParent() {
  let content = document.getElementById("tracker-content");
  return content ? content.closest(".screen-content") : null;
}

function appendTrackerMonth() {
  let last = trackerMonths[trackerMonths.length - 1];
  let newMonth = normalizeMonth(last.year, last.month + 1);
  trackerMonths.push(newMonth);

  let container = document.getElementById("tracker-content");
  let wrapper = document.createElement("div");
  wrapper.innerHTML = renderTrackerMonthBlock(newMonth.year, newMonth.month);
  container.appendChild(wrapper.firstChild);
  applyTrackerColors();
}

function attachTrackerScrollListener() {
  let scrollParent = getTrackerScrollParent();
  if (!scrollParent) return;
  if (trackerScrollHandler) {
    scrollParent.removeEventListener("scroll", trackerScrollHandler);
  }
  trackerScrollHandler = function() {
    clearTimeout(trackerScrollSettleTimer);
    trackerScrollSettleTimer = setTimeout(function() {
      checkTrackerScrollEdges(scrollParent);
    }, 150);
  };
  scrollParent.addEventListener("scroll", trackerScrollHandler);
}

function checkTrackerScrollEdges(scrollParent) {
  if (trackerLoadingMonth) return;
  let threshold = 400;
  if (scrollParent.scrollTop + scrollParent.clientHeight > scrollParent.scrollHeight - threshold) {
    trackerLoadingMonth = true;
    appendTrackerMonth();
    trackerLoadingMonth = false;
  }
}

function attachTrackerSwipeListener() {
  let wrapper = document.querySelector('[data-screen="tracker-screen"]');
  let container = wrapper ? wrapper.querySelector(".screen-content") : null;
  if (!container) return;

  let startX = null;
  let startY = null;

  container.addEventListener("touchstart", function(e) {
    if (e.touches.length === 1) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }
  }, { passive: true });

  container.addEventListener("touchend", function(e) {
    if (startX === null || !habits || habits.length === 0) return;
    let touch = e.changedTouches[0];
    let dx = touch.clientX - startX;
    let dy = touch.clientY - startY;
    startX = null;
    startY = null;

    let minSwipeDistance = 50;
    if (Math.abs(dx) < minSwipeDistance || Math.abs(dx) < Math.abs(dy) * 1.5) return;

    if (dx < 0) {
      renderTracker(trackerHabitIndex + 1);
    } else {
      renderTracker(trackerHabitIndex - 1);
    }
  }, { passive: true });
}
