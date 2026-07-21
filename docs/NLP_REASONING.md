# Phase 3: NLP & Reaction Reasoning Engine

This guide covers the Class 12 Chemistry Lab simulation parser and graph-based inference rules.
## 1. Input Parsing Schema
Natural language requests are evaluated for actions, chemicals, and confidence score parameters.
## 2. Action Classification
Uses regular expressions to extract standard actions: add, heat, stir, filter, titrate, clear, and help.
## 3. Chemical Formula Extraction
Matches chemical formula patterns (e.g. CuSO4, Pb(NO3)2) against synonyms from the chemical database.
## 4. Compound Synonyms Mapping
Every chemical has synonyms list containing IUPAC names, colloquial names, and chemical formulas.
## 5. Common Names Mapping
Maps common inputs like 'blue vitriol' to CuSO4 and 'baking soda' to NaHCO3.
- Baking Soda -> NaHCO3 (Sodium Bicarbonate)
- Blue Vitriol -> CuSO4 (Copper Sulfate Pentahydrate)
## 6. Query Ambiguities Resolution
If multiple overlapping keywords are found, the parser triggers clarification prompts.
## 7. Clarification Dialogue
Prompts request the user to clarify if they meant SO4(2-) or SO3(2-), and NO3(-) or NO2(-).
## 8. Query Type Inference
Confidence score determines if the query is an experimental action or a RAG question.
- 'test for lead' -> maps to adding Pb(NO3)2 and HCl
- 'test for copper' -> maps to adding CuSO4 and NH4OH
- 'test for chloride' -> maps to adding NaCl and AgNO3

NLP Parser provides mapping of text inputs to simulated reactions with high safety bounds.
## 9. Reaction Reasoning Engine
Evaluates mixed chemical products, states, gas evolution, and thermal properties.
### ReactionOutcome Schema
Fields: color, precipitate, gas, temperatureEffect, balancedEquation, inference, explanation.
### Solution Color Calculations
Determined by hydrated metal ion complexes (e.g. blue for Cu2+, yellow/brown for Fe3+).
### Precipitate Types
- gelatinous: Al(OH)3, Fe(OH)3
- curdy: AgCl
- crystalline: PbCl2
### Gas Evolution Bubbles
Colorless CO2 (effervescence), toxic H2S (rotten eggs), pungent NH3 (basic), brown NO2 (acidic).
- Pb(2+) + HCl -> PbCl2 (white ppt, soluble on heating)
- Pb(2+) + KI -> PbI2 (yellow precipitate, recrystallizes as golden spangles)
- Pb(2+) + K2CrO4 -> PbCrO4 (yellow ppt, insoluble in acetic acid)
- Cu(2+) + NaOH/NH4OH -> Cu(OH)2 (pale blue precipitate)
- Cu(OH)2 + excess NH4OH -> [Cu(NH3)4]2+ (inky blue solution)
- Cu(2+) + K4[Fe(CN)6] -> Cu2[Fe(CN)6] (chocolate brown precipitate)
- Fe(3+) + NH4OH -> Fe(OH)3 (reddish brown gelatinous precipitate)
- Fe(3+) + KSCN -> [Fe(SCN)]2+ (intense blood-red complex solution)
- Fe(3+) + K4[Fe(CN)6] -> Fe4[Fe(CN)6]3 (Prussian blue precipitate)
- Al(3+) + litmus + NH4OH -> Al(OH)3 (blue litmus adsorbed floating blue lake)
