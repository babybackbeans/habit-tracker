let weeklyChecklist = [];
let monthlyChecklist = [];
let projectsChecklist = [];
let weeklyChecklistAddOpen = false;
let monthlyChecklistAddOpen = false;
let projectsChecklistAddOpen = false;
let weeklyChecklistResetKey = null;
let monthlyChecklistResetKey = null;

function getWeekStartKey(dateString) {
  let parts = dateString.split("-");
  let dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  dateObj.setDate(dateObj.getDate() - dateObj.getDay());
  let year = dateObj.getFullYear();
  let month = String(dateObj.getMonth() + 1).padStart(2, "0");
  let day = String(dateObj.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function formatMonthDay(dateString) {
  let parts = dateString.split("-");
  let month = parseInt(parts[1]);
  let day = parseInt(parts[2]);
  let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return monthNames[month - 1] + " " + day;
}

function formatMonthYear(dateString) {
  let parts = dateString.split("-");
  let year = parseInt(parts[0]);
  let month = parseInt(parts[1]);
  let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return monthNames[month - 1] + " " + year;
}

function sortChecklistByChecked(array) {
  array.sort(function(a, b) {
    let aChecked = a.history["current"] === true ? 1 : 0;
    let bChecked = b.history["current"] === true ? 1 : 0;
    return aChecked - bChecked;
  });
}

function checkChecklistResets() {
  let today = getToday();

  let weekStart = getWeekStartKey(today);
  if (weeklyChecklistResetKey !== weekStart) {
    for (let i = 0; i < weeklyChecklist.length; i++) {
      weeklyChecklist[i].history["current"] = false;
    }
    weeklyChecklistResetKey = weekStart;
    saveState();
  }

  let monthStart = today.slice(0, 7);
  if (monthlyChecklistResetKey !== monthStart) {
    for (let i = 0; i < monthlyChecklist.length; i++) {
      monthlyChecklist[i].history["current"] = false;
    }
    monthlyChecklistResetKey = monthStart;
    saveState();
  }
}

function toggleWeeklyAddOpen() {
  weeklyChecklistAddOpen = !weeklyChecklistAddOpen;
  renderWeeklyChecklist();
  if (weeklyChecklistAddOpen) {
    document.getElementById("new-weekly-checklist-name").focus();
  }
}

function closeWeeklyAddOpen() {
  if (weeklyChecklistAddOpen) {
    weeklyChecklistAddOpen = false;
    renderWeeklyChecklist();
  }
}

function addWeeklyChecklistItem(name) {
  if (!name || !name.trim()) {
    closeWeeklyAddOpen();
    return;
  }
  weeklyChecklist.push({ name: name, history: {}, color: pickRandomSymptomColor(weeklyChecklist) });
  weeklyChecklistAddOpen = false;
  renderWeeklyChecklist();
  saveState();
}

function toggleWeeklyChecklistItem(index) {
  toggleHistoryItem(weeklyChecklist, index, "current");
  renderWeeklyChecklist();
  saveState();
}

function editWeeklyChecklistItem(index) {
  openItemEditor(weeklyChecklist, index, "renderWeeklyChecklist");
}

function removeWeeklyChecklistItem(index) {
  removeItem(weeklyChecklist, index);
  renderWeeklyChecklist();
  saveState();
}

function renderWeeklyChecklist() {
  sortChecklistByChecked(weeklyChecklist);

  let box = document.getElementById("weekly-checklist-date-box");
  if (box) {
    box.innerHTML = "<p class='date-display'>Week of " + formatMonthDay(getWeekStartKey(getToday())) + "</p>";
  }

  let html = "<div class='health-section-header'>";
  html += "<span>Weekly</span>";
  html += "<button class='add-toggle-btn' onclick='toggleWeeklyAddOpen()'>+</button>";
  html += "</div>";

  if (weeklyChecklistAddOpen) {
    html += "<div class='add-input-row'>";
    html += "<input type='text' id='new-weekly-checklist-name' enterkeyhint='done' onkeydown=\"if(event.key==='Enter'){addWeeklyChecklistItem(this.value)}\" onblur=\"if(weeklyChecklistAddOpen){addWeeklyChecklistItem(this.value)}\">";
    html += "</div>";
  }

  html += "<div class='habit-bar-list'>";
  html += renderSymptomBars(weeklyChecklist, "toggleWeeklyChecklistItem", "editWeeklyChecklistItem", "removeWeeklyChecklistItem", "current");
  html += "</div>";

  document.getElementById("weekly-checklist-list").innerHTML = html;
}

function toggleMonthlyAddOpen() {
  monthlyChecklistAddOpen = !monthlyChecklistAddOpen;
  renderMonthlyChecklist();
  if (monthlyChecklistAddOpen) {
    document.getElementById("new-monthly-checklist-name").focus();
  }
}

function closeMonthlyAddOpen() {
  if (monthlyChecklistAddOpen) {
    monthlyChecklistAddOpen = false;
    renderMonthlyChecklist();
  }
}

function addMonthlyChecklistItem(name) {
  if (!name || !name.trim()) {
    closeMonthlyAddOpen();
    return;
  }
  monthlyChecklist.push({ name: name, history: {}, color: pickRandomSymptomColor(monthlyChecklist) });
  monthlyChecklistAddOpen = false;
  renderMonthlyChecklist();
  saveState();
}

function toggleMonthlyChecklistItem(index) {
  toggleHistoryItem(monthlyChecklist, index, "current");
  renderMonthlyChecklist();
  saveState();
}

function editMonthlyChecklistItem(index) {
  openItemEditor(monthlyChecklist, index, "renderMonthlyChecklist");
}

function removeMonthlyChecklistItem(index) {
  removeItem(monthlyChecklist, index);
  renderMonthlyChecklist();
  saveState();
}

function renderMonthlyChecklist() {
  sortChecklistByChecked(monthlyChecklist);

  let box = document.getElementById("monthly-checklist-date-box");
  if (box) {
    box.innerHTML = "<p class='date-display'>" + formatMonthYear(getToday()) + "</p>";
  }

  let html = "<div class='health-section-header'>";
  html += "<span>Monthly</span>";
  html += "<button class='add-toggle-btn' onclick='toggleMonthlyAddOpen()'>+</button>";
  html += "</div>";

  if (monthlyChecklistAddOpen) {
    html += "<div class='add-input-row'>";
    html += "<input type='text' id='new-monthly-checklist-name' enterkeyhint='done' onkeydown=\"if(event.key==='Enter'){addMonthlyChecklistItem(this.value)}\" onblur=\"if(monthlyChecklistAddOpen){addMonthlyChecklistItem(this.value)}\">";
    html += "</div>";
  }

  html += "<div class='habit-bar-list'>";
  html += renderSymptomBars(monthlyChecklist, "toggleMonthlyChecklistItem", "editMonthlyChecklistItem", "removeMonthlyChecklistItem", "current");
  html += "</div>";

  document.getElementById("monthly-checklist-list").innerHTML = html;
}

function toggleProjectsAddOpen() {
  projectsChecklistAddOpen = !projectsChecklistAddOpen;
  renderProjectsChecklist();
  if (projectsChecklistAddOpen) {
    document.getElementById("new-projects-checklist-name").focus();
  }
}

function closeProjectsAddOpen() {
  if (projectsChecklistAddOpen) {
    projectsChecklistAddOpen = false;
    renderProjectsChecklist();
  }
}

function addProjectsChecklistItem(name) {
  if (!name || !name.trim()) {
    closeProjectsAddOpen();
    return;
  }
  projectsChecklist.push({ name: name, history: {}, color: pickRandomSymptomColor(projectsChecklist) });
  projectsChecklistAddOpen = false;
  renderProjectsChecklist();
  saveState();
}

function toggleProjectsChecklistItem(index) {
  toggleHistoryItem(projectsChecklist, index, "current");
  renderProjectsChecklist();
  saveState();
}

function editProjectsChecklistItem(index) {
  openItemEditor(projectsChecklist, index, "renderProjectsChecklist");
}

function removeProjectsChecklistItem(index) {
  removeItem(projectsChecklist, index);
  renderProjectsChecklist();
  saveState();
}

function renderProjectsChecklist() {
  sortChecklistByChecked(projectsChecklist);

  let box = document.getElementById("projects-checklist-date-box");
  if (box) {
    box.innerHTML = "<p class='date-display'>" + formatFullDate(getToday()) + "</p>";
  }

  let html = "<div class='health-section-header'>";
  html += "<span>Projects</span>";
  html += "<button class='add-toggle-btn' onclick='toggleProjectsAddOpen()'>+</button>";
  html += "</div>";

  if (projectsChecklistAddOpen) {
    html += "<div class='add-input-row'>";
    html += "<input type='text' id='new-projects-checklist-name' enterkeyhint='done' onkeydown=\"if(event.key==='Enter'){addProjectsChecklistItem(this.value)}\" onblur=\"if(projectsChecklistAddOpen){addProjectsChecklistItem(this.value)}\">";
    html += "</div>";
  }

  html += "<div class='habit-bar-list'>";
  html += renderSymptomBars(projectsChecklist, "toggleProjectsChecklistItem", "editProjectsChecklistItem", "removeProjectsChecklistItem", "current");
  html += "</div>";

  document.getElementById("projects-checklist-list").innerHTML = html;
}

function renderChecklistSection(date) {
  let html = "<div class='health-section-header'><span>Checklist</span><button class='section-header-btn' onclick=\"showScreen('weekly-checklist-screen')\">Log</button></div>";
  html += "<div class='health-card'><div class='health-half'>";

  let lists = [weeklyChecklist, monthlyChecklist, projectsChecklist];
  for (let l = 0; l < lists.length; l++) {
    for (let i = 0; i < lists[l].length; i++) {
      if (lists[l][i].history["current"] === true) {
        html += "<p>" + lists[l][i].name + "</p>";
      }
    }
  }

  html += "</div></div>";
  return html;
}
