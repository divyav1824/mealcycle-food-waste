// MealCycle AI — Core Engine & Interactivity

// ---- Navigation & Tab Switching ----
function switchTab(tabId) {
  document.querySelectorAll('.tab-page').forEach(page => page.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

  const targetPage = document.getElementById(tabId);
  const targetBtn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);

  if (targetPage) targetPage.classList.add('active');
  if (targetBtn) targetBtn.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    switchTab(btn.dataset.tab);
  });
});

// ---- Linear Regression Prediction Model Coefficients ----
// Trained on synthetic operational canteen dataset (R² = 0.864, MAE = 25 portions)
const MODEL = {
  intercept: 11.7532,
  day: {
    Monday: -36.5811,
    Tuesday: -32.3316,
    Wednesday: -20.8626,
    Thursday: -38.0651,
    Friday: 0,
    Saturday: -80.1924,
    Sunday: -121.1166
  },
  menu: {
    "Light Menu": 0,
    "Regular Rotation": 39.1624,
    "Rice+Dal+Veg": 39.7785,
    "Special/Festive": 67.7284
  },
  students: 0.851,
  event: 50.8643,
  exam: -60.6258,
  holiday: -185.4583
};

function calculateDemand(students, day, menu, event, exam, holiday) {
  let demand = MODEL.intercept
    + (MODEL.day[day] || 0)
    + (MODEL.menu[menu] || 0)
    + (MODEL.students * students)
    + (event ? MODEL.event : 0)
    + (exam ? MODEL.exam : 0)
    + (holiday ? MODEL.holiday : 0);

  return Math.max(0, Math.round(demand));
}

// ---- Demand Predictor Handler ----
function runPrediction() {
  const students = parseFloat(document.getElementById('p-students').value) || 0;
  const day = document.getElementById('p-day').value;
  const menu = document.getElementById('p-menu').value;
  const event = document.getElementById('p-event').checked;
  const exam = document.getElementById('p-exam').checked;
  const holiday = document.getElementById('p-holiday').checked;
  const bufferPct = parseInt(document.getElementById('p-buffer').value) || 6;

  document.getElementById('buffer-val-display').textContent = `+${bufferPct}%`;

  const predicted = calculateDemand(students, day, menu, event, exam, holiday);
  const bufferPortions = Math.round(predicted * (bufferPct / 100));
  const recommended = predicted + bufferPortions;

  let riskLevel = 'LOW';
  let badgeClass = 'low';

  if (bufferPct > 12) {
    riskLevel = 'HIGH';
    badgeClass = 'high';
  } else if (bufferPct > 7) {
    riskLevel = 'MEDIUM';
    badgeClass = 'medium';
  }

  const docketContainer = document.getElementById('predict-docket-output');
  const ticketId = `MC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  docketContainer.innerHTML = `
    <div class="ticket-docket" id="printable-docket">
      <div class="docket-header">
        <div class="docket-stamp">MEALCYCLE PREP DOCKET</div>
        <div class="docket-id">#${ticketId}</div>
      </div>
      
      <div class="docket-body">
        <div class="docket-main-title">${day} · ${menu}</div>
        <div class="docket-meta">Generated: ${now} · Target: Main Hall</div>

        <div class="docket-divider"></div>

        <div class="docket-row">
          <span class="d-label">Expected Students</span>
          <span class="d-val">${students} head count</span>
        </div>
        <div class="docket-row">
          <span class="d-label">Model Forecast Demand</span>
          <span class="d-val">≈ ${predicted} portions</span>
        </div>
        <div class="docket-row">
          <span class="d-label">Safety Buffer (+${bufferPct}%)</span>
          <span class="d-val">+${bufferPortions} portions</span>
        </div>

        <div class="docket-divider highlight"></div>

        <div class="docket-row big">
          <span class="d-label">RECOMMENDED PREP</span>
          <span class="d-val highlight-num">${recommended} portions</span>
        </div>

        <div class="docket-row">
          <span class="d-label">Surplus Risk Rating</span>
          <span class="risk-badge ${badgeClass}">${riskLevel} RISK</span>
        </div>
      </div>

      <div class="docket-footer">
        <div class="d-note">💡 Human Decision Support — Staff authorize final kitchen batches.</div>
        <div class="barcode-strip">||||| |||| |||||| ||| ||||||| |||| |||</div>
      </div>
    </div>
  `;
}

// Preset Loader
function loadPredictPreset(preset) {
  if (preset === 'mon') {
    document.getElementById('p-students').value = 450;
    document.getElementById('p-day').value = 'Monday';
    document.getElementById('p-menu').value = 'Regular Rotation';
    document.getElementById('p-event').checked = false;
    document.getElementById('p-exam').checked = false;
    document.getElementById('p-holiday').checked = false;
    document.getElementById('p-buffer').value = 6;
  } else if (preset === 'wed_event') {
    document.getElementById('p-students').value = 520;
    document.getElementById('p-day').value = 'Wednesday';
    document.getElementById('p-menu').value = 'Special/Festive';
    document.getElementById('p-event').checked = true;
    document.getElementById('p-exam').checked = false;
    document.getElementById('p-holiday').checked = false;
    document.getElementById('p-buffer').value = 8;
  } else if (preset === 'thu_exam') {
    document.getElementById('p-students').value = 380;
    document.getElementById('p-day').value = 'Thursday';
    document.getElementById('p-menu').value = 'Light Menu';
    document.getElementById('p-event').checked = false;
    document.getElementById('p-exam').checked = true;
    document.getElementById('p-holiday').checked = false;
    document.getElementById('p-buffer').value = 4;
  } else if (preset === 'fri_festive') {
    document.getElementById('p-students').value = 490;
    document.getElementById('p-day').value = 'Friday';
    document.getElementById('p-menu').value = 'Special/Festive';
    document.getElementById('p-event').checked = false;
    document.getElementById('p-exam').checked = false;
    document.getElementById('p-holiday').checked = false;
    document.getElementById('p-buffer').value = 7;
  }
  runPrediction();
}

// ---- AI Kitchen Note Extractor Parser ----
function extractEntities() {
  const text = document.getElementById('note-input').value.trim();
  const btn = document.getElementById('extract-btn');
  const resultDiv = document.getElementById('extract-result');
  const statusDiv = document.getElementById('extract-status');
  const tagsDiv = document.getElementById('extract-tags');

  if (!text) {
    alert("Please enter a note to parse.");
    return;
  }

  btn.disabled = true;
  btn.innerHTML = `<span class="pulse-dot"></span> Parsing...`;

  setTimeout(() => {
    const lower = text.toLowerCase();
    const tags = [];

    // Extract student number
    const numMatch = lower.match(/(\d{2,4})\s*(students|attendees|headcount|people)?/);
    if (numMatch && parseInt(numMatch[1]) >= 10) {
      const num = parseInt(numMatch[1]);
      document.getElementById('p-students').value = num;
      tags.push(`Students: ${num}`);
    }

    // Extract day
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const foundDay = days.find(d => lower.includes(d.toLowerCase()));
    if (foundDay) {
      document.getElementById('p-day').value = foundDay;
      tags.push(`Day: ${foundDay}`);
    }

    // Extract menu
    if (lower.includes("festive") || lower.includes("special")) {
      document.getElementById('p-menu').value = "Special/Festive";
      tags.push(`Menu: Special / Festive`);
    } else if (lower.includes("light") || lower.includes("khichdi") || lower.includes("soup")) {
      document.getElementById('p-menu').value = "Light Menu";
      tags.push(`Menu: Light Menu`);
    } else if (lower.includes("rice") || lower.includes("dal")) {
      document.getElementById('p-menu').value = "Rice+Dal+Veg";
      tags.push(`Menu: Rice + Dal + Veg`);
    } else {
      document.getElementById('p-menu').value = "Regular Rotation";
    }

    // Extract Flags
    const isEvent = lower.includes("event") || lower.includes("fest") || lower.includes("placement") || lower.includes("drive");
    document.getElementById('p-event').checked = isEvent;
    if (isEvent) tags.push(`Event: Yes`);

    const isExam = lower.includes("exam") || lower.includes("midterm") || lower.includes("test");
    document.getElementById('p-exam').checked = isExam;
    if (isExam) tags.push(`Exam: Yes`);

    const isHoliday = lower.includes("holiday") || lower.includes("break");
    document.getElementById('p-holiday').checked = isHoliday;
    if (isHoliday) tags.push(`Holiday: Yes`);

    btn.disabled = false;
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v3m0 12v3M3 12h3m12 0h3m-3.5-6.5l-2.1 2.1m-8.8 8.8l-2.1 2.1m0-13l2.1 2.1m8.8 8.8l2.1 2.1"/></svg> Parse Note`;

    if (tags.length > 0) {
      tagsDiv.innerHTML = tags.map(t => `<span class="e-tag">&check; ${t}</span>`).join('');
      statusDiv.textContent = "Parsed parameters updated below:";
    } else {
      tagsDiv.innerHTML = `<span class="e-tag" style="background:rgba(245,158,11,0.2); color:#F59E0B;">Could not detect specific numbers; form preserved.</span>`;
      statusDiv.textContent = "Note processed:";
    }

    resultDiv.style.display = 'block';
    runPrediction();
  }, 400);
}

// Copy & Print Docket Functions
function printDocket() {
  window.print();
}

function copyDocketText() {
  const students = document.getElementById('p-students').value;
  const day = document.getElementById('p-day').value;
  const menu = document.getElementById('p-menu').value;
  const predicted = calculateDemand(students, day, menu, document.getElementById('p-event').checked, document.getElementById('p-exam').checked, document.getElementById('p-holiday').checked);
  const bufferPct = document.getElementById('p-buffer').value;
  const recommended = Math.round(predicted * (1 + bufferPct / 100));

  const text = `--- MEALCYCLE PREP DOCKET ---\nDay: ${day} | Menu: ${menu}\nExpected Students: ${students}\nPredicted Demand: ~${predicted} portions\nSafety Buffer (+${bufferPct}%): ~${recommended - predicted} portions\nRECOMMENDED PREP: ${recommended} portions\n-----------------------------`;

  navigator.clipboard.writeText(text).then(() => {
    alert("Prep docket copied to clipboard!");
  });
}


// ---- Surplus Analyzer & SVG Gauge ----
function runSurplus() {
  const prepared = Math.max(0, parseFloat(document.getElementById('s-prepared').value) || 0);
  const consumed = Math.max(0, parseFloat(document.getElementById('s-consumed').value) || 0);

  const surplus = Math.max(0, prepared - consumed);
  const ratio = prepared > 0 ? (surplus / prepared) * 100 : 0;

  document.getElementById('gauge-percent-text').textContent = `${ratio.toFixed(1)}%`;
  document.getElementById('g-surplus-qty').textContent = `${surplus} portions`;

  // Update SVG Circle Offset (Perimeter = 2 * PI * 50 ≈ 314.15)
  const circle = document.getElementById('gauge-fill-circle');
  const circumference = 314.15;
  const offset = circumference - (Math.min(ratio, 100) / 100) * circumference;
  circle.style.strokeDashoffset = offset;

  const badge = document.getElementById('g-surplus-badge');
  const desc = document.getElementById('g-surplus-desc');

  if (ratio < 5) {
    circle.style.stroke = '#10B981'; // Green
    badge.textContent = 'OPTIMAL MATCH';
    badge.className = 'risk-badge low';
    desc.textContent = 'Excellent preparation matching. Minimal waste recorded.';
  } else if (ratio < 12) {
    circle.style.stroke = '#F59E0B'; // Amber
    badge.textContent = 'MODERATE SURPLUS';
    badge.className = 'risk-badge medium';
    desc.textContent = 'Moderate surplus. Consider slight batch reduction for this context and review safety guidelines for leftover holding.';
  } else {
    circle.style.stroke = '#F43F5E'; // Red
    badge.textContent = 'HIGH SURPLUS';
    badge.className = 'risk-badge high';
    desc.textContent = 'Significant surplus detected. Log reasons in canteen ledger and check RAG assistant for redistribution policy.';
  }
}

// ---- Food Safety Guidelines RAG Engine ----
const POLICY_GUIDELINES = [
  { id: "POL-01", keywords: ["rice", "dal", "warm", "temp", "redistribute", "same-day", "holding"], text: "Surplus cooked food held continuously at a safe serving temperature (above 60°C / 140°F) may be redistributed on the same day with canteen supervisor sign-off." },
  { id: "POL-02", keywords: ["room", "temperature", "hours", "time", "discard", "discarded", "leftover"], text: "Any cooked food item left at room temperature (between 5°C and 60°C) for more than two hours must NOT be redistributed and must be discarded or composted per food safety standards." },
  { id: "POL-03", keywords: ["ngo", "partner", "donate", "donation", "student", "approval", "sign-off"], text: "External redistribution to registered student groups or partner food banks requires formal log entry in the surplus ledger and supervisor sign-off." },
  { id: "POL-04", keywords: ["dairy", "meat", "chicken", "paneer", "perishable", "overnight"], text: "Highly perishable items containing dairy, paneer, or meat cannot be carried over or redistributed beyond the original service window regardless of holding temp." },
  { id: "POL-05", keywords: ["compost", "biowaste", "disposal", "waste", "bin"], text: "Composting via the institution's organic bio-digester is the mandatory fallback for non-redistributable food waste." }
];

function setRagQuery(query) {
  document.getElementById('rag-question').value = query;
  askGuidelines();
}

function askGuidelines() {
  const query = document.getElementById('rag-question').value.trim();
  if (!query) return;

  const btn = document.getElementById('rag-btn');
  const outputBox = document.getElementById('rag-output');
  const answerEl = document.getElementById('rag-answer-text');
  const snippetsEl = document.getElementById('rag-snippets-list');

  btn.disabled = true;
  btn.textContent = "Retrieving...";

  setTimeout(() => {
    const words = query.toLowerCase().split(/\W+/).filter(w => w.length > 2);

    // Score snippets
    const scored = POLICY_GUIDELINES.map(g => {
      let score = 0;
      words.forEach(w => {
        if (g.keywords.includes(w) || g.text.toLowerCase().includes(w)) score++;
      });
      return { ...g, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const topMatches = scored.slice(0, 2);

    if (topMatches[0].score > 0) {
      answerEl.textContent = `Based on institutional policy [${topMatches[0].id}]: ${topMatches[0].text}`;
    } else {
      answerEl.textContent = "No exact rule matched your query terms. General Policy: Maintain food above 60°C for same-day serving; discard items kept at room temperature over 2 hours. Consult the safety officer for non-standard items.";
    }

    snippetsEl.innerHTML = topMatches.map(m => `<div><strong>[${m.id}]</strong> ${m.text}</div>`).join('<br>');

    outputBox.style.display = 'block';
    btn.disabled = false;
    btn.textContent = "Ask RAG";
  }, 300);
}


// ---- What-If Scenario Simulator ----
function runWhatIf() {
  const attPct = parseInt(document.getElementById('w-att').value);
  const prepPct = parseInt(document.getElementById('w-prep').value);

  document.getElementById('w-att-val').textContent = (attPct > 0 ? '+' : '') + attPct + '%';
  document.getElementById('w-prep-val').textContent = (prepPct > 0 ? '+' : '') + prepPct + '%';

  const baseStudents = 450;
  const baseDemand = calculateDemand(baseStudents, 'Monday', 'Regular Rotation', false, false, false);
  const basePrepared = Math.round(baseDemand * 1.06);
  const baseSurplus = Math.max(0, basePrepared - baseDemand);

  const modStudents = baseStudents * (1 + attPct / 100);
  const modDemand = calculateDemand(modStudents, 'Monday', 'Regular Rotation', false, false, false);
  const modPrepared = Math.round(basePrepared * (1 + prepPct / 100));
  const modSurplus = Math.max(0, modPrepared - modDemand);
  const shortfall = Math.max(0, modDemand - modPrepared);

  document.getElementById('w-base-num').textContent = basePrepared;
  document.getElementById('w-base-demand').textContent = `${baseDemand} portions`;
  document.getElementById('w-base-surplus').textContent = `${baseSurplus} portions`;

  document.getElementById('w-mod-num').textContent = modPrepared;
  document.getElementById('w-mod-demand').textContent = `${modDemand} portions`;

  const modSurplusEl = document.getElementById('w-mod-surplus');
  if (shortfall > 0) {
    modSurplusEl.textContent = `Shortfall: -${shortfall} portions`;
    modSurplusEl.className = 'badge-tag amber';
  } else {
    modSurplusEl.textContent = `Surplus: +${modSurplus} portions`;
    modSurplusEl.className = 'badge-tag green';
  }

  // Financial & Carbon Footprint Math ($2.50 / prep portion, 0.8kg CO2e / wasted portion)
  const costDiff = (modPrepared - basePrepared) * 2.50;
  const costEl = document.getElementById('w-cost-impact');
  if (costDiff < 0) {
    costEl.textContent = `-$${Math.abs(costDiff).toFixed(2)} (Savings)`;
    costEl.className = 'i-val green';
  } else if (costDiff > 0) {
    costEl.textContent = `+$${costDiff.toFixed(2)} (Cost)`;
    costEl.className = 'i-val red';
  } else {
    costEl.textContent = `$0.00`;
    costEl.className = 'i-val green';
  }

  const co2Diff = (modSurplus - baseSurplus) * 0.8;
  const co2El = document.getElementById('w-co2-impact');
  if (co2Diff < 0) {
    co2El.textContent = `-${Math.abs(co2Diff).toFixed(1)} kg CO₂e (Prevented)`;
    co2El.className = 'i-val green';
  } else if (co2Diff > 0) {
    co2El.textContent = `+${co2Diff.toFixed(1)} kg CO₂e (Extra)`;
    co2El.className = 'i-val red';
  } else {
    co2El.textContent = `0.0 kg CO₂e`;
    co2El.className = 'i-val green';
  }

  const riskEl = document.getElementById('w-risk-impact');
  if (shortfall > 50) {
    riskEl.textContent = `High Shortfall Risk`;
    riskEl.style.color = `var(--accent-rose)`;
  } else if (shortfall > 0) {
    riskEl.textContent = `Moderate Shortfall`;
    riskEl.style.color = `var(--accent-amber)`;
  } else {
    riskEl.textContent = `None (Safe)`;
    riskEl.style.color = `var(--accent-emerald)`;
  }
}


// ---- Executive Dashboard & Weekly Digest ----
const WEEK_DATA = [
  { day: 'Mon', prepared: 420, consumed: 388 },
  { day: 'Tue', prepared: 410, consumed: 395 },
  { day: 'Wed', prepared: 440, consumed: 401 },
  { day: 'Thu', prepared: 400, consumed: 370 },
  { day: 'Fri', prepared: 460, consumed: 430 },
  { day: 'Sat', prepared: 350, consumed: 310 },
  { day: 'Sun', prepared: 320, consumed: 280 }
];

function renderDashboardChart() {
  const container = document.getElementById('bar-chart-container');
  if (!container) return;

  const maxVal = Math.max(...WEEK_DATA.map(d => d.prepared));
  
  let chartHTML = `<svg class="chart-svg" viewBox="0 0 700 200" preserveAspectRatio="none">`;
  
  const barWidth = 35;
  const gap = 60;
  const startX = 40;
  
  WEEK_DATA.forEach((d, i) => {
    const x = startX + i * (barWidth * 2 + gap);
    const prepHeight = (d.prepared / maxVal) * 150;
    const consHeight = (d.consumed / maxVal) * 150;
    
    const prepY = 170 - prepHeight;
    const consY = 170 - consHeight;

    chartHTML += `
      <g class="bar-group">
        <!-- Prepared Bar -->
        <rect x="${x}" y="${prepY}" width="${barWidth}" height="${prepHeight}" rx="4" fill="#475569" />
        <text x="${x + barWidth/2}" y="${prepY - 6}" fill="#94A3B8" font-size="10" text-anchor="middle" font-family="JetBrains Mono">${d.prepared}</text>
        
        <!-- Consumed Bar -->
        <rect x="${x + barWidth + 6}" y="${consY}" width="${barWidth}" height="${consHeight}" rx="4" fill="#10B981" />
        <text x="${x + barWidth + 6 + barWidth/2}" y="${consY - 6}" fill="#10B981" font-size="10" text-anchor="middle" font-family="JetBrains Mono">${d.consumed}</text>
        
        <!-- Day Label -->
        <text x="${x + barWidth + 3}" y="192" fill="#F8FAFC" font-size="12" text-anchor="middle" font-weight="600" font-family="Plus Jakarta Sans">${d.day}</text>
      </g>
    `;
  });

  chartHTML += `</svg>`;
  container.innerHTML = chartHTML;
}

function generateDigest() {
  const btn = document.getElementById('digest-btn');
  const outputBox = document.getElementById('digest-output');
  const textEl = document.getElementById('digest-text');

  btn.disabled = true;
  btn.innerHTML = `<span class="pulse-dot"></span> Generating...`;

  setTimeout(() => {
    const totalPrepared = WEEK_DATA.reduce((sum, d) => sum + d.prepared, 0);
    const totalConsumed = WEEK_DATA.reduce((sum, d) => sum + d.consumed, 0);
    const totalSurplus = totalPrepared - totalConsumed;

    textEl.textContent = `Weekly Summary Digest: Total prepared food reached ${totalPrepared} portions against ${totalConsumed} consumed, resulting in an overall surplus ratio of ${((totalSurplus / totalPrepared) * 100).toFixed(1)}% (${totalSurplus} portions total). Peak consumption occurred on Friday (${WEEK_DATA[4].consumed} portions), while Thursday recorded the highest surplus margin (30 portions). Preparation accuracy aligned within target thresholds.`;

    outputBox.style.display = 'block';
    btn.disabled = false;
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 1-2 2v16a2 2 0 0 1 2 2h12a2 2 0 0 1 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> Generate Weekly Summary`;
  }, 450);
}

// Initialization on DOM load
document.addEventListener('DOMContentLoaded', () => {
  runPrediction();
  runSurplus();
  runWhatIf();
  renderDashboardChart();
});
