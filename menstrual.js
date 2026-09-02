let menstrualSymptoms = [];
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
  if (menstrualSymptomsAddOpen) {
    document.getElementById("new-menstrual-symptom").focus();
  }
}

function closeMenstrualSymptomsAddOpen() {
  if (menstrualSymptomsAddOpen) {
    menstrualSymptomsAddOpen = false;
    renderMenstrualSection();
  }
}

function toggleMenstrualMedsAddOpen() {
  menstrualMedsAddOpen = !menstrualMedsAddOpen;
  renderMenstrualSection();
  if (menstrualMedsAddOpen) {
    document.getElementById("new-menstrual-med").focus();
  }
}

function closeMenstrualMedsAddOpen() {
  if (menstrualMedsAddOpen) {
    menstrualMedsAddOpen = false;
    renderMenstrualSection();
  }
}

function addMenstrualSymptomItem(name) {
  if (!name || !name.trim()) {
    closeMenstrualSymptomsAddOpen();
    return;
  }
  addHistoryItem(menstrualSymptoms, name);
  menstrualSymptomsAddOpen = false;
  renderMenstrualSection();
  saveState();
}

function toggleMenstrualSymptomItem(index) {
  toggleHistoryItem(menstrualSymptoms, index);
  renderMenstrualSection();
  saveState();
}

function editMenstrualSymptomItem(index) {
  openItemEditor(menstrualSymptoms, index, "renderMenstrualSection");
}

function removeMenstrualSymptomItem(index) {
  removeItem(menstrualSymptoms, index);
  renderMenstrualSection();
  saveState();
}

function addMenstrualMedItem(name) {
  if (!name || !name.trim()) {
    closeMenstrualMedsAddOpen();
    return;
  }
  addHistoryItem(menstrualMeds, name);
  menstrualMedsAddOpen = false;
  renderMenstrualSection();
  saveState();
}

function toggleMenstrualMedItem(index) {
  toggleHistoryItem(menstrualMeds, index);
  renderMenstrualSection();
  saveState();
}

function editMenstrualMedItem(index) {
  openItemEditor(menstrualMeds, index, "renderMenstrualSection");
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
    html += "<input type='text' id='new-menstrual-symptom' enterkeyhint='done' onkeydown=\"if(event.key==='Enter'){addMenstrualSymptomItem(this.value)}\" onblur='closeMenstrualSymptomsAddOpen()'>";
    html += "</div>";
  }

  html += "<div class='symptom-scroll-box'>";
  html += renderSymptomBars(menstrualSymptoms, "toggleMenstrualSymptomItem", "editMenstrualSymptomItem", "removeMenstrualSymptomItem");
  html += "</div>";

  html += "<div class='health-notes-row'>";
  html += "<textarea class='journal-notes' placeholder='Tap to add notes...' oninput='setMenstrualNotes(this.value)'>" + notesToday + "</textarea>";
  html += "<button class='rx-btn' onclick='toggleMenstrualMedsExpanded()'>Rx</button>";
  html += "</div>";

  if (menstrualMedsExpanded) {
    html += "<div class='health-section-header'>";
    html += "<span>Medications</span>";
    html += "<button class='add-toggle-btn' onclick='toggleMenstrualMedsAddOpen()'>+</button>";
    html += "</div>";

    if (menstrualMedsAddOpen) {
      html += "<div class='add-input-row'>";
      html += "<input type='text' id='new-menstrual-med' enterkeyhint='done' onkeydown=\"if(event.key==='Enter'){addMenstrualMedItem(this.value)}\" onblur='closeMenstrualMedsAddOpen()'>";
      html += "</div>";
    }

    html += "<div class='symptom-scroll-box'>";
    html += renderSymptomBars(menstrualMeds, "toggleMenstrualMedItem", "editMenstrualMedItem", "removeMenstrualMedItem");
    html += "</div>";
  }

  html += "</div>";

  document.getElementById("menstrual-section").innerHTML = html;
}