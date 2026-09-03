function logButtonHtml(screenId, date) {
  let disabledClass = date === getToday() ? "" : " disabled";
  return "<button class='section-header-btn" + disabledClass + "' onclick=\"showScreen('" + screenId + "')\">Log</button>";
}

let dayViewEditMode = false;
let dayViewEnergyEditingDate = null;
let dayViewMoodEditingDate = null;
let dayViewHealthPickerDate = null;
let currentDayViewDate = null;

function renderDayView(date) {
  currentDayViewDate = date;
  setHeaderTitle("day-view-header", formatHeaderDate(date));
  let box = document.getElementById("day-view-date-box");
  if (box) {
    let prevDate = offsetDateString(date, -1);
    let nextDate = offsetDateString(date, 1);
    let nextDisabled = date === getToday() ? " disabled" : "";
    let nextOnclick = date === getToday() ? "" : " onclick=\"renderDayView('" + nextDate + "')\"";
    box.innerHTML = "<button class='date-nav-arrow date-nav-prev' onclick=\"renderDayView('" + prevDate + "')\"></button>" +
      "<p class='date-display'>" + formatFullDate(date) + "</p>" +
      "<button class='date-nav-arrow date-nav-next" + nextDisabled + "'" + nextOnclick + "></button>";
  }
  let html = "";

  html += renderHabitGrid(date);
  html += renderEnergyMoodGrid(date);
  html += renderHealthSection(date);
  html += renderChecklistSection(date);

  document.getElementById("day-view-content").innerHTML = html;
  renderDayViewBottomNav(date);
}

function renderDayViewBottomNav(date) {
  let nav = document.getElementById("day-view-bottom-nav");
  if (!nav) return;
  let editClass = dayViewEditMode ? "active" : "";
  let html = "<button class='" + editClass + "' onclick=\"toggleDayViewEditMode('" + date + "')\">Edit</button>";
  html += "<button onclick=\"showAllNotes('" + date + "')\">View Notes</button>";
  nav.innerHTML = html;
}

function toggleDayViewEditMode(date) {
  dayViewEditMode = !dayViewEditMode;
  if (!dayViewEditMode) {
    dayViewEnergyEditingDate = null;
    dayViewMoodEditingDate = null;
    dayViewHealthPickerDate = null;
  }
  renderDayView(date);
}

function renderHabitGrid(date) {
  let html = "<div class='health-section-header'><span>Habits</span>" + logButtonHtml("habits-screen", date) + "</div>";
  html += "<div class='habit-grid'>";
  for (let i = 0; i < habits.length; i++) {
    let done = habits[i].history[date] === true;
    let checkedClass = done ? " checked" : "";
    let style = done ? " style='background-color:" + habits[i].color + "'" : "";
    let onclick = dayViewEditMode ? " onclick=\"toggleDayViewHabit(" + i + ", '" + date + "')\"" : "";
    html += "<div class='habit-grid-item" + checkedClass + "'" + style + onclick + ">" + habits[i].name + "</div>";
  }
  html += "</div>";
  return html;
}

function toggleDayViewHabit(index, date) {
  toggleHistoryItem(habits, index, date);
  renderDayView(date);
  renderHabits();
  saveState();
}

function renderEnergyMoodGrid(date) {
  let energyValue = energyHistory[date];
  let moodValue = moodHistory[date];

  let html = "<div class='health-section-header'><span>Status</span>" + logButtonHtml("status-screen", date) + "</div>";
  html += "<div class='habit-grid energy-mood-grid'>";

  if (dayViewEnergyEditingDate === date) {
    html += "<div class='habit-grid-item rating-editing'>" + renderRatingRow("energy", energyValue, date) + "</div>";
  } else {
    let energyDisplay = energyValue !== undefined ? energyValue : "—";
    let energyClass = energyValue !== undefined ? " checked" : "";
    let energyStyle = energyValue !== undefined ? " style='background-color:" + colorForEnergy(energyValue) + "'" : "";
    let onclick = dayViewEditMode ? " onclick=\"toggleDayViewEnergyEditing('" + date + "')\"" : "";
    html += "<div class='habit-grid-item" + energyClass + "'" + energyStyle + onclick + "><span class='energy-mood-value'>" + energyDisplay + "</span><span class='energy-mood-label'>Energy</span></div>";
  }

  if (dayViewMoodEditingDate === date) {
    html += "<div class='habit-grid-item rating-editing'>" + renderRatingRow("mood", moodValue, date) + "</div>";
  } else {
    let moodDisplay = moodValue !== undefined ? moodValue : "—";
    let moodClass = moodValue !== undefined ? " checked" : "";
    let moodStyle = moodValue !== undefined ? " style='background-color:" + colorForMood(moodValue) + "'" : "";
    let onclick = dayViewEditMode ? " onclick=\"toggleDayViewMoodEditing('" + date + "')\"" : "";
    html += "<div class='habit-grid-item" + moodClass + "'" + moodStyle + onclick + "><span class='energy-mood-value'>" + moodDisplay + "</span><span class='energy-mood-label'>Mood</span></div>";
  }

  html += "</div>";
  return html;
}

function toggleDayViewEnergyEditing(date) {
  dayViewEnergyEditingDate = dayViewEnergyEditingDate === date ? null : date;
  renderDayView(date);
}

function toggleDayViewMoodEditing(date) {
  dayViewMoodEditingDate = dayViewMoodEditingDate === date ? null : date;
  renderDayView(date);
}

function setDayViewEnergy(value, date) {
  energyHistory[date] = value;
  dayViewEnergyEditingDate = null;
  renderDayView(date);
  saveState();
}

function setDayViewMood(value, date) {
  moodHistory[date] = value;
  dayViewMoodEditingDate = null;
  renderDayView(date);
  saveState();
}

function renderHealthSection(date) {
  let html = "<div class='health-section-header'><span>Health</span>" + logButtonHtml("health-screen", date) + "</div>";

  let healthOnclick = dayViewEditMode ? " onclick=\"toggleDayViewHealthPicker('" + date + "')\"" : "";

  if (dayViewHealthPickerDate === date) {
    html += "<div class='health-card'" + healthOnclick + ">";
    html += "<div class='day-view-picker-columns'>";
    html += "<div class='symptom-bar-list'>";
    html += renderDayViewPickerItems(generalSymptoms, "generalSymptoms", date);
    html += renderDayViewPickerItems(generalMeds, "generalMeds", date);
    html += "</div>";
    html += "<div class='symptom-bar-list'>";
    html += renderDayViewPickerItems(menstrualSymptoms, "menstrualSymptoms", date);
    html += renderDayViewPickerItems(menstrualMeds, "menstrualMeds", date);
    html += "</div>";
    html += "</div>";
    html += "</div>";
    return html;
  }

  html += "<div class='health-card'" + healthOnclick + ">";
  html += "<div class='health-half'>";
  for (let i = 0; i < generalSymptoms.length; i++) {
    if (generalSymptoms[i].history[date] === true) {
      html += "<p>" + generalSymptoms[i].name + "</p>";
    }
  }
  html += "<div class='health-hr'></div>";
  for (let i = 0; i < generalMeds.length; i++) {
    if (generalMeds[i].history[date] === true) {
      html += "<p>" + generalMeds[i].name + "</p>";
    }
  }
  html += "</div>";
  html += "<div class='health-divider'></div>";
  html += "<div class='health-half'>";
  for (let i = 0; i < menstrualSymptoms.length; i++) {
    if (menstrualSymptoms[i].history[date] === true) {
      html += "<p>" + menstrualSymptoms[i].name + "</p>";
    }
  }
  html += "<div class='health-hr'></div>";
  for (let i = 0; i < menstrualMeds.length; i++) {
    if (menstrualMeds[i].history[date] === true) {
      html += "<p>" + menstrualMeds[i].name + "</p>";
    }
  }
  html += "</div>";
  html += "</div>";

  return html;
}

function renderDayViewPickerItems(items, arrayKey, date) {
  let html = "";
  for (let i = 0; i < items.length; i++) {
    let active = items[i].history[date] === true;
    let checkedClass = active ? " checked" : "";
    html += "<div class='symptom-bar" + checkedClass + "' style='background-color:" + items[i].color + "' onclick=\"event.stopPropagation(); toggleDayViewHealthItem('" + arrayKey + "', " + i + ", '" + date + "')\">" + items[i].name + "</div>";
  }
  return html;
}

function toggleDayViewHealthPicker(date) {
  dayViewHealthPickerDate = dayViewHealthPickerDate === date ? null : date;
  renderDayView(date);
}

function toggleDayViewHealthItem(arrayKey, index, date) {
  let arrays = {
    generalSymptoms: generalSymptoms,
    generalMeds: generalMeds,
    menstrualSymptoms: menstrualSymptoms,
    menstrualMeds: menstrualMeds
  };
  toggleHistoryItem(arrays[arrayKey], index, date);
  renderDayView(date);
  saveState();
}

function attachDayViewSwipeListener() {
  let wrapper = document.querySelector('[data-screen="day-view-screen"]');
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
    if (startX === null || !currentDayViewDate) return;
    let touch = e.changedTouches[0];
    let dx = touch.clientX - startX;
    let dy = touch.clientY - startY;
    startX = null;
    startY = null;

    let minSwipeDistance = 50;
    if (Math.abs(dx) < minSwipeDistance || Math.abs(dx) < Math.abs(dy) * 1.5) return;

    if (dx < 0) {
      if (currentDayViewDate !== getToday()) {
        renderDayView(offsetDateString(currentDayViewDate, 1));
      }
    } else {
      renderDayView(offsetDateString(currentDayViewDate, -1));
    }
  }, { passive: true });
}

function showAllNotes(date) {
  let combined = "";

  let mood = moodNotesHistory[date];
  if (mood && mood.trim() !== "") {
    combined += "Mood: " + mood + "\n\n";
  }

  let energy = energyNotesHistory[date];
  if (energy && energy.trim() !== "") {
    combined += "Energy: " + energy + "\n\n";
  }

  let general = generalNotesHistory[date];
  if (general && general.trim() !== "") {
    combined += "General: " + general + "\n\n";
  }

  let menstrual = menstrualNotesHistory[date];
  if (menstrual && menstrual.trim() !== "") {
    combined += "Menstrual: " + menstrual + "\n\n";
  }

  if (combined === "") {
    alert("No notes for this day.");
  } else {
    alert(combined.trim());
  }
}