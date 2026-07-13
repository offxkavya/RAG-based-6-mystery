# RAG System Design & Documentation

This document outlines the architecture, knowledge base structure, and scoring algorithm for the AI Lab Assistant.
## 1. Knowledge Base Schema
The knowledge base contains syllabus-grounded documents with keywords, citations, and content. Each document represents an experiment, cation, anion or general concept.
## 2. Query Ranking & Scoring
We use a custom scoring algorithm. It assigns weights to search terms found in the title and keywords, then sums them up to rank the most relevant documents.
## 3. Sample Queries
- 'How to test for Pb2+'
- 'Why heat oxalic acid'
- 'Explain brown ring test'
### Lead Cation Test (Pb2+)
Lead forms white precipitate with HCl which dissolves in hot water. Confirmatory test is with KI yielding yellow lead iodide spangles.
### Copper Cation Test (Cu2+)
Copper forms black CuS ppt. Confirmed with K4[Fe(CN)6] giving chocolate brown ppt, or NH4OH giving deep blue tetraammine complex.
### Iron Cation Test (Fe3+)
Iron forms reddish brown hydroxide ppt. Confirmed with KSCN giving blood-red coloration or K4[Fe(CN)6] giving Prussian blue.
### Aluminum Cation Test (Al3+)
Aluminum forms white gelatinous ppt. Confirmed by Lake Test where Al(OH)3 adsorbs blue litmus dye, forming a blue lake.
### Nickel Cation Test (Ni2+)
Nickel forms black NiS in basic H2S. Confirmed with Dimethylglyoxime (DMG) in NH4OH giving bright cherry-red precipitate.
### Ammonium Test (NH4+)
Ammonium salts release pungent NH3 gas with NaOH. Confirmed with Nessler's reagent yielding a reddish-brown precipitate.
### Redox Titrations (KMnO4)
Titration of KMnO4 vs Mohr's salt (Fe2+ oxidized to Fe3+ at room temp) and Oxalic acid (oxidized to CO2, heated to 60-70C to speed up kinetics).
### Kinetics Demos
Study concentration and temperature effect on rates. Iodine clock reaction generates starch-iodine blue complex upon bisulfite exhaustion.
### Organic Group Tests
Carbohydrates tested via Molisch's and Fehling's tests. Proteins tested via Biuret (violet color) and Xanthoproteic tests (yellow color). Phenols yield violet color with FeCl3.
## 4. Search Fallback Mechanism
If no matching documents are found above the scoring threshold, the engine falls back to a default guidance response suggesting common Class 12 queries.
## 5. System Prompts & Grounding
The LLM system prompt forces the model to stay within Class 12 practical boundaries and use the context retrieved by local vector search.
