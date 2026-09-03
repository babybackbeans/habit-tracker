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
    div.style.cssText = "position:fixed;top:0;left:0;z-index:99999;background:yellow;color:black;font-size:9px;font-family:monospace;white-space:pre-wrap;padding:4px;max-width:100%;overflow-wrap:break-word;pointer-events:none;opacity:0.9;";
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
  let screenStyle = screenEl ? getComputedStyle(screenEl) : null;
  let contentStyle = contentEl ? getComputedStyle(contentEl) : null;

  let probe = document.getElementById("safe-area-probe");
  if (!probe) {
    probe = document.createElement("div");
    probe.id = "safe-area-probe";
    probe.style.cssText = "position:fixed;height:env(safe-area-inset-bottom, 0px);visibility:hidden;";
    document.body.appendChild(probe);
  }

  let lines = [
    "screen: " + (activeWrapper ? activeWrapper.getAttribute("data-screen") : "none"),
    "safe-area-inset-bottom probe height: " + getComputedStyle(probe).height,
    "screen computed paddingBottom: " + (screenStyle ? screenStyle.paddingBottom : "n/a"),
    "screen computed height/boxSizing: " + (screenStyle ? screenStyle.height + " / " + screenStyle.boxSizing : "n/a"),
    "content computed minHeight/flexBasis/flexGrow/flexShrink: " + (contentStyle ? contentStyle.minHeight + " / " + contentStyle.flexBasis + " / " + contentStyle.flexGrow + " / " + contentStyle.flexShrink : "n/a"),
    "content scrollHeight (natural content size): " + (contentEl ? contentEl.scrollHeight : "n/a"),
    "screen rect: " + (screenEl ? JSON.stringify(screenEl.getBoundingClientRect()) : "n/a"),
    "content rect: " + (contentEl ? JSON.stringify(contentEl.getBoundingClientRect()) : "n/a"),
    "bottomNav rect: " + (navEl ? JSON.stringify(navEl.getBoundingClientRect()) : "none on this screen")
  ];
  div.textContent = lines.join("\n");
}

setInterval(debugHeightReadout, 1000);
debugHeightReadout();