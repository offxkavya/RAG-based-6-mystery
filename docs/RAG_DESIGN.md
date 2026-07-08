# RAG System Design & Documentation

This document outlines the architecture, knowledge base structure, and scoring algorithm for the AI Lab Assistant.
## 1. Knowledge Base Schema
The knowledge base contains syllabus-grounded documents with keywords, citations, and content. Each document represents an experiment, cation, anion or general concept.
## 2. Query Ranking & Scoring
We use a custom scoring algorithm. It assigns weights to search terms found in the title and keywords, then sums them up to rank the most relevant documents.
