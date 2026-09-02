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
    generalMeds: generalMeds
  };
  localStorage.setItem("trackerState", JSON.stringify(state));
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
  }
}
