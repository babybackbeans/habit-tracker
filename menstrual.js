let menstrualSymptomsHistory = {};
let menstrualSymptoms = [];
let menstrualMedsHistory = {};
let menstrualMeds = [];
let menstrualNotesHistory = {};

function setMenstrualNotes(text) {
  let today = currentLogDate;
  menstrualNotesHistory[today] = text;
  saveState();
}

function setMenstrualYesNo(value) {
  let today = currentLogDate;
  menstrualSymptomsHistory[today] = value;
  renderMenstrualSection();
  saveState();
}

function setMenstrualMeds(value) {
  let today = currentLogDate;
  menstrualMedsHistory[today] = value;
  renderMenstrualSection();
  saveState();
}

function addMenstrualSymptomItem(name) {
  addHistoryItem(menstrualSymptoms, name);
  renderMenstrualSection();
  saveState();
}
function toggleMenstrualSymptomItem(index) {
  toggleHistoryItem(menstrualSymptoms, index);
  renderMenstrualSection();
  saveState();
}
function editMenstrualSymptomItem(index) {
  editItem(menstrualSymptoms, index);
  renderMenstrualSection();
  saveState();
}
function removeMenstrualSymptomItem(index) {
  removeItem(menstrualSymptoms, index);
  renderMenstrualSection();
  saveState();
}

function addMenstrualMedItem(name) {
  addHistoryItem(menstrualMeds, name);
  renderMenstrualSection();
  saveState();
}
function toggleMenstrualMedItem(index) {
  toggleHistoryItem(menstrualMeds, index);
  renderMenstrualSection();
  saveState();
}
function editMenstrualMedItem(index) {
  editItem(menstrualMeds, index);
  renderMenstrualSection();
  saveState();
}
function removeMenstrualMedItem(index) {
  removeItem(menstrualMeds, index);
  renderMenstrualSection();
  saveState();
}

function renderMenstrualSection() {
  renderHealthHeader();
  let today = currentLogDate;
  let symptomsToday = menstrualSymptomsHistory[today];
  let medsToday = menstrualMedsHistory[today];
  let notesToday = menstrualNotesHistory[today];
  if (!notesToday) { notesToday = ""; }

  let html = "<h2>Menstrual</h2>";
  html += "<textarea class='notes-box' oninput='setMenstrualNotes(this.value)'>" + notesToday + "</textarea>";
  html += "<div class='button-row'>";
  html += "<button onclick='setMenstrualYesNo(true)'>Yes</button>";
  html += "<button onclick='setMenstrualYesNo(false)'>No</button>";
  html += "</div>";

  if (symptomsToday === true) {
    html += "<div class='scroll-box'>";
    html += renderHistoryChecklist(menstrualSymptoms, "addMenstrualSymptomItem", "toggleMenstrualSymptomItem", "editMenstrualSymptomItem", "removeMenstrualSymptomItem", "new-menstrual-symptom");
    html += "</div>";

    html += "<p>Take meds?</p>";
    html += "<div class='button-row'>";
    html += "<button onclick='setMenstrualMeds(true)'>Yes</button>";
    html += "<button onclick='setMenstrualMeds(false)'>No</button>";
    html += "</div>";

    if (medsToday === true) {
      html += "<div class='scroll-box'>";
      html += renderHistoryChecklist(menstrualMeds, "addMenstrualMedItem", "toggleMenstrualMedItem", "editMenstrualMedItem", "removeMenstrualMedItem", "new-menstrual-med");
      html += "</div>";
    }
  }

  document.getElementById("menstrual-section").innerHTML = html;
}