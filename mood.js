let moodHistory = {};
let moodNotesHistory = {};

function setMood(value) {
  let today = getToday();
  moodHistory[today] = value;
  renderMood();
  saveState();
}

function setMoodNotes(text) {
  let today = getToday();
  moodNotesHistory[today] = text;
  saveState();
}

function renderMood() {
  let today = getToday();
  let todayMood = moodHistory[today];
  let todayNotes = moodNotesHistory[today];
  if (!todayNotes) { todayNotes = ""; }
  document.getElementById("mood-display").innerHTML =
    "Mood: " + todayMood +
    "<br><textarea oninput='setMoodNotes(this.value)'>" + todayNotes + "</textarea>";
}

function renderMoodButtons() {
  let buttonsHtml = "";
  for (let i = 1; i <= 5; i++) {
    buttonsHtml += "<button onclick='setMood(" + i + ")'>" + i + "</button>";
  }
  document.getElementById("mood-buttons").innerHTML = buttonsHtml;
}

let energyHistory = {};
let energyNotesHistory = {};

function setEnergy(value) {
  let today = getToday();
  energyHistory[today] = value;
  renderEnergy();
  saveState();
}

function setEnergyNotes(text) {
  let today = getToday();
  energyNotesHistory[today] = text;
  saveState();
}

function renderEnergy() {
  let today = getToday();
  let todayEnergy = energyHistory[today];
  let todayNotes = energyNotesHistory[today];
  if (!todayNotes) { todayNotes = ""; }
  document.getElementById("energy-display").innerHTML =
    "Energy: " + todayEnergy +
    "<br><textarea oninput='setEnergyNotes(this.value)'>" + todayNotes + "</textarea>";
}

function renderEnergyButtons() {
  let buttonsHtml = "";
  for (let i = 1; i <= 5; i++) {
    buttonsHtml += "<button onclick='setEnergy(" + i + ")'>" + i + "</button>";
  }
  document.getElementById("energy-buttons").innerHTML = buttonsHtml;
}