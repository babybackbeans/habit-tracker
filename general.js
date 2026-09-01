let showGenSymptomInput = false;
let showGenMedInput = false;
let showGenMedsSection = false;

function renderGeneralSection() {
  let container = document.getElementById("general-section");
  if (!container) return;

  let today = getToday();

  if (!generalSymptomsHistory[today]) generalSymptomsHistory[today] = [];
  if (!generalMedsHistory[today]) generalMedsHistory[today] = [];
  if (generalNotesHistory[today] === undefined) generalNotesHistory[today] = "";

  let selectedSymptoms = generalSymptomsHistory[today];
  let selectedMeds = generalMedsHistory[today];
  let notesText = generalNotesHistory[today];

  let generalPalette = ["#868D6D", "#888774", "#BC986C", "#DA9C51", "#DA8356"];

  let html = "<div class='health-block'>";

  // 1. Symptoms Header
  html += "<div class='health-header-row'>";
  html += "<span class='health-header-title'>Symptoms</span>";
  html += "<button class='health-add-btn' onclick='toggleGenSymptomInput()'>+</button>";
  html += "</div>";

  // 2. Symptoms Input Bar
  if (showGenSymptomInput) {
    html += "<div class='health-input-bar'>";
    html += "<input type='text' id='gen-sym-field' placeholder='Add symptom...' onkeydown='handleGenSymptomKey(event)'>";
    html += "</div>";
  }

  // 3. Symptoms Edge-to-Edge List
  html += "<div class='health-pill-list'>";
  if (generalSymptoms.length === 0) {
    html += "<div style='font-size:0.8rem; opacity:0.5; padding:0.4rem;'>No symptoms added yet.</div>";
  } else {
    generalSymptoms.forEach((symptom, idx) => {
      let isSelected = selectedSymptoms.includes(symptom);
      let bgColor = generalPalette[idx % generalPalette.length];
      
      html += `<div class='health-pill ${isSelected ? "selected" : ""}' 
                    style='background-color: ${bgColor};'
                    onclick='toggleGenSymptom("${symptom}")'>
                 ${symptom}
               </div>`;
    });
  }
  html += "</div>";

  // 4. Notes + Rx Button Row
  html += "<div class='notes-rx-row'>";
  html += `<textarea class='journal-notes' placeholder='Tap to add notes...' onchange='updateGenNotes(this.value)'>${notesText}</textarea>`;
  html += `<button class='rx-toggle-btn ${showGenMedsSection ? "active" : ""}' onclick='toggleGenMedsSection()'>Rx</button>`;
  html += "</div>";

  // 5. Meds Collapsible Section
  html += `<div class='rx-section ${showGenMedsSection ? "" : "hidden"}'>`;
  html += "<div class='health-header-row'>";
  html += "<span class='health-header-title'>Meds</span>";
  html += "<button class='health-add-btn' onclick='toggleGenMedInput()'>+</button>";
  html += "</div>";

  if (showGenMedInput) {
    html += "<div class='health-input-bar'>";
    html += "<input type='text' id='gen-med-field' placeholder='Add med...' onkeydown='handleGenMedKey(event)'>";
    html += "</div>";
  }

  html += "<div class='health-pill-list'>";
  if (generalMeds.length === 0) {
    html += "<div style='font-size:0.8rem; opacity:0.5; padding:0.4rem;'>No meds added yet.</div>";
  } else {
    generalMeds.forEach((med, idx) => {
      let isSelected = selectedMeds.includes(med);
      let bgColor = generalPalette[idx % generalPalette.length];
      
      html += `<div class='health-pill ${isSelected ? "selected" : ""}' 
                    style='background-color: ${bgColor};'
                    onclick='toggleGenMed("${med}")'>
                 ${med}
               </div>`;
    });
  }
  html += "</div></div></div>";

  container.innerHTML = html;

  if (showGenSymptomInput && document.getElementById("gen-sym-field")) {
    document.getElementById("gen-sym-field").focus();
  }
  if (showGenMedInput && document.getElementById("gen-med-field")) {
    document.getElementById("gen-med-field").focus();
  }
}

/* --- Clean Handlers --- */
function toggleGenSymptomInput() {
  showGenSymptomInput = !showGenSymptomInput;
  renderGeneralSection();
}

function handleGenSymptomKey(e) {
  if (e.key === "Enter" && e.target.value.trim() !== "") {
    generalSymptoms.push(e.target.value.trim());
    showGenSymptomInput = false;
    renderGeneralSection();
  }
}

function toggleGenSymptom(name) {
  let today = getToday();
  let list = generalSymptomsHistory[today] || [];
  let index = list.indexOf(name);
  if (index > -1) {
    list.splice(index, 1);
  } else {
    list.push(name);
  }
  generalSymptomsHistory[today] = list;
  renderGeneralSection();
}

function toggleGenMedsSection() {
  showGenMedsSection = !showGenMedsSection;
  renderGeneralSection();
}

function toggleGenMedInput() {
  showGenMedInput = !showGenMedInput;
  renderGeneralSection();
}

function handleGenMedKey(e) {
  if (e.key === "Enter" && e.target.value.trim() !== "") {
    generalMeds.push(e.target.value.trim());
    showGenMedInput = false;
    renderGeneralSection();
  }
}

function toggleGenMed(name) {
  let today = getToday();
  let list = generalMedsHistory[today] || [];
  let index = list.indexOf(name);
  if (index > -1) {
    list.splice(index, 1);
  } else {
    list.push(name);
  }
  generalMedsHistory[today] = list;
  renderGeneralSection();
}

function updateGenNotes(val) {
  let today = getToday();
  generalNotesHistory[today] = val;
}