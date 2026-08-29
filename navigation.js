function showScreen(screenId) {
  let screens = document.getElementsByClassName("screen");
  for (let i = 0; i < screens.length; i++) {
    screens[i].style.display = "none";
  }
  document.getElementById(screenId).style.display = "block";
}