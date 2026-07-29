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
### Question Categories
Covers syllabus-focused topics including common ions effect and endpoints.
- Cation questions cover solubility products and Nessler reaction
- Titration questions cover autocalysis and indicator mechanisms
## 7. Adaptive Difficulty & Bayesian Tracker
Uses Bayesian Knowledge Tracing (BKT) to update mastery probability.
### Mastery State Variables
Contains values in [0,1] tracking learning probability for each syllabus area.
### BKT Core Variables
- P(L0): Initial probability of learning
- P(T): Transition probability
- P(G): Guess probability
- P(S): Slip probability
Updates mastery using conditional probability formulas upon user submissions.
## 8. Bayesian Posterior Equations
Recalculates mastery depending on whether the response is correct or wrong.
## 9. Performance Analytics
Monitors weaker categories to select relevant target exercises.
Categories below threshold (0.5) trigger remedial assistance recommendations.
## 10. Quiz Interface Component
Integrates progress charts, feedback modules, and next question triggers.
### Progress Visualizers
Displays mastery scores using real-time linear indicator bars.
### State Management
Maintains current question index, selected option, and answer status.
### Explanation Modal
Imparts immediate academic feedback describing details of the correct answer.
Restarting baseline updates resets all concept statistics to 0.15.
Shows aggregate score and concept updates on completion.
