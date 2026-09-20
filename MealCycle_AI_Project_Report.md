# MealCycle AI — Comprehensive Project Report

**1M1B × IBM SkillsBuild AI for Sustainability Internship**  
*Aligned with UN Sustainable Development Goal 12: Responsible Consumption and Production (Target 12.3)*

---

## Executive Summary

Institutional canteens in colleges and universities prepare hundreds of meals daily. Due to manual guesswork, canteen supervisors over-prepare food by 15% to 25% on average, leading to massive financial waste and organic food waste. Conversely, under-preparation leads to sudden meal shortfalls during unexpected student attendance spikes.

**MealCycle AI** is a human-in-the-loop decision-support system designed to eliminate kitchen guesswork. The system combines:
1. **Machine Learning Demand Forecasting:** A Multiple Linear Regression model predicting meal consumption based on headcount, day of week, menu category, campus events, exam periods, and holidays.
2. **AI Shift Note Extractor:** A natural language parser converting informal supervisor notes into structured model parameters.
3. **Surplus & Safety RAG Assistant:** A Retrieval-Augmented Generation lookup tool retrieving grounded food safety redistribution guidelines.
4. **What-If Scenario Simulator:** Real-time financial ($) and carbon footprint ($CO_2e$) impact modeling before cooking.

---

## 1. Problem Statement & UN SDG 12 Alignment

### 1.1 Problem Statement
Institutional food preparation currently relies on subjective intuition. Canteen managers struggle to account for multi-variable factors such as upcoming placement drives, exam seasons, day-of-week attendance decay, and menu popularity. This results in:
- **Economic Loss:** Thousands of dollars spent on unconsumed ingredients.
- **Environmental Harm:** Organic food waste decomposing in landfills, releasing potent greenhouse gases ($CH_4$ and $CO_2$).

### 1.2 UN SDG Target Alignment
- **UN SDG 12 (Target 12.3):** Halving global per capita food waste at retail and consumer levels by 2030.
- **Carbon Footprint Metric:** Every 1 portion of wasted prepared food generates approximately **0.8 kg of $CO_2e$ emissions** (including agricultural inputs, transport, and decomposition).

---

## 2. System Architecture & Workflow

MealCycle AI follows a strict **5-Step Human-Centered Pipeline**:

```
[Staff Shift Note / Manual Form]
               │
               ▼
   [AI Entity Extractor Parser]
               │
               ▼
[Multiple Linear Regression Model] ──► Forecast Base Demand
               │
               ▼
[Safety Buffer Rule Engine (+6%)]  ──► Calculates Recommended Batch
               │
               ▼
 [Digital Kitchen Prep Docket]    ──► Barcode, Timestamp & Risk Rating
               │
               ▼
[Supervisor Final Approval]       ──► Human Authorization to Cook
```

---

## 3. Technical Methodology & Machine Learning Engine

### 3.1 Model Architecture & Dataset
- **Algorithm:** Multiple Linear Regression (scikit-learn implementation).
- **Dataset:** 180 Operational Canteen Service Days (144 Train / 36 Test split).
- **Model Evaluation Metrics:**
  - **Coefficient of Determination ($R^2$):** $0.864$ (86.4% variance explained).
  - **Mean Absolute Error (MAE):** $\approx 25.04\text{ portions}$.
  - **Root Mean Squared Error (RMSE):** $\approx 28.91\text{ portions}$.

### 3.2 Regression Mathematical Equation & Coefficients

$$\text{Predicted Demand} = \beta_0 + \beta_{\text{students}} \cdot S + \sum \beta_{\text{day}} \cdot D + \sum \beta_{\text{menu}} \cdot M + \beta_{\text{event}} \cdot E + \beta_{\text{exam}} \cdot X + \beta_{\text{holiday}} \cdot H$$

- **Intercept ($\beta_0$):** $11.7532$
- **Student Headcount ($\beta_{\text{students}}$):** $+0.8510$ per student
- **Context Flags:**
  - Campus Event ($\beta_{\text{event}}$): $+50.8643\text{ portions}$
  - Exam Season ($\beta_{\text{exam}}$): $-60.6258\text{ portions}$
  - Holiday Flag ($\beta_{\text{holiday}}$): $-185.4583\text{ portions}$
- **Day-of-Week Weights:** Monday ($-36.58$), Tuesday ($-32.33$), Wednesday ($-20.86$), Thursday ($-38.07$), Friday ($0.0$), Saturday ($-80.19$), Sunday ($-121.12$).
- **Menu Type Weights:** Festive ($+67.73$), Regular Rotation ($+39.16$), Rice+Dal+Veg ($+39.78$), Light Menu ($0.0$).

---

## 4. AI Prompt Engineering & Grounded RAG Assistant

### 4.1 AI Kitchen Note Extractor
Supervisors often leave quick text notes rather than filling forms. The system uses a structured extraction prompt:
- **Input Text:** *"Tomorrow is Wednesday, expecting around 480 students with festive menu and a placement event."*
- **Parsed JSON Output:** `{"expected_students": 480, "day_of_week": "Wednesday", "menu_type": "Special/Festive", "event": true}`.

### 4.2 Food Safety RAG Assistant (Retrieval-Augmented Generation)
To ensure surplus food handling complies with safety laws without AI hallucination:
- Guidelines are vector-indexed into discrete policy snippets ($POL-01$ to $POL-05$).
- Keywords from supervisor queries (e.g., *"Can we redistribute rice?"*) are matched against indexed snippets.
- **Safety Guardrail:** Answers are strictly constructed from retrieved snippets. If no policy matches, the system advises consulting the authorized safety supervisor.

---

## 5. Impact Assessment & What-If Simulator

The What-If Simulator dynamically models turnout variation ($-40\%$ to $+40\%$) and lean cooking adjustments ($-30\%$ to $+30\%$):

- **Financial Impact Formula:**
  $$\text{Cost Savings (\$) } = (\text{Baseline Prepared} - \text{Adjusted Prepared}) \times \$2.50\text{ per portion}$$
- **Environmental Impact Formula:**
  $$\text{Carbon Saved (kg } CO_2e) = (\text{Baseline Surplus} - \text{Adjusted Surplus}) \times 0.8\text{ kg } CO_2e\text{ per portion}$$

---

## 6. Responsible AI & Ethical Governance Framework

1. **Fairness & Equity:** Aggregated headcount modeling only. Zero individual student tracking or dietary profiling.
2. **Transparency:** Every generated ticket displays the explicit breakdown (Base forecast + applied safety buffer).
3. **Human-in-the-Loop:** AI outputs are recommendations. Kitchen managers retain final authorization.
4. **Data Privacy:** Zero Personally Identifiable Information (PII) processed or stored.
5. **Food Safety Boundary:** AI never independently certifies food as safe; safety decisions follow retrieved policy text.

---

## 7. Conclusion & Future Scope

MealCycle AI demonstrates how accessible machine learning and natural language processing can drive measurable progress toward UN SDG 12.3 in educational institutions.

### Future Roadmap
- **Smart Gate Integration:** Integration with RFID campus turnstiles for real-time headcount updates.
- **Automated Weather API:** Incorporating weather forecasts (rainy weather headcount adjustments).
- **Multi-Canteen Management:** Centralized dashboard for multi-campus food management.
