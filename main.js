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
    html += "<p><input type='checkbox' " + checked + " onclick='" + toggleFunctionName + "(" + i + ")'> " + items[i].name;
    html += " <button onclick='" + editFunctionName + "(" + i + ")'>Edit</button>";
    html += " <button onclick='" + removeFunctionName + "(" + i + ")'>Remove</button></p>";
  }

  return html;
}