loadState();
renderHomeIcons();
renderTodayIcons()
renderCalendarIcons()
renderHabits();
renderMood();
renderEnergy();
renderGeneralSection();
renderMenstrualSection();
renderHomeScreen();
showScreen("home-screen");

function debugHeightReadout() {
  let div = document.getElementById("debug-height-readout");
  if (!div) {
    div = document.createElement("div");
    div.id = "debug-height-readout";
    div.style.cssText = "position:fixed;bottom:0;left:0;z-index:99999;background:yellow;color:black;font-size:9px;font-family:monospace;white-space:pre-wrap;padding:4px;max-width:100%;overflow-wrap:break-word;pointer-events:none;";
    document.body.appendChild(div);
  }

  let activeWrapper = null;
  let wrappers = document.getElementsByClassName("screen-wrapper");
  for (let i = 0; i < wrappers.length; i++) {
    if (wrappers[i].style.display !== "none") {
      activeWrapper = wrappers[i];
      break;
    }
  }
  let screenEl = activeWrapper ? activeWrapper.querySelector(".screen") : null;
  let contentEl = activeWrapper ? activeWrapper.querySelector(".screen-content") : null;
  let navEl = activeWrapper ? activeWrapper.querySelector(".bottom-nav") : null;

  let lines = [
    "screen: " + (activeWrapper ? activeWrapper.getAttribute("data-screen") : "none"),
    "innerHeight: " + window.innerHeight,
    "screen.height: " + (window.screen ? window.screen.height : "n/a"),
    "navigator.standalone: " + window.navigator.standalone,
    "--app-height: " + getComputedStyle(document.documentElement).getPropertyValue("--app-height"),
    "wrapper rect: " + (activeWrapper ? JSON.stringify(activeWrapper.getBoundingClientRect()) : "n/a"),
    "screen rect: " + (screenEl ? JSON.stringify(screenEl.getBoundingClientRect()) : "n/a"),
    "content rect: " + (contentEl ? JSON.stringify(contentEl.getBoundingClientRect()) : "n/a"),
    "bottomNav rect: " + (navEl ? JSON.stringify(navEl.getBoundingClientRect()) : "none on this screen"),
    "bottomNav computed height: " + (navEl ? getComputedStyle(navEl).height : "n/a")
  ];
  div.textContent = lines.join("\n");
}

setInterval(debugHeightReadout, 1000);
debugHeightReadout();