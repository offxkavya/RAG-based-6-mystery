import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, BookOpen, Key, AlertCircle } from 'lucide-react';
import { searchKnowledgeBase, getLiveAiResponse } from '../services/ragService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
  suggestions?: string[];
}

/**
 * AiAssistant chat interface container
 */
export const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I am your AI Chemistry Lab Assistant. Ask me anything about Class 12 chemistry practicals (e.g., salt analysis tests, redox titrations, kinetics clock reactions, organic group tests).',
      suggestions: [
        'How do I test for Lead (Pb2+) ions?',
        'Why do we heat oxalic acid in KMnO4 titration?',
        'What is the brown ring test for Nitrates?',
        'Explain the cherry-red nickel complex.'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // API Key Settings
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('chem_assistant_api_key') || '');
  const [apiProvider, setApiProvider] = useState<'openai' | 'gemini'>(() => 
    (localStorage.getItem('chem_assistant_api_provider') as 'openai' | 'gemini') || 'openai'
  );
  const [showConfig, setShowConfig] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Smooth scroll down to newest message
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveApiKey = (key: string, provider: 'openai' | 'gemini') => {
    // Save keys locally for session persistence
    localStorage.setItem('chem_assistant_api_key', key);
    localStorage.setItem('chem_assistant_api_provider', provider);
    setApiKey(key);
    setApiProvider(provider);
    setShowConfig(false);
  };

  const handleSend = async (textToSend: string) => {
    // Do not process empty inputs
    if (!textToSend.trim()) return;

    const userMessage: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      let responseContent = '';
      let citations: string[] = [];
      let suggestions: string[] = [];

      if (apiKey) {
        // Call live LLM (grounded in context inside the service)
        responseContent = await getLiveAiResponse(
          textToSend,
          messages.map(m => ({ role: m.role, content: m.content })),
          apiKey,
          apiProvider
        );
        // Extract local matching doc for basic suggestions/citations
        const localDoc = searchKnowledgeBase(textToSend);
        citations = localDoc.citations;
        suggestions = localDoc.suggestedQuestions;
      } else {
        // Fallback to local RAG
        const localResult = searchKnowledgeBase(textToSend);
        responseContent = localResult.answer;
        citations = localResult.citations;
        suggestions = localResult.suggestedQuestions;
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: responseContent,
        citations,
        suggestions
      }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I encountered an error processing your query. Please check your internet connection or API settings.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '16px',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={20} className="glow-text-secondary" style={{ color: 'var(--secondary)' }} />
          <h2 style={{ fontSize: '16px', fontWeight: 'bold' }}>AI Lab Assistant</h2>
        </div>
        <button
          onClick={() => setShowConfig(!showConfig)}
          style={{
            padding: '6px',
            borderRadius: '6px',
            background: showConfig ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.02)',
            border: '1px solid var(--glass-border)',
            color: showConfig ? 'var(--primary)' : '#94a3b8'
          }}
          title="Configure API Keys"
        >
          <Key size={14} />
        </button>
      </div>

      {/* API Key Drawer */}
      {showConfig && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid var(--primary)',
            borderRadius: '12px',
            padding: '12px',
            marginBottom: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--primary)' }}>
            OPTIONAL: CONNECT GENERATIVE LLM
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <label style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="provider"
                checked={apiProvider === 'openai'}
                onChange={() => setApiProvider('openai')}
              />
              OpenAI (GPT-4o)
            </label>
            <label style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="provider"
                checked={apiProvider === 'gemini'}
                onChange={() => setApiProvider('gemini')}
              />
              Gemini Flash
            </label>
          </div>
          <input
            type="password"
            placeholder={apiProvider === 'openai' ? 'sk-...' : 'AIzaSy...'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            style={{ fontSize: '12px', padding: '6px 10px' }}
          />
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowConfig(false)}
              style={{ fontSize: '11px', padding: '4px 8px', background: 'transparent', color: '#94a3b8' }}
            >
              Cancel
            </button>
            <button
              onClick={() => saveApiKey(apiKey, apiProvider)}
              style={{ fontSize: '11px', padding: '4px 10px', background: 'var(--primary)', color: 'white', borderRadius: '6px' }}
            >
              Save Key
            </button>
          </div>
          <span style={{ fontSize: '9px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertCircle size={10} /> Saved in local storage. Leave empty to use local vector knowledge base.
          </span>
        </div>
      )}

      {/* Chat Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          paddingRight: '4px',
          marginBottom: '12px'
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div
              style={{
                padding: '10px 14px',
                borderRadius: msg.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                background: msg.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${msg.role === 'user' ? 'transparent' : 'var(--glass-border)'}`,
                fontSize: '13px',
                lineHeight: '1.45',
                color: msg.role === 'user' ? 'white' : '#cbd5e1',
                whiteSpace: 'pre-wrap'
              }}
            >
              {msg.content}
            </div>

            {/* Citations */}
            {msg.citations && msg.citations.length > 0 && (
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '2px' }}>
                {msg.citations.map((cite, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '9px',
                      color: 'var(--secondary)',
                      background: 'rgba(6, 182, 212, 0.08)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <BookOpen size={10} /> {cite}
                  </span>
                ))}
              </div>
            )}

            {/* Suggestions */}
            {msg.suggestions && msg.suggestions.length > 0 && (
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                {msg.suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(sug)}
                    style={{
                      fontSize: '11px',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--glass-border)',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--secondary)';
                      e.currentTarget.style.color = 'var(--secondary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--glass-border)';
                      e.currentTarget.style.color = '#94a3b8';
                    }}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '4px', padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Assistant is reading manuals...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        style={{
          display: 'flex',
          gap: '8px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: '10px'
        }}
      >
        <input
          type="text"
          placeholder="Ask a question or type reaction..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, fontSize: '13px' }}
        />
        <button
          type="submit"
          className="btn-primary"
          style={{ padding: '10px 12px', flexShrink: 0 }}
          disabled={loading}
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};
