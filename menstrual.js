let menstrualSymptomsHistory = {};
let menstrualSymptoms = [];
let menstrualMedsHistory = {};
let menstrualMeds = [];
let menstrualNotesHistory = {};
let menstrualMedsExpanded = false;
let menstrualSymptomsAddOpen = false;
let menstrualMedsAddOpen = false;

function setMenstrualNotes(text) {
  let today = currentLogDate;
  menstrualNotesHistory[today] = text;
  saveState();
}

function toggleMenstrualMedsExpanded() {
  menstrualMedsExpanded = !menstrualMedsExpanded;
  renderMenstrualSection();
}

function toggleMenstrualSymptomsAddOpen() {
  menstrualSymptomsAddOpen = !menstrualSymptomsAddOpen;
  renderMenstrualSection();
}

function toggleMenstrualMedsAddOpen() {
  menstrualMedsAddOpen = !menstrualMedsAddOpen;
  renderMenstrualSection();
}

function addMenstrualSymptomItem(name) {
  addHistoryItem(menstrualSymptoms, name);
  menstrualSymptomsAddOpen = false;
  renderMenstrualSection();
  saveState();

}function toggleMenstrualSymptomItem(index) {
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
  menstrualMedsAddOpen = false;
  renderMenstrualSection();
  saveState();
  
}function toggleMenstrualMedItem(index) {
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
  let notesToday = menstrualNotesHistory[today];
  if (!notesToday) { notesToday = ""; }

  let html = "<div class='health-section'>";

  html += "<div class='health-section-header'>";
  html += "<span>Menstrual Symptoms</span>";
  html += "<button class='add-toggle-btn' onclick='toggleMenstrualSymptomsAddOpen()'>+</button>";
  html += "</div>";

  if (menstrualSymptomsAddOpen) {
    html += "<div class='add-input-row'>";
    html += "<input type='text' id='new-menstrual-symptom'>";
    html += "<button onclick=\"addMenstrualSymptomItem(document.getElementById('new-menstrual-symptom').value)\">Add</button>";
    html += "</div>";
  }

  html += "<div class='symptom-scroll-box'>";
html += renderSymptomBars(menstrualSymptoms, "toggleMenstrualSymptomItem", "removeMenstrualSymptomItem");  html += "</div>";

  html += "<div class='health-notes-row'>";
html += "<textarea class='journal-notes' placeholder='Tap to add notes...' oninput='setMenstrualNotes(this.value)'>" + notesToday + "</textarea>";  html += "<button class='rx-btn' onclick='toggleMenstrualMedsExpanded()'>Rx</button>";
  html += "</div>";

  if (menstrualMedsExpanded) {
    html += "<div class='health-section-header'>";
    html += "<span>Medications</span>";
    html += "<button class='add-toggle-btn' onclick='toggleMenstrualMedsAddOpen()'>+</button>";
    html += "</div>";

    if (menstrualMedsAddOpen) {
      html += "<div class='add-input-row'>";
      html += "<input type='text' id='new-menstrual-med'>";
      html += "<button onclick=\"addMenstrualMedItem(document.getElementById('new-menstrual-med').value)\">Add</button>";
      html += "</div>";
    }

    html += "<div class='symptom-scroll-box'>";
html += renderSymptomBars(menstrualMeds, "toggleMenstrualMedItem", "removeMenstrualMedItem");
    html += "</div>";
  }

  html += "</div>";

  document.getElementById("menstrual-section").innerHTML = html;
}