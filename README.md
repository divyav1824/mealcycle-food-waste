# MealCycle AI — Smart Food Waste Prevention & Canteen Decision Support

**1M1B × IBM SkillsBuild AI for Sustainability Internship Project**  
*Aligned with UN Sustainable Development Goal 12: Responsible Consumption and Production (Target 12.3)*

---

## 📌 Project Overview
Every day, canteen staff must estimate meal quantities for hundreds of students, leading to significant avoidable food waste or sudden shortfalls. **MealCycle AI** is a human-in-the-loop decision-support system that combines machine learning demand forecasting, natural language note parsing, and Retrieval-Augmented Generation (RAG) for food safety compliance.

The system does **not** replace kitchen staff; it provides a data-backed recommendation docket while preserving human authority over final batch sizes.

---

## 🚀 Key Features & Capabilities

1. **Demand Predictor (Machine Learning Model)**
   - **Algorithm:** Multiple Linear Regression trained on 180 canteen service days.
   - **Model Inputs:** Expected student headcount, Day of week, Menu category, Campus events, Exam periods, and Holidays.
   - **Performance:** $R^2 \approx 0.864$, $\text{MAE} \approx 25.04$ portions.
   - **Human Safety Buffer:** Configurable buffer slider (+0% to +20%, default +6%) generating a printable digital prep docket.

2. **AI Kitchen Note Extractor (Prompt Engineering)**
   - Parses informal, free-text kitchen logs (e.g., *"Tomorrow is Wednesday, expecting 480 students with festive menu during placement drive"*) into structured model inputs with instant entity tag visualization.

3. **Surplus & Safety RAG Assistant (Retrieval-Augmented Generation)**
   - Logs end-of-service leftovers and calculates waste ratios using an interactive SVG circular gauge.
   - Queries institutional food safety guidelines using keyword vector matching to ensure leftover food handling complies with official safety policies.

4. **What-If Scenario Simulator (SDG 12 Impact)**
   - Real-time side-by-side comparison of baseline vs. adjusted turnout scenarios.
   - Calculates financial savings ($ at $2.50/portion) and avoided carbon footprint ($0.8\text{ kg CO}_2\text{e}$ per portion saved).

5. **Executive Analytics Dashboard**
   - Renders weekly prepared vs. consumed trends with custom SVG visualization.
   - Generates a 1-click executive digest for canteen management.

6. **Responsible AI Governance Framework**
   - **Fairness:** Aggregated headcounts only; no individual student tracking.
   - **Transparency:** Explicit breakdown of base forecast vs. safety buffer.
   - **Human-in-the-Loop:** Recommendations strictly require staff confirmation.
   - **Privacy & Safety:** Zero PII processed; safety guardrails prevent unauthorized food safety claims.

---

## 📂 Project Structure
```
mealcycle-ai/
├── index.html       # Single-Page Application (Overview, Predictor, Surplus, Simulator, Analytics, Specs)
├── styles.css       # Custom Obsidian Dark Theme, Thermal Docket Styling, Responsive Layouts
├── app.js           # ML Regression Engine, Entity Parser, RAG Matcher, Chart Generator
└── README.md        # Project Documentation for IBM SkillsBuild Submission
```

---

## 🛠️ How to Run Locally

### Option A: Using Python Simple Server (Recommended)
1. Open terminal in the project directory:
   ```bash
   cd C:\Users\divya\.gemini\antigravity\scratch\mealcycle-ai
   ```
2. Start local server:
   ```bash
   python -m http.server 3000
   ```
3. Open browser at: `http://localhost:3000`

### Option B: Direct Browser Access
Simply double-click `index.html` or open `index.html` in Chrome/Edge/Firefox.

---

## 📊 Technical Model Specifications
- **Regression Intercept:** $11.7532$
- **Student Coefficient:** $0.8510$
- **Event Coefficient:** $+50.8643$
- **Exam Coefficient:** $-60.6258$
- **Holiday Coefficient:** $-185.4583$
- **Day Coefficients:** Monday ($-36.58$), Tuesday ($-32.33$), Wednesday ($-20.86$), Thursday ($-38.07$), Friday ($0$), Saturday ($-80.19$), Sunday ($-121.12$).
- **Menu Coefficients:** Light Menu ($0$), Regular Rotation ($+39.16$), Rice+Dal+Veg ($+39.78$), Special/Festive ($+67.73$).

---

## 📜 Submission Checklist (IBM SkillsBuild / 1M1B)
- [x] Functional Prototype Web Application
- [x] Machine Learning Demand Forecasting Model
- [x] Natural Language Entity Extraction
- [x] Grounded RAG Food Safety Assistant
- [x] Impact Assessment (CO₂e & Cost Savings)
- [x] Responsible AI Governance & Ethical Framework
- [x] README & System Documentation
