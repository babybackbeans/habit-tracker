let moodHistory = {};
let moodNotesHistory = {};

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


function renderMood() {
  let today = currentLogDate;
  let todayMood = moodHistory[today];
  let todayNotes = moodNotesHistory[today];
  if (!todayNotes) { todayNotes = ""; }
  let html = "<h2>Mood</h2>";
  html += renderRatingRow("mood", todayMood);
  html += "<textarea class='notes-box' oninput='setMoodNotes(this.value)'>" + todayNotes + "</textarea>";
  document.getElementById("mood-section").innerHTML = html;
}


let energyHistory = {};
let energyNotesHistory = {};

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
setHeaderTitle("status-header", formatDateDisplay(currentLogDate));
  let today = currentLogDate;
  let todayEnergy = energyHistory[today];
  let todayNotes = energyNotesHistory[today];
  if (!todayNotes) { todayNotes = ""; }
  let html = "<h2>Energy</h2>";
  html += renderRatingRow("energy", todayEnergy);
  html += "<textarea class='notes-box' oninput='setEnergyNotes(this.value)'>" + todayNotes + "</textarea>";
  document.getElementById("energy-section").innerHTML = html;
}
