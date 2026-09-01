let moodHistory = {};
let moodNotesHistory = {};
let energyHistory = {};
let energyNotesHistory = {};

function setMood(value) {
  let today = currentLogDate;
  moodHistory[today] = value;
  renderMood();
  saveState();
}

function setMoodNotes(text) {
  let today = currentLogDate;
  moodNotesHistory[today] = text;
  saveState();
}

function setEnergy(value) {
  let today = currentLogDate;
  energyHistory[today] = value;
  renderEnergy();
  saveState();
}

function setEnergyNotes(text) {
  let today = currentLogDate;
  energyNotesHistory[today] = text;
  saveState();
}

function renderEnergy() {
  setHeaderTitle("status-header", "Status");
  document.querySelector(".empty-box").innerHTML = "<p class='date-display'>" + formatFullDate(currentLogDate) + "</p>";
  let today = currentLogDate;
  let todayEnergy = energyHistory[today];
  let todayNotes = energyNotesHistory[today];
  if (!todayNotes) { todayNotes = ""; }
  let html = "<div class='journal-section'>";
  html += "<p class='journal-label'>Energy</p>";
  html += renderRatingRow("energy", todayEnergy);
  html += "<textarea class='journal-notes' placeholder='Tap to add notes...' oninput='setEnergyNotes(this.value)'>" + todayNotes + "</textarea>";
  html += "</div>";
  document.getElementById("energy-section").innerHTML = html;
}
function renderMood() {
  let today = currentLogDate;
  let todayMood = moodHistory[today];
  let todayNotes = moodNotesHistory[today];
  if (!todayNotes) { todayNotes = ""; }
  let html = "<div class='journal-section'>";
  html += "<p class='journal-label'>Mood</p>";
  html += renderRatingRow("mood", todayMood);
  html += "<textarea class='journal-notes' placeholder='Tap to add notes...' oninput='setMoodNotes(this.value)'>" + todayNotes + "</textarea>";
  html += "</div>";
  document.getElementById("mood-section").innerHTML = html;
}