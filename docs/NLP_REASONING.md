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
