let menstrualSymptomsHistory = {};
let menstrualSymptoms = [];
let menstrualMedsHistory = {};
let menstrualMeds = [];
let menstrualNotesHistory = {};

function setMenstrualYesNo(value) {
  let today = currentLogDate;
  menstrualSymptomsHistory[today] = value;
  renderMenstrualYesNo();
  saveState();
}

function setMenstrualNotes(text) {
  let today = currentLogDate;
  menstrualNotesHistory[today] = text;
  saveState();
}

function renderMenstrualYesNo() {
  setHeaderTitle("menstrual-yesno-header", formatHeaderDate(currentLogDate));
  let today = currentLogDate;
  let todayValue = menstrualSymptomsHistory[today];
  let todayNotes = menstrualNotesHistory[today];
  if (!todayNotes) { todayNotes = ""; }
  document.getElementById("menstrual-yesno").innerHTML =
    "Menstrual symptoms today? " +
    "<button onclick='setMenstrualYesNo(true); showScreen(\"menstrual-symptoms-screen\")'>Yes</button>" +
    "<button onclick='setMenstrualYesNo(false); showScreen(\"general-yesno-screen\")'>No</button>" +
    " (current: " + todayValue + ")" +
    "<br><textarea oninput='setMenstrualNotes(this.value)'>" + todayNotes + "</textarea>";
}

function addMenstrualSymptomItem(name) {
  addHistoryItem(menstrualSymptoms, name);
  renderMenstrualSymptomsList();
  saveState();
}
function toggleMenstrualSymptomItem(index) {
  toggleHistoryItem(menstrualSymptoms, index);
  renderMenstrualSymptomsList();
  saveState();
}
function editMenstrualSymptomItem(index) {
  editItem(menstrualSymptoms, index);
  renderMenstrualSymptomsList();
  saveState();
}
function removeMenstrualSymptomItem(index) {
  removeItem(menstrualSymptoms, index);
  renderMenstrualSymptomsList();
  saveState();
}
function renderMenstrualSymptomsList() {
  setHeaderTitle("menstrual-symptoms-header", formatHeaderDate(currentLogDate));
  document.getElementById("menstrual-symptoms-list").innerHTML =
    renderHistoryChecklist(menstrualSymptoms, "addMenstrualSymptomItem", "toggleMenstrualSymptomItem", "editMenstrualSymptomItem", "removeMenstrualSymptomItem", "new-menstrual-symptom");
}

function setMenstrualMeds(value) {
  let today = currentLogDate;
  menstrualMedsHistory[today] = value;
  renderMenstrualMedsYesNo();
  saveState();
}
function renderMenstrualMedsYesNo() {
  setHeaderTitle("menstrual-meds-yesno-header", formatHeaderDate(currentLogDate));
  let today = currentLogDate;
  let medsToday = menstrualMedsHistory[today];
  document.getElementById("menstrual-meds-yesno").innerHTML =
    "Take meds? " +
    "<button onclick='setMenstrualMeds(true); showScreen(\"menstrual-meds-screen\")'>Yes</button>" +
    "<button onclick='setMenstrualMeds(false); showScreen(\"general-yesno-screen\")'>No</button>" +
    " (current: " + medsToday + ")";
}
function addMenstrualMedItem(name) {
  addHistoryItem(menstrualMeds, name);
  renderMenstrualMedsList();
  saveState();
}
function toggleMenstrualMedItem(index) {
  toggleHistoryItem(menstrualMeds, index);
  renderMenstrualMedsList();
  saveState();
}
function editMenstrualMedItem(index) {
  editItem(menstrualMeds, index);
  renderMenstrualMedsList();
  saveState();
}
function removeMenstrualMedItem(index) {
  removeItem(menstrualMeds, index);
  renderMenstrualMedsList();
  saveState();
}
function renderMenstrualMedsList() {
  setHeaderTitle("menstrual-meds-header", formatHeaderDate(currentLogDate));
  document.getElementById("menstrual-meds-list").innerHTML =
    renderHistoryChecklist(menstrualMeds, "addMenstrualMedItem", "toggleMenstrualMedItem", "editMenstrualMedItem", "removeMenstrualMedItem", "new-menstrual-med");
}