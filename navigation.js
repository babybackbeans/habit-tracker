function showScreen(screenId) {
  let wrappers = document.getElementsByClassName("screen-wrapper");
  for (let i = 0; i < wrappers.length; i++) {
    wrappers[i].style.display = "none";
  }
  let target = document.querySelector("[data-screen='" + screenId + "']");
  target.style.display = "block";

  if (screenId !== "day-view-screen") {
    dayViewEditMode = false;
    dayViewEnergyEditingDate = null;
    dayViewMoodEditingDate = null;
    dayViewHealthPickerDate = null;
  }
}

function attachSwipeNavigation(screenId, screenOrder) {
  let wrapper = document.querySelector('[data-screen="' + screenId + '"]');
  let container = wrapper ? wrapper.querySelector(".screen-content") : null;
  if (!container) return;

  let startX = null;
  let startY = null;

  container.addEventListener("touchstart", function(e) {
    if (e.touches.length === 1) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }
  }, { passive: true });

  container.addEventListener("touchend", function(e) {
    if (startX === null) return;
    let touch = e.changedTouches[0];
    let dx = touch.clientX - startX;
    let dy = touch.clientY - startY;
    startX = null;
    startY = null;

    let minSwipeDistance = 50;
    if (Math.abs(dx) < minSwipeDistance || Math.abs(dx) < Math.abs(dy) * 1.5) return;

    let currentIndex = screenOrder.indexOf(screenId);
    if (dx < 0) {
      if (currentIndex < screenOrder.length - 1) {
        showScreen(screenOrder[currentIndex + 1]);
      }
    } else {
      if (currentIndex > 0) {
        showScreen(screenOrder[currentIndex - 1]);
      }
    }
  }, { passive: true });
}

function setupHabitsStatusHealthSwipe() {
  let order = ["habits-screen", "status-screen", "health-screen"];
  for (let i = 0; i < order.length; i++) {
    attachSwipeNavigation(order[i], order);
  }
}

function setupChecklistSwipe() {
  let order = ["weekly-checklist-screen", "monthly-checklist-screen", "projects-checklist-screen"];
  for (let i = 0; i < order.length; i++) {
    attachSwipeNavigation(order[i], order);
  }
}