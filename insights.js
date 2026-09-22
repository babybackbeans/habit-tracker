let insightsHabitIndex = 0;
let INSIGHTS_TREND_DAYS = 60;
let INSIGHTS_ENERGY_COLOR = "#DA9C51";
let INSIGHTS_MOOD_COLOR = "#90959B";
let INSIGHTS_PERIOD_COLOR = "#DA797D";

function getLoggedDates() {
  let set = {};
  let energyDates = Object.keys(energyHistory);
  let moodDates = Object.keys(moodHistory);
  for (let i = 0; i < energyDates.length; i++) { set[energyDates[i]] = true; }
  for (let i = 0; i < moodDates.length; i++) { set[moodDates[i]] = true; }
  return Object.keys(set).sort();
}

function shortMonthDay(dateString) {
  let parts = dateString.split("-");
  let month = parseInt(parts[1]);
  let day = parseInt(parts[2]);
  return month + "/" + day;
}

/* ===== Trend Screen ===== */

function renderInsightsTrend() {
  let endDate = getToday();
  let startDate = offsetDateString(endDate, -(INSIGHTS_TREND_DAYS - 1));

  let box = document.getElementById("insights-trend-box");
  if (box) {
    box.innerHTML = "<p class='date-display'>" + shortMonthDay(startDate) + " - " + shortMonthDay(endDate) + "</p>";
  }

  let dates = [];
  for (let i = 0; i < INSIGHTS_TREND_DAYS; i++) {
    dates.push(offsetDateString(startDate, i));
  }

  let html = "<div class='chart-section'>";
  html += "<div class='health-section-header'><span>Energy &amp; Mood</span></div>";
  html += "<div class='chart-container'>" + renderTrendChartSVG(dates) + "</div>";
  html += renderChartLegend([
    { label: "Energy", color: INSIGHTS_ENERGY_COLOR },
    { label: "Mood", color: INSIGHTS_MOOD_COLOR },
    { label: "Period", color: INSIGHTS_PERIOD_COLOR }
  ]);
  html += renderTrendSummary(dates);
  html += "</div>";

  document.getElementById("insights-trend-content").innerHTML = html;
}

function renderTrendSummary(dates) {
  let energySum = 0, energyCount = 0, moodSum = 0, moodCount = 0, periodCount = 0;
  for (let i = 0; i < dates.length; i++) {
    let d = dates[i];
    if (energyHistory[d] !== undefined) { energySum += energyHistory[d]; energyCount++; }
    if (moodHistory[d] !== undefined) { moodSum += moodHistory[d]; moodCount++; }
    if (periodHistory[d] === true) { periodCount++; }
  }
  let avgEnergy = energyCount > 0 ? (energySum / energyCount).toFixed(1) : "—";
  let avgMood = moodCount > 0 ? (moodSum / moodCount).toFixed(1) : "—";

  let html = "<div class='chart-summary'>";
  html += "<p>Avg Energy: <strong>" + avgEnergy + "</strong></p>";
  html += "<p>Avg Mood: <strong>" + avgMood + "</strong></p>";
  html += "<p>Period Days: <strong>" + periodCount + "</strong> / " + dates.length + "</p>";
  html += "</div>";
  return html;
}

function renderTrendChartSVG(dates) {
  let width = 320, height = 190;
  let left = 22, right = 8, top = 10, bottom = 24;
  let plotWidth = width - left - right;
  let plotHeight = height - top - bottom;
  let n = dates.length;
  let xStep = n > 1 ? plotWidth / (n - 1) : 0;

  let xs = [];
  for (let i = 0; i < n; i++) { xs.push(left + i * xStep); }

  function yFor(v) {
    return top + (5 - v) / 4 * plotHeight;
  }

  let svg = "<svg viewBox='0 0 " + width + " " + height + "' class='chart-svg'>";

  let bandWidth = n > 1 ? xStep : plotWidth;
  for (let i = 0; i < n; i++) {
    if (periodHistory[dates[i]] === true) {
      let bx = xs[i] - bandWidth / 2;
      svg += "<rect x='" + bx + "' y='" + top + "' width='" + bandWidth + "' height='" + plotHeight + "' fill='" + INSIGHTS_PERIOD_COLOR + "' fill-opacity='0.18'/>";
    }
  }

  for (let v = 1; v <= 5; v++) {
    let y = yFor(v);
    svg += "<line x1='" + left + "' y1='" + y + "' x2='" + (width - right) + "' y2='" + y + "' class='chart-gridline'/>";
    svg += "<text x='" + (left - 4) + "' y='" + (y + 3) + "' class='chart-axis-label' text-anchor='end'>" + v + "</text>";
  }

  svg += buildTrendLine(dates, energyHistory, xs, yFor, INSIGHTS_ENERGY_COLOR);
  svg += buildTrendLine(dates, moodHistory, xs, yFor, INSIGHTS_MOOD_COLOR);

  let labelAnchors = ["start", "middle", "end"];
  let labelIndexes = [0, Math.floor((n - 1) / 2), n - 1];
  for (let i = 0; i < labelIndexes.length; i++) {
    let idx = labelIndexes[i];
    svg += "<text x='" + xs[idx] + "' y='" + (height - 6) + "' class='chart-axis-label' text-anchor='" + labelAnchors[i] + "'>" + shortMonthDay(dates[idx]) + "</text>";
  }

  svg += "</svg>";
  return svg;
}

function buildTrendLine(dates, historyMap, xs, yFor, color) {
  let segments = [];
  let current = [];
  for (let i = 0; i < dates.length; i++) {
    let v = historyMap[dates[i]];
    if (v === undefined) {
      if (current.length > 0) { segments.push(current); }
      current = [];
    } else {
      current.push({ x: xs[i], y: yFor(v) });
    }
  }
  if (current.length > 0) { segments.push(current); }

  let svg = "";
  for (let s = 0; s < segments.length; s++) {
    let seg = segments[s];
    if (seg.length === 1) {
      svg += "<circle cx='" + seg[0].x + "' cy='" + seg[0].y + "' r='2.5' fill='" + color + "'/>";
    } else {
      let pointsStr = "";
      for (let i = 0; i < seg.length; i++) {
        pointsStr += seg[i].x + "," + seg[i].y + " ";
      }
      svg += "<polyline points='" + pointsStr.trim() + "' fill='none' stroke='" + color + "' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/>";
    }
  }
  return svg;
}

/* ===== Correlation Screen ===== */

function switchInsightsHabit(habitIndex) {
  if (!habits || habits.length === 0) { return; }
  if (habitIndex < 0) { habitIndex = habits.length - 1; }
  if (habitIndex >= habits.length) { habitIndex = 0; }
  renderInsightsCorrelation(habitIndex);
}

function renderInsightsCorrelation(habitIndex) {
  let box = document.getElementById("insights-correlation-box");

  if (!habits || habits.length === 0) {
    if (box) { box.innerHTML = "<p class='date-display'>No habits yet</p>"; }
    document.getElementById("insights-correlation-content").innerHTML = "";
    return;
  }

  if (habitIndex < 0) { habitIndex = habits.length - 1; }
  if (habitIndex >= habits.length) { habitIndex = 0; }
  insightsHabitIndex = habitIndex;

  let habit = habits[habitIndex];

  if (box) {
    box.innerHTML = "<button class='date-nav-arrow date-nav-prev' onclick=\"switchInsightsHabit(" + (habitIndex - 1) + ")\"></button>" +
      "<p class='date-display'>" + habit.name + "</p>" +
      "<button class='date-nav-arrow date-nav-next' onclick=\"switchInsightsHabit(" + (habitIndex + 1) + ")\"></button>";
  }

  let energyBuckets = bucketsForLevels(energyHistory, habit.history);
  let moodBuckets = bucketsForLevels(moodHistory, habit.history);
  let periodBucketsData = periodComparisonBuckets(habit.history);

  let html = "<div class='chart-section'>";
  html += "<div class='health-section-header'><span>Completion by Energy</span></div>";
  html += "<div class='chart-container'>" + renderBarChartSVG(energyBuckets, INSIGHTS_ENERGY_COLOR) + "</div>";

  html += "<div class='health-section-header'><span>Completion by Mood</span></div>";
  html += "<div class='chart-container'>" + renderBarChartSVG(moodBuckets, INSIGHTS_MOOD_COLOR) + "</div>";

  html += "<div class='health-section-header'><span>Period vs. No Period</span></div>";
  html += "<div class='chart-container'>" + renderBarChartSVG(periodBucketsData, INSIGHTS_PERIOD_COLOR) + "</div>";
  html += "</div>";

  document.getElementById("insights-correlation-content").innerHTML = html;
}

function bucketsForLevels(historyMap, habitHistory) {
  let dates = Object.keys(historyMap);
  let buckets = [];
  for (let level = 1; level <= 5; level++) {
    let total = 0, done = 0;
    for (let i = 0; i < dates.length; i++) {
      if (historyMap[dates[i]] === level) {
        total++;
        if (habitHistory[dates[i]] === true) { done++; }
      }
    }
    buckets.push({ label: String(level), value: total > 0 ? Math.round((done / total) * 100) : null, count: total });
  }
  return buckets;
}

function periodComparisonBuckets(habitHistory) {
  let dates = getLoggedDates();
  let periodTotal = 0, periodDone = 0, noPeriodTotal = 0, noPeriodDone = 0;
  for (let i = 0; i < dates.length; i++) {
    let d = dates[i];
    if (periodHistory[d] === true) {
      periodTotal++;
      if (habitHistory[d] === true) { periodDone++; }
    } else {
      noPeriodTotal++;
      if (habitHistory[d] === true) { noPeriodDone++; }
    }
  }
  return [
    { label: "Period", value: periodTotal > 0 ? Math.round((periodDone / periodTotal) * 100) : null, count: periodTotal },
    { label: "No Period", value: noPeriodTotal > 0 ? Math.round((noPeriodDone / noPeriodTotal) * 100) : null, count: noPeriodTotal }
  ];
}

/* ===== Shared chart helpers ===== */

function renderChartLegend(items) {
  let html = "<div class='chart-legend'>";
  for (let i = 0; i < items.length; i++) {
    html += "<div class='chart-legend-item'><span class='chart-legend-swatch' style='background-color:" + items[i].color + "'></span>" + items[i].label + "</div>";
  }
  html += "</div>";
  return html;
}

function renderBarChartSVG(bars, color) {
  let width = 320, height = 140;
  let left = 26, right = 8, top = 10, bottom = 26;
  let plotWidth = width - left - right;
  let plotHeight = height - top - bottom;
  let n = bars.length;
  let gap = 10;
  let barWidth = (plotWidth - gap * (n - 1)) / n;

  let svg = "<svg viewBox='0 0 " + width + " " + height + "' class='chart-svg'>";

  let gridValues = [0, 50, 100];
  for (let g = 0; g < gridValues.length; g++) {
    let v = gridValues[g];
    let y = top + (100 - v) / 100 * plotHeight;
    svg += "<line x1='" + left + "' y1='" + y + "' x2='" + (width - right) + "' y2='" + y + "' class='chart-gridline'/>";
    svg += "<text x='" + (left - 4) + "' y='" + (y + 3) + "' class='chart-axis-label' text-anchor='end'>" + v + "</text>";
  }

  for (let i = 0; i < n; i++) {
    let bar = bars[i];
    let x = left + i * (barWidth + gap);
    if (bar.value === null) {
      svg += "<text x='" + (x + barWidth / 2) + "' y='" + (top + plotHeight / 2) + "' class='chart-axis-label' text-anchor='middle'>—</text>";
    } else {
      let barHeight = (bar.value / 100) * plotHeight;
      let y = top + plotHeight - barHeight;
      svg += "<rect x='" + x + "' y='" + y + "' width='" + barWidth + "' height='" + barHeight + "' fill='" + color + "' rx='3'/>";
      svg += "<text x='" + (x + barWidth / 2) + "' y='" + (y - 4) + "' class='chart-value-label' text-anchor='middle'>" + bar.value + "%</text>";
    }
    svg += "<text x='" + (x + barWidth / 2) + "' y='" + (height - 6) + "' class='chart-axis-label' text-anchor='middle'>" + bar.label + "</text>";
  }

  svg += "</svg>";
  return svg;
}
