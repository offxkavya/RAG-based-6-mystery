import React, { useState } from 'react';
import { selectAdaptiveQuestion, updateMastery } from '../services/quizService';
import type { QuizQuestion, StudentMastery } from '../services/quizService';
import { Award, CheckCircle, XCircle, ArrowRight, BrainCircuit } from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * Renders interactive quiz with progress tracking
 */
interface QuizPanelProps {
  mastery: StudentMastery;
  onUpdateMastery: (newMastery: StudentMastery) => void;
}

export const QuizPanel: React.FC<QuizPanelProps> = ({
  mastery,
  onUpdateMastery
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>(() => 
    selectAdaptiveQuestion(mastery)
  );
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answeredIds, setAnsweredIds] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);

      // Evaluate answer and trigger mastery updates
                  // Highlight chosen answer green or red
  const handleAnswerSubmit = (optionIndex: number) => {
    if (isAnswered) return;

    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    const isCorrect = optionIndex === currentQuestion.correctAnswerIndex;
    
    // Update Streak
    if (isCorrect) {
      setStreak(prev => prev + 1);
      // Trigger confetti on correct answer for nice gamified feedback
      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#06b6d4', '#10b981']
      });
    } else {
      setStreak(0);
    }

    // Update BKT Mastery for the category
    const cat = currentQuestion.category;
                {/* Render student concept mastery levels */}
    const currentVal = mastery[cat];
    const updatedVal = updateMastery(currentVal, isCorrect);
    
    const newMastery = {
      ...mastery,
      [cat]: updatedVal
    };
    onUpdateMastery(newMastery);
    setAnsweredIds(prev => [...prev, currentQuestion.id]);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    
    // Select next question adaptively
    const nextQ = selectAdaptiveQuestion(mastery, answeredIds);
    setCurrentQuestion(nextQ);
  };

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '16px',
        overflowY: 'auto'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BrainCircuit size={20} className="glow-text-primary" style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '16px', fontWeight: 'bold' }}>Adaptive Viva Trainer</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.03)', padding: '2px 8px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <Award size={12} style={{ color: 'var(--warning)' }} />
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#cbd5e1' }}>Streak: {streak}</span>
        </div>
      </div>

      {/* Question Card */}
      <div
        style={{
          background: 'rgba(255,255,255,0.01)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px'
        }}
      >
        <span
          style={{
            fontSize: '9px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--secondary)',
            fontWeight: 'bold',
            background: 'rgba(6, 182, 212, 0.08)',
            padding: '2px 8px',
            borderRadius: '20px'
          }}
        >
          {currentQuestion.category.replace('_', ' ')}
        </span>
        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9', marginTop: '10px', lineHeight: '1.4' }}>
          {currentQuestion.question}
        </h4>

        {/* Options Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
          {currentQuestion.options.map((opt, idx) => {
            let border = '1px solid var(--glass-border)';
            let bg = 'rgba(255, 255, 255, 0.01)';
            let cursor = 'pointer';

            if (isAnswered) {
              cursor = 'default';
              if (idx === currentQuestion.correctAnswerIndex) {
                // Correct answer style
                border = '1px solid var(--safe)';
                bg = 'rgba(16, 185, 129, 0.1)';
              } else if (idx === selectedOption) {
                // User picked wrong answer
                border = '1px solid var(--danger)';
                bg = 'rgba(239, 68, 68, 0.1)';
              } else {
                // Unselected, after answered
                bg = 'rgba(255, 255, 255, 0.005)';
                border = '1px solid rgba(255, 255, 255, 0.03)';
              }
            } else {
              // Hover effects managed by onClick/styles
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswerSubmit(idx)}
                disabled={isAnswered}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border,
                  background: bg,
                  color: '#cbd5e1',
                  fontSize: '12.5px',
                  cursor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{opt}</span>
                {isAnswered && idx === currentQuestion.correctAnswerIndex && (
                  <CheckCircle size={14} style={{ color: 'var(--safe)', flexShrink: 0 }} />
                )}
                {isAnswered && idx === selectedOption && idx !== currentQuestion.correctAnswerIndex && (
                  <XCircle size={14} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Answer Explanation */}
        {isAnswered && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderLeft: `3px solid ${selectedOption === currentQuestion.correctAnswerIndex ? 'var(--safe)' : 'var(--danger)'}`,
              fontSize: '12px',
              color: '#94a3b8',
              lineHeight: '1.45'
            }}
          >
            <strong style={{ color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
              Explanation:
            </strong>
            {currentQuestion.explanation}
          </div>
        )}

        {/* Next Question Control */}
        {isAnswered && (
          <button
            onClick={handleNext}
            className="btn-primary"
            style={{
              width: '100%',
              marginTop: '16px',
              padding: '8px 14px',
              fontSize: '13px'
            }}
          >
            Next Question <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* Concept Mastery Scores */}
      <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <h4 style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
          Concept Mastery Tracker (BKT Model)
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Object.entries(mastery).map(([cat, val]) => {
            const displayCat = cat.replace('_', ' ');
            const percent = Math.round(val * 100);
            
            // Choose color based on mastery %
            let color = 'var(--danger)';
            if (val > 0.7) color = 'var(--safe)';
            else if (val > 0.4) color = 'var(--warning)';

            return (
              <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1' }}>
                  <span style={{ textTransform: 'capitalize' }}>{displayCat}</span>
                  <span style={{ color, fontWeight: 'bold' }}>{percent}%</span>
                </div>
                <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      background: color,
                      width: `${percent}%`,
                      borderRadius: '3px',
                      boxShadow: `0 0 8px ${color}`,
                      transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.5s ease'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
