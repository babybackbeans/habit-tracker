function saveState() {
  let state = {
    habits: habits,
    moodHistory: moodHistory,
    energyHistory: energyHistory,
    menstrualSymptomsHistory: menstrualSymptomsHistory,
    menstrualSymptoms: menstrualSymptoms,
    menstrualMedsHistory: menstrualMedsHistory,
    menstrualMeds: menstrualMeds,
    generalSymptomsHistory: generalSymptomsHistory,
    generalSymptoms: generalSymptoms,
    generalMedsHistory: generalMedsHistory,
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
    energyHistory = state.energyHistory;
    menstrualSymptomsHistory = state.menstrualSymptomsHistory;
    menstrualSymptoms = state.menstrualSymptoms;
    menstrualMedsHistory = state.menstrualMedsHistory;
    menstrualMeds = state.menstrualMeds;
    generalSymptomsHistory = state.generalSymptomsHistory;
    generalSymptoms = state.generalSymptoms;
    generalMedsHistory = state.generalMedsHistory;
    generalMeds = state.generalMeds;
  }
}