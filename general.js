let generalSymptomsHistory = {};
let generalSymptoms = [];
let generalMedsHistory = {};
let generalMeds = [];
let generalNotesHistory = {};
let generalMedsExpanded = false;
let generalSymptomsAddOpen = false;
let generalMedsAddOpen = false;

function setGeneralNotes(text) {
  let today = currentLogDate;
  generalNotesHistory[today] = text;
  saveState();
}

function toggleGeneralMedsExpanded() {
  generalMedsExpanded = !generalMedsExpanded;
  renderGeneralSection();
}

function toggleGeneralSymptomsAddOpen() {
  generalSymptomsAddOpen = !generalSymptomsAddOpen;
  renderGeneralSection();
}

function toggleGeneralMedsAddOpen() {
  generalMedsAddOpen = !generalMedsAddOpen;
  renderGeneralSection();
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
  let notesToday = generalNotesHistory[today];
  if (!notesToday) { notesToday = ""; }

  let html = "<div class='health-section'>";

  html += "<div class='health-section-header'>";
  html += "<span>Symptoms</span>";
  html += "<button class='add-toggle-btn' onclick='toggleGeneralSymptomsAddOpen()'>+</button>";
  html += "</div>";

  if (generalSymptomsAddOpen) {
    html += "<div class='add-input-row'>";
    html += "<input type='text' id='new-general-symptom'>";
    html += "<button onclick=\"addGeneralSymptomItem(document.getElementById('new-general-symptom').value)\">Add</button>";
    html += "</div>";
  }

  html += "<div class='symptom-scroll-box'>";
html += renderSymptomBars(generalSymptoms, "toggleGeneralSymptomItem", "removeGeneralSymptomItem");  html += "</div>";

  html += "<div class='health-notes-row'>";
html += "<textarea class='journal-notes' placeholder='Tap to add notes...' oninput='setGeneralNotes(this.value)'>" + notesToday + "</textarea>";  html += "<button class='rx-btn' onclick='toggleGeneralMedsExpanded()'>Rx</button>";
  html += "</div>";

  if (generalMedsExpanded) {
    html += "<div class='health-section-header'>";
    html += "<span>Medications</span>";
    html += "<button class='add-toggle-btn' onclick='toggleGeneralMedsAddOpen()'>+</button>";
    html += "</div>";

    if (generalMedsAddOpen) {
      html += "<div class='add-input-row'>";
      html += "<input type='text' id='new-general-med'>";
      html += "<button onclick=\"addGeneralMedItem(document.getElementById('new-general-med').value)\">Add</button>";
      html += "</div>";
    }

    html += "<div class='symptom-scroll-box'>";
html += renderSymptomBars(generalMeds, "toggleGeneralMedItem", "removeGeneralMedItem");    html += "</div>";
  }

  html += "</div>";

  document.getElementById("general-section").innerHTML = html;
}