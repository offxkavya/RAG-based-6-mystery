import React from 'react';
import { Flame, Wind, Filter, Trash2, Plus, Sparkles, Sliders } from 'lucide-react';

interface ApparatusControlsProps {
  onAdd: () => void;
  onHeat: () => void;
  onStir: () => void;
  onFilter: () => void;
  onReset: () => void;
  isHeating: boolean;
  isStirring: boolean;
  hasChemicalSelected: boolean;
  useExcess: boolean;
  onToggleExcess: () => void;
  // Titration parameters
  isTitrating: boolean;
  onToggleTitration: () => void;
  titrationRate: number;
  onRateChange: (rate: number) => void;
}

export const ApparatusControls: React.FC<ApparatusControlsProps> = ({
  onAdd,
  onHeat,
  onStir,
  onFilter,
  onReset,
  isHeating,
  isStirring,
  hasChemicalSelected,
  useExcess,
  onToggleExcess,
  isTitrating,
  onToggleTitration,
  titrationRate,
  onRateChange
}) => {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Lab Bench Apparatus
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {/* Pour Button */}
        <button
          onClick={onAdd}
          disabled={!hasChemicalSelected}
          className="btn-primary"
          style={{
            opacity: hasChemicalSelected ? 1 : 0.5,
            cursor: hasChemicalSelected ? 'pointer' : 'not-allowed',
            padding: '12px'
          }}
        >
          <Plus size={16} /> Add Reagent
        </button>

        {/* Stir Button */}
        <button
          onClick={onStir}
          className="btn-secondary"
          style={{
            background: isStirring ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.03)',
            borderColor: isStirring ? 'var(--secondary)' : 'var(--glass-border)',
            color: isStirring ? 'var(--secondary)' : '#f8fafc',
            padding: '12px'
          }}
        >
          <Wind size={16} /> Stir
        </button>

        {/* Heat Button */}
        <button
          onClick={onHeat}
          className="btn-secondary"
          style={{
            background: isHeating ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.03)',
            borderColor: isHeating ? 'var(--danger)' : 'var(--glass-border)',
            color: isHeating ? 'var(--danger)' : '#f8fafc',
            padding: '12px'
          }}
        >
          <Flame size={16} /> {isHeating ? 'Extinguish' : 'Heat Vessel'}
        </button>

        {/* Filter Button */}
        <button
          onClick={onFilter}
          className="btn-secondary"
          style={{ padding: '12px' }}
        >
          <Filter size={16} /> Filter Ppt
        </button>
      </div>

      {/* Excess Toggle & Titration Slider */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginTop: '6px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        {/* Excess reagent switch */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '13px',
            color: '#cbd5e1',
            cursor: 'pointer'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} style={{ color: 'var(--accent)' }} /> Add in Excess
          </span>
          <input
            type="checkbox"
            checked={useExcess}
            onChange={onToggleExcess}
            style={{
              width: '32px',
              height: '16px',
              appearance: 'none',
              background: useExcess ? 'var(--primary)' : '#475569',
              borderRadius: '10px',
              position: 'relative',
              cursor: 'pointer',
              outline: 'none',
              transition: 'background 0.2s ease'
            }}
            ref={(input) => {
              if (input) {
                // Style pseudo elements using script if required, or simple slider styling
                input.style.setProperty('--checked', useExcess ? '1' : '0');
              }
            }}
          />
        </label>

        {/* Titration Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sliders size={14} style={{ color: 'var(--secondary)' }} /> Titration Valve
            </span>
            <button
              onClick={onToggleTitration}
              style={{
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '12px',
                background: isTitrating ? 'var(--danger)' : 'rgba(16, 185, 129, 0.15)',
                borderColor: isTitrating ? 'var(--danger)' : 'var(--safe)',
                borderWidth: '1px',
                color: isTitrating ? 'white' : 'var(--safe)',
                cursor: 'pointer'
              }}
            >
              {isTitrating ? 'Close Stopcock' : 'Open Stopcock'}
            </button>
          </div>
          
          {isTitrating && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
                <span>Drip Speed</span>
                <span>{titrationRate} drops/sec</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={titrationRate}
                onChange={(e) => onRateChange(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  cursor: 'pointer',
                  accentColor: 'var(--secondary)'
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Clean Beaker Button */}
      <button
        onClick={onReset}
        className="btn-secondary"
        style={{
          width: '100%',
          marginTop: '6px',
          borderColor: 'rgba(239, 68, 68, 0.2)',
          color: '#f87171',
          background: 'rgba(239, 68, 68, 0.03)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.03)'}
      >
        <Trash2 size={16} /> Clean Active Vessel
      </button>
    </div>
  );
};
