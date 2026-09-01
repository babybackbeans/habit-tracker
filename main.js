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
  let newItem = { name: name, history: {} };
  newItem.history[today] = true;
  array.push(newItem);
}

function toggleHistoryItem(array, index) {
  let today = getToday();
  let currentValue = array[index].history[today];
  array[index].history[today] = !currentValue;
}

function renderHistoryChecklist(items, addFunctionName, toggleFunctionName, editFunctionName, removeFunctionName, inputId) {
  let today = getToday();
  let html = "<input type='text' id='" + inputId + "'>";
  html += "<button onclick=\"" + addFunctionName + "(document.getElementById('" + inputId + "').value)\">Add</button>";

  for (let i = 0; i < items.length; i++) {
    let value = items[i].history[today];
    let checked = value === true ? "checked" : "";
    html += "<p><input type='checkbox' " + checked + " onclick='" + toggleFunctionName + "(" + i + ")'> " + items[i].name + "</p>";
  }

  return html;
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