import React from 'react';
import { AlertOctagon, ShieldAlert, RotateCcw, Play } from 'lucide-react';
import type { SafetyReport } from '../services/safetyClassifier';

interface SafetyOverlayProps {
  report: SafetyReport;
  onDismiss: () => void;
  onReset: () => void;
}

export const SafetyOverlay: React.FC<SafetyOverlayProps> = ({
  report,
  onDismiss,
  onReset
}) => {
  if (report.dangerLevel === 'none') return null;

  const isHighDanger = report.dangerLevel === 'high';
  const color = isHighDanger ? 'var(--danger)' : 'var(--warning)';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(5, 7, 18, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        className="glass-panel"
        style={{
          maxWidth: '550px',
          width: '100%',
          border: `2px solid ${color}`,
          boxShadow: `0 0 30px ${color}33`,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          animation: 'shake 0.5s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              background: `${color}15`,
              borderRadius: '50%',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isHighDanger ? (
              <AlertOctagon size={32} style={{ color }} />
            ) : (
              <ShieldAlert size={32} style={{ color }} />
            )}
          </div>
          <div>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color
              }}
            >
              {report.dangerLevel} Hazard Warning
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#f1f5f9', marginTop: '2px' }}>
              {report.hazardTitle || 'Dangerous Chemical Combination'}
            </h3>
          </div>
        </div>

        <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5', margin: '4px 0' }}>
          {report.explanation}
        </p>

        {report.precautions && report.precautions.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Real-World Safety Protocols:
            </span>
            <ul style={{ paddingLeft: '18px', fontSize: '12px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
              {report.precautions.map((prec, i) => (
                <li key={i}>{prec}</li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '8px', width: '100%' }}>
          {/* Option 1: Revert/Reset - SAFE */}
          <button
            onClick={onReset}
            className="btn-primary"
            style={{
              flex: 1,
              background: 'rgba(16, 185, 129, 0.15)',
              borderColor: 'var(--safe)',
              borderWidth: '1px',
              color: 'var(--safe)',
              boxShadow: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.25)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)'}
          >
            <RotateCcw size={16} /> Revert Action (Safe)
          </button>

          {/* Option 2: Proceed - DANGER (Simulation only) */}
          <button
            onClick={onDismiss}
            className="btn-secondary"
            style={{
              flex: 1,
              borderColor: 'rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              background: 'rgba(239, 68, 68, 0.05)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'}
          >
            <Play size={16} /> Force Simulation (Danger)
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
};
