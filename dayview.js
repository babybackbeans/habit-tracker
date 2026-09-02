function logButtonHtml(screenId, date) {
  let disabledClass = date === getToday() ? "" : " disabled";
  return "<button class='section-header-btn" + disabledClass + "' onclick=\"showScreen('" + screenId + "')\">Log</button>";
}

function renderDayView(date) {
  setHeaderTitle("day-view-header", formatHeaderDate(date));
  let box = document.getElementById("day-view-date-box");
  if (box) {
    box.innerHTML = "<p class='date-display'>" + formatFullDate(date) + "</p>";
  }
  let html = "";

  html += renderHabitGrid(date);
  html += renderEnergyMoodGrid(date);

  html += "<div class='health-section-header'><span>Health</span>" + logButtonHtml("health-screen", date) + "</div>";
  html += "<div class='health-card'>";
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

  html += "<button onclick=\"showAllNotes('" + date + "')\">View Notes</button>";

  document.getElementById("day-view-content").innerHTML = html;
}

function renderHabitGrid(date) {
  let html = "<div class='health-section-header'><span>Habits</span>" + logButtonHtml("habits-screen", date) + "</div>";
  html += "<div class='habit-grid'>";
  for (let i = 0; i < habits.length; i++) {
    let done = habits[i].history[date] === true;
    let checkedClass = done ? " checked" : "";
    let style = done ? " style='background-color:" + habits[i].color + "'" : "";
    html += "<div class='habit-grid-item" + checkedClass + "'" + style + ">" + habits[i].name + "</div>";
  }
  html += "</div>";
  return html;
}

function renderEnergyMoodGrid(date) {
  let energyValue = energyHistory[date];
  let moodValue = moodHistory[date];

  let html = "<div class='health-section-header'><span>Status</span>" + logButtonHtml("status-screen", date) + "</div>";
  html += "<div class='habit-grid energy-mood-grid'>";

  let energyDisplay = energyValue !== undefined ? energyValue : "—";
  let energyClass = energyValue !== undefined ? " checked" : "";
  let energyStyle = energyValue !== undefined ? " style='background-color:" + colorForEnergy(energyValue) + "'" : "";
  html += "<div class='habit-grid-item" + energyClass + "'" + energyStyle + "><span class='energy-mood-value'>" + energyDisplay + "</span><span class='energy-mood-label'>Energy</span></div>";

  let moodDisplay = moodValue !== undefined ? moodValue : "—";
  let moodClass = moodValue !== undefined ? " checked" : "";
  let moodStyle = moodValue !== undefined ? " style='background-color:" + colorForMood(moodValue) + "'" : "";
  html += "<div class='habit-grid-item" + moodClass + "'" + moodStyle + "><span class='energy-mood-value'>" + moodDisplay + "</span><span class='energy-mood-label'>Mood</span></div>";

  html += "</div>";
  return html;
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