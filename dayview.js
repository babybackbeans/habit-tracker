function renderDayView(date) {
  setHeaderTitle("day-view-header", formatHeaderDate(date));
  let html = "";

  html += "<h3>Habits</h3>";
  for (let i = 0; i < habits.length; i++) {
    let value = habits[i].history[date];
    let display = value === true ? "Done" : (value === false ? "Not done" : "—");
    html += "<p>" + habits[i].name + ": " + display + "</p>";
  }

  html += "<div class='card-row'>";

  html += "<div class='card-column'>";
  html += "<h3>Energy</h3>";
  let energyDisplay = energyHistory[date] !== undefined ? energyHistory[date] : "—";
  html += "<div class='card energy-card' data-energy='" + energyHistory[date] + "'>" + energyDisplay + "</div>";
  html += "</div>";

  html += "<div class='card-column'>";
  html += "<h3>Mood</h3>";
  let moodDisplay = moodHistory[date] !== undefined ? moodHistory[date] : "—";
  html += "<div class='card mood-card' data-mood='" + moodHistory[date] + "'>" + moodDisplay + "</div>";
  html += "</div>";

  html += "</div>";

  html += "<h3>Health</h3>";
  html += "<div class='card health-card'>";
  html += "<div class='health-half'>";
  for (let i = 0; i < generalSymptoms.length; i++) {
    if (generalSymptoms[i].history[date] === true) {
      html += "<p>" + generalSymptoms[i].name + "</p>";
    }
  }
  html += "<div class='health-hr'></div>";
  for (let i = 0; i < generalMeds.length; i++) {
    if (generalMeds[i].history[date] === true) {
      html += "<p>" + generalMeds[i].name + "</p>";
    }
  }
  html += "</div>";
  html += "<div class='health-divider'></div>";
  html += "<div class='health-half'>";
  for (let i = 0; i < menstrualSymptoms.length; i++) {
    if (menstrualSymptoms[i].history[date] === true) {
      html += "<p>" + menstrualSymptoms[i].name + "</p>";
    }
  }
  html += "<div class='health-hr'></div>";
  for (let i = 0; i < menstrualMeds.length; i++) {
    if (menstrualMeds[i].history[date] === true) {
      html += "<p>" + menstrualMeds[i].name + "</p>";
    }
  }
  html += "</div>";
  html += "</div>";

  html += "<h3>Notes</h3>";
  html += "<button onclick=\"showAllNotes('" + date + "')\">View Notes</button>";

  document.getElementById("day-view-content").innerHTML = html;
  applyDayViewColors();
}

function applyDayViewColors() {
  let moodCard = document.querySelector(".mood-card");
  if (moodCard) {
    let value = parseInt(moodCard.getAttribute("data-mood"));
    moodCard.style.backgroundColor = colorForMood(value);
  }

  let energyCard = document.querySelector(".energy-card");
  if (energyCard) {
    let value = parseInt(energyCard.getAttribute("data-energy"));
    energyCard.style.backgroundColor = colorForEnergy(value);
  }
}

function showAllNotes(date) {
  let combined = "";

  let mood = moodNotesHistory[date];
  if (mood && mood.trim() !== "") {
    combined += "Mood: " + mood + "\n\n";
  }

  let energy = energyNotesHistory[date];
  if (energy && energy.trim() !== "") {
    combined += "Energy: " + energy + "\n\n";
  }

  let general = generalNotesHistory[date];
  if (general && general.trim() !== "") {
    combined += "General: " + general + "\n\n";
  }

  let menstrual = menstrualNotesHistory[date];
  if (menstrual && menstrual.trim() !== "") {
    combined += "Menstrual: " + menstrual + "\n\n";
  }

  if (combined === "") {
    alert("No notes for this day.");
  } else {
    alert(combined.trim());
  }
}