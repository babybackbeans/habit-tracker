function renderDayView(date) {
  let html = "<h2>" + date + "</h2>";

  html += "<h3>Habits</h3>";
  for (let i = 0; i < habits.length; i++) {
    let value = habits[i].history[date];
    let display = value === true ? "Done" : (value === false ? "Not done" : "—");
    html += "<p>" + habits[i].name + ": " + display + "</p>";
  }

  html += "<h3>Mood</h3>";
  html += "<p>" + moodHistory[date] + "</p>";

  html += "<h3>Energy</h3>";
  html += "<p>" + energyHistory[date] + "</p>";

  html += "<h3>Menstrual</h3>";
  html += "<p>Symptoms today: " + menstrualSymptomsHistory[date] + "</p>";
  for (let i = 0; i < menstrualSymptoms.length; i++) {
    if (menstrualSymptoms[i].history[date] === true) {
      html += "<p>- " + menstrualSymptoms[i].name + "</p>";
    }
  }
  html += "<p>Meds taken: " + menstrualMedsHistory[date] + "</p>";
  for (let i = 0; i < menstrualMeds.length; i++) {
    if (menstrualMeds[i].history[date] === true) {
      html += "<p>- " + menstrualMeds[i].name + "</p>";
    }
  }

  html += "<h3>General</h3>";
  html += "<p>Symptoms today: " + generalSymptomsHistory[date] + "</p>";
  for (let i = 0; i < generalSymptoms.length; i++) {
    if (generalSymptoms[i].history[date] === true) {
      html += "<p>- " + generalSymptoms[i].name + "</p>";
    }
  }
  html += "<p>Meds taken: " + generalMedsHistory[date] + "</p>";
  for (let i = 0; i < generalMeds.length; i++) {
    if (generalMeds[i].history[date] === true) {
      html += "<p>- " + generalMeds[i].name + "</p>";
    }
  }

  document.getElementById("day-view-content").innerHTML = html;
}