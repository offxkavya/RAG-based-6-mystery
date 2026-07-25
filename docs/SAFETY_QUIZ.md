# Phase 4: Safety & Adaptive Quiz Systems

This guide explains safety classification rules and Bayesian mastery models.
## 1. Safety Report Interface
Checks hazard flags: isSafe, dangerLevel, hazardTitle, explanation, precautions.
## 2. Incompatible Chemicals Table
- conc. sulfuric acid + water -> extreme heat (hydration risk)
- ferrocyanides + strong acids -> toxic HCN release
## 3. Hydration Hazard
Mixing water into concentrated sulfuric acid causes instantaneous steam pockets and acid splattering.
Always add acid to water slowly with constant stirring.
## 4. Toxic Gas Dangers
Liberation of gases like H2S, Cl2, NO2, and SO2 requires ventilation cautions.
## 5. Organic Hazards
Phenols are corrosive and nitric acid nitrations can trigger runaway combustion.

Rule-based safety system prevents dangerous mixtures prior to vessel updates.
## 6. Viva Quiz System
Tracks understanding across cation, anion, titration, kinetics and organic questions.
### Question Interface
Properties: id, category, question, options, correctAnswerIndex, explanation.
