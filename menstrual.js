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
  let container = document.getElementById("menstrual-section");
  let today = getToday();
  let hasData = menstrualSymptomsHistory[today] !== undefined;
  
  let html = "<div class='journal-section'>";
  html += "<div class='journal-label'>Menstrual Health</div>";
  
  if (!hasData) {
    html += "<div class='health-gate'><button class='gate-btn' onclick='initMenstrualToday()'>Log Menstrual Health</button></div>";
  } else {
    let data = menstrualSymptomsHistory[today];
    let symChecked = data.symptoms ? "checked" : "";
    let medChecked = data.meds ? "checked" : "";
    
    html += "<div class='health-toggle-row'>";
    html += "<label class='health-toggle'><input type='checkbox' " + symChecked + " onchange='toggleMenstrualField(\"symptoms\")'> Symptoms?</label>";
    html += "<label class='health-toggle'><input type='checkbox' " + medChecked + " onchange='toggleMenstrualField(\"meds\")'> Meds?</label>";
    html += "</div>";
    
    if (data.symptoms) {
      html += "<div class='health-subsection'>";
      html += "<div class='health-sublabel'>Symptoms Checklist</div>";
      html += renderHistoryChecklist(menstrualSymptoms, "addMenstrualSymptom", "toggleMenstrualSymptom", "editMenstrualSymptom", "removeMenstrualSymptom", "men-sym-input");
      html += "</div>";
    }
    
    if (data.meds) {
      html += "<div class='health-subsection'>";
      html += "<div class='health-sublabel'>Meds Checklist</div>";
      html += renderHistoryChecklist(menstrualMeds, "addMenstrualMed", "toggleMenstrualMed", "editMenstrualMed", "removeMenstrualMed", "men-med-input");
      html += "</div>";
    }
    
    html += "<textarea class='journal-notes' placeholder='Menstrual notes...' onchange='updateMenstrualNotes(this.value)'>" + (data.notes || "") + "</textarea>";
  }
  
  html += "</div>";
  container.innerHTML = html;
}