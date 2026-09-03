function saveState() {
  let state = {
    habits: habits,
    moodHistory: moodHistory,
    moodNotesHistory: moodNotesHistory,
    energyHistory: energyHistory,
    energyNotesHistory: energyNotesHistory,
    menstrualSymptoms: menstrualSymptoms,
    menstrualNotesHistory: menstrualNotesHistory,
    menstrualMeds: menstrualMeds,
    generalSymptoms: generalSymptoms,
    generalNotesHistory: generalNotesHistory,
    generalMeds: generalMeds,
    weeklyChecklist: weeklyChecklist,
    monthlyChecklist: monthlyChecklist,
    projectsChecklist: projectsChecklist,
    weeklyChecklistResetKey: weeklyChecklistResetKey,
    monthlyChecklistResetKey: monthlyChecklistResetKey
  };
  localStorage.setItem("trackerState", JSON.stringify(state));
}
let BACKUP_URL = "https://script.google.com/macros/s/AKfycbwMC7fLmswHx5ctm7uG6an805PCebCxFVMuYlqrk5cxXqgdF0F0N9Xrmaoy4LuK3VA5hA/exec";

function getBackupKey() {
  let key = localStorage.getItem("backupKey");
  if (!key) {
    key = prompt("Enter your backup key:");
    if (key) {
      localStorage.setItem("backupKey", key);
    }
  }
  return key;
}

function getBackupPayload() {
  return {
    habits: habits,
    moodHistory: moodHistory,
    moodNotesHistory: moodNotesHistory,
    energyHistory: energyHistory,
    energyNotesHistory: energyNotesHistory,
    menstrualSymptoms: menstrualSymptoms,
    menstrualNotesHistory: menstrualNotesHistory,
    menstrualMeds: menstrualMeds,
    generalSymptoms: generalSymptoms,
    generalNotesHistory: generalNotesHistory,
    generalMeds: generalMeds,
    weeklyChecklist: weeklyChecklist,
    monthlyChecklist: monthlyChecklist,
    projectsChecklist: projectsChecklist,
    weeklyChecklistResetKey: weeklyChecklistResetKey,
    monthlyChecklistResetKey: monthlyChecklistResetKey
  };
}

function performBackup(callback) {
  let key = getBackupKey();
  if (!key) { callback(false); return; }
  fetch(BACKUP_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ key: key, data: getBackupPayload() })
  }).then(function() {
    localStorage.setItem("lastBackupAt", Date.now().toString());
    callback(true);
  }).catch(function() {
    callback(false);
  });
}

function backupNow() {
  performBackup(function(success) {
    alert(success ? "Backup saved!" : "Backup failed. Check your connection.");
  });
}

function maybeAutoBackup() {
  let lastBackupAt = parseInt(localStorage.getItem("lastBackupAt") || "0");
  let oneDay = 24 * 60 * 60 * 1000;
  if (Date.now() - lastBackupAt > oneDay && localStorage.getItem("backupKey")) {
    performBackup(function() {});
  }
}

function restoreFromBackup() {
  let key = getBackupKey();
  if (!key) return;
  if (!confirm("This will overwrite all current data with the last backup. Continue?")) return;
  fetch(BACKUP_URL + "?key=" + encodeURIComponent(key))
    .then(function(res) { return res.json(); })
    .then(function(result) {
      if (!result || !result.data) {
        alert("No backup found.");
        return;
      }
      let data = result.data;
      habits = data.habits || [];
      moodHistory = data.moodHistory || {};
      moodNotesHistory = data.moodNotesHistory || {};
      energyHistory = data.energyHistory || {};
      energyNotesHistory = data.energyNotesHistory || {};
      menstrualSymptoms = data.menstrualSymptoms || [];
      menstrualNotesHistory = data.menstrualNotesHistory || {};
      menstrualMeds = data.menstrualMeds || [];
      generalSymptoms = data.generalSymptoms || [];
      generalNotesHistory = data.generalNotesHistory || {};
      generalMeds = data.generalMeds || [];
      weeklyChecklist = data.weeklyChecklist || [];
      monthlyChecklist = data.monthlyChecklist || [];
      projectsChecklist = data.projectsChecklist || [];
      weeklyChecklistResetKey = data.weeklyChecklistResetKey || null;
      monthlyChecklistResetKey = data.monthlyChecklistResetKey || null;
      saveState();
      alert("Restore complete!");
      location.reload();
    })
    .catch(function() {
      alert("Restore failed. Check your connection and try again.");
    });
}

function loadState() {
  let saved = localStorage.getItem("trackerState");
  if (saved) {
    let state = JSON.parse(saved);
    habits = state.habits;
    moodHistory = state.moodHistory;
    moodNotesHistory = state.moodNotesHistory;
    energyHistory = state.energyHistory;
    energyNotesHistory = state.energyNotesHistory;
    menstrualSymptoms = state.menstrualSymptoms;
    menstrualNotesHistory = state.menstrualNotesHistory;
    menstrualMeds = state.menstrualMeds;
    generalSymptoms = state.generalSymptoms;
    generalNotesHistory = state.generalNotesHistory;
    generalMeds = state.generalMeds;
    weeklyChecklist = state.weeklyChecklist || [];
    monthlyChecklist = state.monthlyChecklist || [];
    projectsChecklist = state.projectsChecklist || [];
    weeklyChecklistResetKey = state.weeklyChecklistResetKey || null;
    monthlyChecklistResetKey = state.monthlyChecklistResetKey || null;
  }
}
