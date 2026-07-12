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
