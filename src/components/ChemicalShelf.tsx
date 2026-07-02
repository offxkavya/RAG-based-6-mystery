import React, { useState } from 'react';
import { CHEMICAL_DATABASE } from '../services/chemicalDb';
import { FlaskConical, Beaker, ShieldAlert } from 'lucide-react';

interface ChemicalShelfProps {
  onSelectChemical: (chemId: string) => void;
  selectedChemicalId: string | null;
}

type CategoryType = 'all' | 'cation_salt' | 'anion_salt' | 'acid_base' | 'reagent_indicator' | 'organic';

export const ChemicalShelf: React.FC<ChemicalShelfProps> = ({
  onSelectChemical,
  selectedChemicalId
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');

  const categories: { label: string; value: CategoryType }[] = [
    { label: 'All Chemicals', value: 'all' },
    { label: 'Cations', value: 'cation_salt' },
    { label: 'Anions', value: 'anion_salt' },
    { label: 'Acids & Bases', value: 'acid_base' },
    { label: 'Reagents / Ind.', value: 'reagent_indicator' },
    { label: 'Organic', value: 'organic' }
  ];

  // Filter chemicals
  const filteredChemicals = []; // placeholder Object.values(CHEMICAL_DATABASE).filter(chem => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'cation_salt') return chem.category === 'cation_salt';
    if (activeCategory === 'anion_salt') return chem.category === 'anion_salt';
    if (activeCategory === 'acid_base') return chem.category === 'acid' || chem.category === 'base';
    if (activeCategory === 'reagent_indicator') return chem.category === 'reagent' || chem.category === 'indicator';
    if (activeCategory === 'organic') return chem.category === 'organic';
    return true;
  });

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '16px',
        borderRight: '1px solid var(--glass-border)',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <FlaskConical size={22} className="glow-text-primary" style={{ color: 'var(--primary)' }} />
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.5px' }}>Reagent Shelf</h2>
      </div>

      {/* Category Pills */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap',
          marginBottom: '16px',
          paddingBottom: '8px',
          borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            style={{
              padding: '6px 10px',
              fontSize: '11px',
              borderRadius: '20px',
              background: activeCategory === cat.value ? 'var(--primary)' : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${activeCategory === cat.value ? 'var(--primary)' : 'var(--glass-border)'}`,
              color: activeCategory === cat.value ? 'white' : '#94a3b8',
              transition: 'all 0.2s ease'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Chemicals Grid */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          paddingRight: '4px'
        }}
      >
        {filteredChemicals.map(chem => {
          const isSelected = selectedChemicalId === chem.id;
          return (
            <div
              key={chem.id}
              onClick={() => onSelectChemical(chem.id)}
              style={{
                padding: '10px 12px',
                borderRadius: '12px',
                background: isSelected 
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.05) 100%)' 
                  : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--glass-border)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                position: 'relative',
                boxShadow: isSelected ? '0 0 12px rgba(99,102,241,0.15)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.borderColor = 'var(--glass-border)';
              }}
            >
              {/* Chemical Color Indicator */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: chem.color.includes('rgba') ? chem.color : `${chem.color}22`,
                  border: `2px dashed ${chem.color.includes('rgba') ? 'rgba(255,255,255,0.2)' : chem.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Beaker size={16} style={{ color: chem.color.includes('rgba') ? 'white' : chem.color }} />
              </div>

              {/* Chemical Info */}
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {chem.name}
                  </h4>
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '2px', alignItems: 'center' }}>
                  <code style={{ fontSize: '10px', color: 'var(--secondary)', fontFamily: 'Fira Code' }}>
                    {chem.formula}
                  </code>
                  <span style={{ fontSize: '9px', color: '#64748b', textTransform: 'capitalize' }}>
                    ({chem.state})
                  </span>
                </div>
              </div>

              {/* Hazard Icons */}
              {chem.safetyFlags.length > 0 && (
                <div style={{ display: 'flex', gap: '2px' }}>
                  {chem.safetyFlags.includes('toxic') && (
                    <span title="Toxic Substance"><ShieldAlert size={12} style={{ color: 'var(--danger)' }} /></span>
                  )}
                  {chem.safetyFlags.includes('corrosive') && (
                    <span title="Corrosive Substance"><ShieldAlert size={12} style={{ color: 'var(--warning)' }} /></span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
