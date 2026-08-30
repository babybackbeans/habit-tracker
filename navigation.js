function showScreen(screenId) {
  let wrappers = document.getElementsByClassName("screen-wrapper");
  for (let i = 0; i < wrappers.length; i++) {
    wrappers[i].style.display = "none";
  }
  let target = document.querySelector("[data-screen='" + screenId + "']");
  target.style.display = "block";
}