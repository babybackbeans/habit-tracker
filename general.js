let generalSymptomsHistory = {};
let generalSymptoms = [];
let generalMedsHistory = {};
let generalMeds = [];
let generalNotesHistory = {};

function setGeneralNotes(text) {
  let today = currentLogDate;
  generalNotesHistory[today] = text;
  saveState();
}

function setGeneralYesNo(value) {
  let today = currentLogDate;
  generalSymptomsHistory[today] = value;
  renderGeneralSection();
  saveState();
}

function setGeneralMeds(value) {
  let today = currentLogDate;
  generalMedsHistory[today] = value;
  renderGeneralSection();
  saveState();
}

function addGeneralSymptomItem(name) {
  addHistoryItem(generalSymptoms, name);
  renderGeneralSection();
  saveState();
}
function toggleGeneralSymptomItem(index) {
  toggleHistoryItem(generalSymptoms, index);
  renderGeneralSection();
  saveState();
}
function editGeneralSymptomItem(index) {
  editItem(generalSymptoms, index);
  renderGeneralSection();
  saveState();
}
function removeGeneralSymptomItem(index) {
  removeItem(generalSymptoms, index);
  renderGeneralSection();
  saveState();
}

function addGeneralMedItem(name) {
  addHistoryItem(generalMeds, name);
  renderGeneralSection();
  saveState();
}
function toggleGeneralMedItem(index) {
  toggleHistoryItem(generalMeds, index);
  renderGeneralSection();
  saveState();
}
function editGeneralMedItem(index) {
  editItem(generalMeds, index);
  renderGeneralSection();
  saveState();
}
function removeGeneralMedItem(index) {
  removeItem(generalMeds, index);
  renderGeneralSection();
  saveState();
}

function renderGeneralSection() {
  renderHealthHeader();
  let today = currentLogDate;
  let symptomsToday = generalSymptomsHistory[today];
  let medsToday = generalMedsHistory[today];
  let notesToday = generalNotesHistory[today];
  if (!notesToday) { notesToday = ""; }

  let html = "<h2>Symptoms</h2>";
  html += "<textarea class='notes-box' oninput='setGeneralNotes(this.value)'>" + notesToday + "</textarea>";
  html += "<div class='button-row'>";
  html += "<button onclick='setGeneralYesNo(true)'>Yes</button>";
  html += "<button onclick='setGeneralYesNo(false)'>No</button>";
  html += "</div>";

  if (symptomsToday === true) {
    html += "<div class='scroll-box'>";
    html += renderHistoryChecklist(generalSymptoms, "addGeneralSymptomItem", "toggleGeneralSymptomItem", "editGeneralSymptomItem", "removeGeneralSymptomItem", "new-general-symptom");
    html += "</div>";

    html += "<p>Take meds?</p>";
    html += "<div class='button-row'>";
    html += "<button onclick='setGeneralMeds(true)'>Yes</button>";
    html += "<button onclick='setGeneralMeds(false)'>No</button>";
    html += "</div>";

    if (medsToday === true) {
      html += "<div class='scroll-box'>";
      html += renderHistoryChecklist(generalMeds, "addGeneralMedItem", "toggleGeneralMedItem", "editGeneralMedItem", "removeGeneralMedItem", "new-general-med");
      html += "</div>";
    }
  }

  document.getElementById("general-section").innerHTML = html;
}