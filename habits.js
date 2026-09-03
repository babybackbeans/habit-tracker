let habits = [];
let habitsAddOpen = false;

function toggleHabitsAddOpen() {
  habitsAddOpen = !habitsAddOpen;
  renderHabits();
  if (habitsAddOpen) {
    document.getElementById("new-habit-name").focus();
  }
}

function closeHabitsAddOpen() {
  if (habitsAddOpen) {
    habitsAddOpen = false;
    renderHabits();
  }
}

function addHabitItem(name) {
  if (!name || !name.trim()) {
    closeHabitsAddOpen();
    return;
  }
  habits.push({ name: name, history: {}, color: pickRandomSymptomColor(habits) });
  habitsAddOpen = false;
  renderHabits();
  saveState();
}

function toggleHabitItem(index) {
  toggleHistoryItem(habits, index);
  renderHabits();
  saveState();
}

function editHabitItem(index) {
  openItemEditor(habits, index, "renderHabits");
}

function removeHabitItem(index) {
  removeItem(habits, index);
  renderHabits();
  saveState();
}

function renderHabitsHeader() {
  let box = document.getElementById("habits-date-box");
  if (box) {
    box.innerHTML = "<p class='date-display'>" + formatFullDate(currentLogDate) + "</p>";
  }
}

function renderHabits() {
  renderHabitsHeader();

  let html = "<div class='health-section-header'>";
  html += "<span>Habits</span>";
  html += "<button class='add-toggle-btn' onclick='toggleHabitsAddOpen()'>+</button>";
  html += "</div>";

  if (habitsAddOpen) {
    html += "<div class='add-input-row'>";
    html += "<input type='text' id='new-habit-name' enterkeyhint='done' onkeydown=\"if(event.key==='Enter'){addHabitItem(this.value)}\" onblur=\"if(habitsAddOpen){addHabitItem(this.value)}\">";
    html += "</div>";
  }

  html += "<div class='habit-bar-list'>";
  html += renderSymptomBars(habits, "toggleHabitItem", "editHabitItem", "removeHabitItem");
  html += "</div>";

  document.getElementById("habit-list").innerHTML = html;
}
