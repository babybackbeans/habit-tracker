function saveState() {
  let state = {
    habits: habits,
    moodHistory: moodHistory,
    moodNotesHistory: moodNotesHistory,
    energyHistory: energyHistory,
    energyNotesHistory: energyNotesHistory,
    menstrualSymptomsHistory: menstrualSymptomsHistory,
    menstrualSymptoms: menstrualSymptoms,
    menstrualNotesHistory: menstrualNotesHistory,
    menstrualMedsHistory: menstrualMedsHistory,
    menstrualMeds: menstrualMeds,
    generalSymptomsHistory: generalSymptomsHistory,
    generalSymptoms: generalSymptoms,
    generalMedsHistory: generalMedsHistory,
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
    menstrualSymptomsHistory = state.menstrualSymptomsHistory;
    menstrualSymptoms = state.menstrualSymptoms;
    menstrualMedsHistory = state.menstrualMedsHistory;
    menstrualNotesHistory = state.menstrualNotesHistory;
    menstrualMeds = state.menstrualMeds;
    generalSymptomsHistory = state.generalSymptomsHistory;
    generalSymptoms = state.generalSymptoms;
    generalNotesHistory = state.generalNotesHistory;
    generalMedsHistory = state.generalMedsHistory;
    generalMeds = state.generalMeds;
  }
}