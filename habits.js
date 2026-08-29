let habits = [];

function addHabitItem(name) {
  habits.push({ name: name, history: {} });
  renderHabits();
  saveState();
}
function toggleHabitItem(index) {
  let today = getToday();
  let currentValue = habits[index].history[today];
  habits[index].history[today] = !currentValue;
  renderHabits();
  saveState();
}
function editHabitItem(index) {
  editItem(habits, index);
  renderHabits();
  saveState();
}
function removeHabitItem(index) {
  removeItem(habits, index);
  renderHabits();
  saveState();
}
function renderHabits() {
  let today = getToday();
  let html = "<input type='text' id='new-habit-name'>";
  html += "<button onclick=\"addHabitItem(document.getElementById('new-habit-name').value)\">Add</button>";

  for (let i = 0; i < habits.length; i++) {
    let value = habits[i].history[today];
    let checked = value === true ? "checked" : "";
    html += "<p><input type='checkbox' " + checked + " onclick='toggleHabitItem(" + i + ")'> " + habits[i].name;
    html += " <button onclick='editHabitItem(" + i + ")'>Edit</button>";
    html += " <button onclick='removeHabitItem(" + i + ")'>Remove</button></p>";
  }

  document.getElementById("habit-list").innerHTML = html;
}