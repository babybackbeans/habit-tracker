let generalSymptomsHistory = {};
let generalSymptoms = [];
let generalMedsHistory = {};
let generalMeds = [];
let generalNotesHistory = {};

function setGeneralYesNo(value) {
  let today = getToday();
  generalSymptomsHistory[today] = value;
  renderGeneralYesNo();
  saveState();
}

function setGeneralNotes(text) {
  let today = getToday();
  generalNotesHistory[today] = text;
  saveState();
}

function renderGeneralYesNo() {
  let today = getToday();
  let todayValue = generalSymptomsHistory[today];
  let todayNotes = generalNotesHistory[today];
  if (!todayNotes) { todayNotes = ""; }
  document.getElementById("general-yesno").innerHTML =
    "General symptoms today? " +
    "<button onclick='setGeneralYesNo(true); showScreen(\"general-symptoms-screen\")'>Yes</button>" +
    "<button onclick='setGeneralYesNo(false); showScreen(\"done-screen\")'>No</button>" +
    " (current: " + todayValue + ")" +
    "<br><textarea oninput='setGeneralNotes(this.value)'>" + todayNotes + "</textarea>";
}

function addGeneralSymptomItem(name) {
  addHistoryItem(generalSymptoms, name);
  renderGeneralSymptomsList();
  saveState();
}
function toggleGeneralSymptomItem(index) {
  toggleHistoryItem(generalSymptoms, index);
  renderGeneralSymptomsList();
  saveState();
}
function editGeneralSymptomItem(index) {
  editItem(generalSymptoms, index);
  renderGeneralSymptomsList();
  saveState();
}
function removeGeneralSymptomItem(index) {
  removeItem(generalSymptoms, index);
  renderGeneralSymptomsList();
  saveState();
}
function renderGeneralSymptomsList() {
  document.getElementById("general-symptoms-list").innerHTML =
    renderHistoryChecklist(generalSymptoms, "addGeneralSymptomItem", "toggleGeneralSymptomItem", "editGeneralSymptomItem", "removeGeneralSymptomItem", "new-general-symptom");
}

function setGeneralMeds(value) {
  let today = getToday();
  generalMedsHistory[today] = value;
  renderGeneralMedsYesNo();
  saveState();
}
function renderGeneralMedsYesNo() {
  let today = getToday();
  let medsToday = generalMedsHistory[today];
  document.getElementById("general-meds-yesno").innerHTML =
    "Take meds? " +
    "<button onclick='setGeneralMeds(true); showScreen(\"general-meds-screen\")'>Yes</button>" +
    "<button onclick='setGeneralMeds(false); showScreen(\"done-screen\")'>No</button>" +
    " (current: " + medsToday + ")";
}
function addGeneralMedItem(name) {
  addHistoryItem(generalMeds, name);
  renderGeneralMedsList();
  saveState();
}
function toggleGeneralMedItem(index) {
  toggleHistoryItem(generalMeds, index);
  renderGeneralMedsList();
  saveState();
}
function editGeneralMedItem(index) {
  editItem(generalMeds, index);
  renderGeneralMedsList();
  saveState();
}
function removeGeneralMedItem(index) {
  removeItem(generalMeds, index);
  renderGeneralMedsList();
  saveState();
}
function renderGeneralMedsList() {
  document.getElementById("general-meds-list").innerHTML =
    renderHistoryChecklist(generalMeds, "addGeneralMedItem", "toggleGeneralMedItem", "editGeneralMedItem", "removeGeneralMedItem", "new-general-med");
}