function setAppHeight() {
  if (window.navigator.standalone && window.screen) {
    let trueHeight = Math.max(window.screen.width, window.screen.height);
    document.documentElement.style.setProperty("--app-height", trueHeight + "px");
  }
}
setAppHeight();
window.addEventListener("resize", setAppHeight);
window.addEventListener("orientationchange", setAppHeight);

let currentLogDate = getToday();

function getToday() {
  let now = new Date();
  let year = now.getFullYear();
  let month = String(now.getMonth() + 1).padStart(2, "0");
  let day = String(now.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}


function editItem(array, index) {
  let newName = prompt("Edit item:", array[index].name);
  if (newName !== null) {
    array[index].name = newName;
  }
}

function removeItem(array, index) {
  array.splice(index, 1);
}

function addHistoryItem(array, name) {
  let today = getToday();
  let newItem = { name: name, history: {}, color: pickRandomSymptomColor(array) };
  newItem.history[today] = true;
  array.push(newItem);
}

function toggleHistoryItem(array, index) {
  let today = getToday();
  let currentValue = array[index].history[today];
  array[index].history[today] = !currentValue;
}

let longPressTimer = null;
let longPressTriggered = false;

function startLongPress(editFunctionName, removeFunctionName, index) {
  longPressTriggered = false;
  longPressTimer = setTimeout(function() {
    longPressTriggered = true;
    showItemActionPrompt(editFunctionName, removeFunctionName, index);
  }, 600);
}

function cancelLongPress() {
  clearTimeout(longPressTimer);
}

let itemActionEditFn = null;
let itemActionRemoveFn = null;
let itemActionIndex = null;

function showItemActionPrompt(editFunctionName, removeFunctionName, index) {
  itemActionEditFn = editFunctionName;
  itemActionRemoveFn = removeFunctionName;
  itemActionIndex = index;
  document.getElementById("item-action-overlay").style.display = "flex";
}

function closeItemActionPrompt() {
  document.getElementById("item-action-overlay").style.display = "none";
  itemActionEditFn = null;
  itemActionRemoveFn = null;
  itemActionIndex = null;
}

function confirmItemActionEdit() {
  let fn = itemActionEditFn;
  let index = itemActionIndex;
  closeItemActionPrompt();
  window[fn](index);
}

function confirmItemActionDelete() {
  let fn = itemActionRemoveFn;
  let index = itemActionIndex;
  closeItemActionPrompt();
  window[fn](index);
}

function handleSymptomBarTap(toggleFunctionName, index) {
  if (longPressTriggered) {
    longPressTriggered = false;
    return;
  }
  window[toggleFunctionName](index);
}

const SYMPTOM_BAR_COLORS = ["#DA797D", "#C1878B", "#B19AA1", "#90959B", "#788281", "#DA8356", "#DA9C51", "#BC986C", "#888774", "#868D6D"];

function pickRandomSymptomColor(existingItems) {
  let previousColor = existingItems.length > 0 ? existingItems[existingItems.length - 1].color : null;
  let index;
  do {
    index = Math.floor(Math.random() * SYMPTOM_BAR_COLORS.length);
  } while (SYMPTOM_BAR_COLORS[index] === previousColor);
  return SYMPTOM_BAR_COLORS[index];
}

function renderSymptomBars(items, toggleFunctionName, editFunctionName, removeFunctionName) {
  let today = getToday();
  let colorsChanged = false;
  for (let i = 0; i < items.length; i++) {
    if (!items[i].color) {
      items[i].color = pickRandomSymptomColor(items.slice(0, i));
      colorsChanged = true;
    }
  }
  if (colorsChanged) {
    saveState();
  }

  let html = "<div class='symptom-bar-list'>";
  for (let i = 0; i < items.length; i++) {
    let value = items[i].history[today];
    let checkedClass = value === true ? " checked" : "";
    html += "<div class='symptom-bar" + checkedClass + "' style='background-color:" + items[i].color + "' ";
    html += "onclick=\"handleSymptomBarTap('" + toggleFunctionName + "', " + i + ")\" ";
    html += "onmousedown=\"startLongPress('" + editFunctionName + "', '" + removeFunctionName + "', " + i + ")\" onmouseup='cancelLongPress()' onmouseleave='cancelLongPress()' ";
    html += "ontouchstart=\"startLongPress('" + editFunctionName + "', '" + removeFunctionName + "', " + i + ")\" ontouchend='cancelLongPress()' ontouchcancel='cancelLongPress()'";
    html += ">" + items[i].name + "</div>";
  }
  html += "</div>";
  return html;
}

let itemEditorArray = null;
let itemEditorIndex = null;
let itemEditorRenderFn = null;
let itemEditorSelectedColor = null;

function openItemEditor(array, index, renderFunctionName) {
  itemEditorArray = array;
  itemEditorIndex = index;
  itemEditorRenderFn = renderFunctionName;
  itemEditorSelectedColor = array[index].color;

  document.getElementById("item-editor-name-input").value = array[index].name;

  let swatchHtml = "";
  for (let i = 0; i < SYMPTOM_BAR_COLORS.length; i++) {
    let color = SYMPTOM_BAR_COLORS[i];
    let selectedClass = color === itemEditorSelectedColor ? " selected" : "";
    swatchHtml += "<button type='button' class='item-editor-swatch" + selectedClass + "' data-color='" + color + "' style='background-color:" + color + "' onclick=\"selectItemEditorColor('" + color + "')\"></button>";
  }
  document.getElementById("item-editor-swatches").innerHTML = swatchHtml;

  document.getElementById("item-editor-overlay").style.display = "flex";
}

function selectItemEditorColor(color) {
  itemEditorSelectedColor = color;
  let swatches = document.getElementById("item-editor-swatches").children;
  for (let i = 0; i < swatches.length; i++) {
    swatches[i].classList.toggle("selected", swatches[i].getAttribute("data-color") === color);
  }
}

function closeItemEditor() {
  document.getElementById("item-editor-overlay").style.display = "none";
  itemEditorArray = null;
  itemEditorIndex = null;
  itemEditorRenderFn = null;
  itemEditorSelectedColor = null;
}

function saveItemEditor() {
  let array = itemEditorArray;
  let index = itemEditorIndex;
  let renderFn = itemEditorRenderFn;
  let newName = document.getElementById("item-editor-name-input").value;
  if (newName && newName.trim()) {
    array[index].name = newName;
  }
  array[index].color = itemEditorSelectedColor;
  closeItemEditor();
  window[renderFn]();
  saveState();
}

function homeIconSVG() {
  let html = "<svg viewBox='0 0 24 24' width='40' height='40' xmlns='http://www.w3.org/2000/svg'>";
  html += "<polygon points='12,3 21,13 3,13' fill='var(--color-text)'/>";
  html += "<rect x='5' y='12' width='14' height='9' fill='var(--color-text)'/>";
  html += "</svg>";
  return html;
}

function renderHomeIcons() {
  let slots = document.getElementsByClassName("home-icon-slot");
  for (let i = 0; i < slots.length; i++) {
    slots[i].innerHTML = homeIconSVG();
  }
}

function todayIconSVG() {
  let weekdayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  let now = new Date();
  let weekday = weekdayNames[now.getDay()];
  let day = now.getDate();

  let html = "<svg viewBox='0 0 24 28' width='40' height='40' xmlns='http://www.w3.org/2000/svg'>";
  html += "<rect x='1' y='1' width='22' height='26' fill='none' stroke='var(--color-text)' stroke-width='1'/>";
  html += "<line x1='1' y1='10' x2='23' y2='10' stroke='var(--color-text)' stroke-width='1'/>";
  html += "<text x='12' y='7.5' text-anchor='middle' font-family='DM Sans, sans-serif' font-weight='bold' font-size='6' fill='var(--color-text)'>" + weekday + "</text>";
  html += "<text x='12' y='23' text-anchor='middle' font-family='DM Sans, sans-serif' font-weight='bold' font-size='13' fill='var(--color-text)'>" + day + "</text>";
  html += "</svg>";
  return html;
}

function renderTodayIcons() {
  let slots = document.getElementsByClassName("today-icon-slot");
  for (let i = 0; i < slots.length; i++) {
    slots[i].innerHTML = todayIconSVG();
  }
}

function calendarIconSVG() {
  let monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();
  let monthLabel = monthNames[month];

  let daysInMonth = new Date(year, month + 1, 0).getDate();
  let startWeekday = new Date(year, month, 1).getDay();

  let cells = [];
  for (let i = 0; i < startWeekday; i++) {
    cells.push(false);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(true);
  }

  let cols = 7;
  let cellSize = 2.2;
  let gap = 0.3;
  let gridWidth = cols * cellSize + (cols - 1) * gap;
  let boxLeft = 1;
  let boxWidth = 22;
  let gridStartX = boxLeft + (boxWidth - gridWidth) / 2;
  let startY = 11;

  let html = "<svg viewBox='0 0 24 28' width='40' height='40' xmlns='http://www.w3.org/2000/svg'>";
  html += "<rect x='1' y='1' width='22' height='26' fill='none' stroke='var(--color-text)' stroke-width='1'/>";
  html += "<line x1='1' y1='10' x2='23' y2='10' stroke='var(--color-text)' stroke-width='1'/>";
  html += "<text x='12' y='7.5' text-anchor='middle' font-family='DM Sans, sans-serif' font-weight='bold' font-size='6' fill='var(--color-text)'>" + monthLabel + "</text>";

  for (let i = 0; i < cells.length; i++) {
    if (cells[i]) {
      let col = i % cols;
      let row = Math.floor(i / cols);
      let x = gridStartX + col * (cellSize + gap);
      let y = startY + row * (cellSize + gap);
      html += "<rect x='" + x + "' y='" + y + "' width='" + cellSize + "' height='" + cellSize + "' fill='var(--color-text)'/>";
    }
  }

  html += "</svg>";
  return html;
}
function renderCalendarIcons() {
  let slots = document.getElementsByClassName("calendar-icon-slot");
  for (let i = 0; i < slots.length; i++) {
    slots[i].innerHTML = calendarIconSVG();
  }
}

function formatHeaderDate(date) {
  if (date === getToday()) {
    return "Today";
  }
  return date;
}

function setHeaderTitle(elementId, text) {
  document.getElementById(elementId).innerHTML = text;
}

function renderRatingRow(mode, currentValue) {
  let colors;
  if (mode === "mood") {
    colors = ["#788281", "#90959B", "#B19AA1", "#C1878B", "#DA797D"];
  } else {
    colors = ["#868D6D", "#888774", "#BC986C", "#DA9C51", "#DA8356"];
  }

  let html = "<div class='rating-row'>";
  for (let i = 1; i <= 5; i++) {
    let color = colors[i - 1];
    let selectedClass = (i === currentValue) ? " selected" : "";
    html += "<div class='rating-square" + selectedClass + "' style='background-color:" + color + "' onclick=\"" + (mode === "mood" ? "setMood(" : "setEnergy(") + i + ")\">" + i + "</div>";
  }
  html += "</div>";
  return html;
}

setHeaderTitle("status-header", formatHeaderDate(currentLogDate));

function formatDateDisplay(dateString) {
  let parts = dateString.split("-");
  let year = parts[0].slice(-2);
  let month = parseInt(parts[1]);
  let day = parseInt(parts[2]);

  let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return day + " " + monthNames[month - 1] + " " + year;
}

function renderHealthHeader() {
  setHeaderTitle("health-header", formatDateDisplay(currentLogDate));
  let box = document.getElementById("health-date-box");
  if (box) {
    box.innerHTML = "<p class='date-display'>" + formatFullDate(currentLogDate) + "</p>";
  }
}

function formatFullDate(dateString) {
  let parts = dateString.split("-");
  let year = parseInt(parts[0]);
  let month = parseInt(parts[1]);
  let day = parseInt(parts[2]);

  let dateObj = new Date(year, month - 1, day);

  let weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  let weekday = weekdayNames[dateObj.getDay()];
  let monthName = monthNames[month - 1];

  return weekday + ", " + monthName + " " + day + ", " + year;
}

