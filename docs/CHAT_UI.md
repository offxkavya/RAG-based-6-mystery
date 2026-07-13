# AI Assistant Chat Component

This document details the frontend implementation and message handling for the AI Lab Assistant.
## Message interface
Messages contain a role ('user' | 'assistant'), text content, optional citations and suggested questions.
## Layout Design
The AI Assistant panel is a modern glassmorphic chat container that includes a header, optional API configuration settings, a messages feed, and input footer.
## API Key Configurations
Allows optional connection to generative models (OpenAI or Gemini Flash) using keys stored locally in the browser's localStorage.
## Local Storage Keys
- 'chem_assistant_api_key': API token
- 'chem_assistant_api_provider': Selected model provider
## Style System
User message bubbles are styled using primary brand colors, while assistant responses use dark glass backgrounds with subtle borders.
## Loading Indicators
A small status bubble displays 'Assistant is reading manuals...' while the network call is resolving or local RAG is fetching.
## Citations UI
Citations are shown underneath the response bubble as pill buttons with BookOpen icons to improve credibility.
## Error Recovery
Exceptions in network calls or API responses fallback to printing a friendly error message suggesting the user check key configuration.
