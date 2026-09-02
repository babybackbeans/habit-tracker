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
  if (generalSymptomsAddOpen) {
    document.getElementById("new-general-symptom").focus();
  }
}

function closeGeneralSymptomsAddOpen() {
  if (generalSymptomsAddOpen) {
    generalSymptomsAddOpen = false;
    renderGeneralSection();
  }
}

function toggleGeneralMedsAddOpen() {
  generalMedsAddOpen = !generalMedsAddOpen;
  renderGeneralSection();
  if (generalMedsAddOpen) {
    document.getElementById("new-general-med").focus();
  }
}

function closeGeneralMedsAddOpen() {
  if (generalMedsAddOpen) {
    generalMedsAddOpen = false;
    renderGeneralSection();
  }
}

function addGeneralSymptomItem(name) {
  if (!name || !name.trim()) {
    closeGeneralSymptomsAddOpen();
    return;
  }
  addHistoryItem(generalSymptoms, name);
  generalSymptomsAddOpen = false;
  renderGeneralSection();
  saveState();

}function toggleGeneralSymptomItem(index) {
  toggleHistoryItem(generalSymptoms, index);
  renderGeneralSection();
  saveState();
}
function editGeneralSymptomItem(index) {
  openItemEditor(generalSymptoms, index, "renderGeneralSection");
}
function removeGeneralSymptomItem(index) {
  removeItem(generalSymptoms, index);
  renderGeneralSection();
  saveState();
}

function addGeneralMedItem(name) {
  if (!name || !name.trim()) {
    closeGeneralMedsAddOpen();
    return;
  }
  addHistoryItem(generalMeds, name);
  generalMedsAddOpen = false;
  renderGeneralSection();
  saveState();

}function toggleGeneralMedItem(index) {
  toggleHistoryItem(generalMeds, index);
  renderGeneralSection();
  saveState();
}
function editGeneralMedItem(index) {
  openItemEditor(generalMeds, index, "renderGeneralSection");
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
    html += "<input type='text' id='new-general-symptom' onkeydown=\"if(event.key==='Enter'){addGeneralSymptomItem(this.value)}\" onblur='closeGeneralSymptomsAddOpen()'>";
    html += "</div>";
  }

  html += "<div class='symptom-scroll-box'>";
html += renderSymptomBars(generalSymptoms, "toggleGeneralSymptomItem", "editGeneralSymptomItem", "removeGeneralSymptomItem");  html += "</div>";

  html += "<div class='health-notes-row'>";
html += "<textarea class='journal-notes' placeholder='Tap to add notes...' oninput='setGeneralNotes(this.value)'>" + notesToday + "</textarea>";
  html += "<button class='rx-btn' onclick='toggleGeneralMedsExpanded()'>Rx</button>";
  html += "</div>";
  if (generalMedsExpanded) {
    html += "<div class='health-section-header'>";
    html += "<span>Medications</span>";
    html += "<button class='add-toggle-btn' onclick='toggleGeneralMedsAddOpen()'>+</button>";
    html += "</div>";

    if (generalMedsAddOpen) {
      html += "<div class='add-input-row'>";
      html += "<input type='text' id='new-general-med' onkeydown=\"if(event.key==='Enter'){addGeneralMedItem(this.value)}\" onblur='closeGeneralMedsAddOpen()'>";
      html += "</div>";
    }

    html += "<div class='symptom-scroll-box'>";
html += renderSymptomBars(generalMeds, "toggleGeneralMedItem", "editGeneralMedItem", "removeGeneralMedItem");    html += "</div>";
  }

  html += "</div>";

  document.getElementById("general-section").innerHTML = html;
}