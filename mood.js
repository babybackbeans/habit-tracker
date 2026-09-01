function renderEnergy() {
  setHeaderTitle("status-header", "Status");
  document.querySelector(".empty-box").innerHTML = "<p class='date-display'>" + formatFullDate(currentLogDate) + "</p>";
  let today = currentLogDate;
  let todayEnergy = energyHistory[today];
  let todayNotes = energyNotesHistory[today];
  if (!todayNotes) { todayNotes = ""; }
  let html = "<div class='journal-section'>";
  html += "<p class='journal-label'>Energy</p>";
  html += renderRatingRow("energy", todayEnergy);
  html += "<textarea class='journal-notes' placeholder='Tap to add notes...' oninput='setEnergyNotes(this.value)'>" + todayNotes + "</textarea>";
  html += "</div>";
  document.getElementById("energy-section").innerHTML = html;
}
function renderMood() {
  let today = currentLogDate;
  let todayMood = moodHistory[today];
  let todayNotes = moodNotesHistory[today];
  if (!todayNotes) { todayNotes = ""; }
  let html = "<div class='journal-section'>";
  html += "<p class='journal-label'>Mood</p>";
  html += renderRatingRow("mood", todayMood);
  html += "<textarea class='journal-notes' placeholder='Tap to add notes...' oninput='setMoodNotes(this.value)'>" + todayNotes + "</textarea>";
  html += "</div>";
  document.getElementById("mood-section").innerHTML = html;
}