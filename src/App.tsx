import React, { useState, useEffect, useRef } from 'react';
import { ChemicalShelf } from './components/ChemicalShelf';
import { VesselRenderer } from './components/VesselRenderer';
import { ApparatusControls } from './components/ApparatusControls';
import { AiAssistant } from './components/AiAssistant';
import { QuizPanel } from './components/QuizPanel';
import { LabReportPanel } from './components/LabReportPanel';
import { SafetyOverlay } from './components/SafetyOverlay';

import { CHEMICAL_DATABASE } from './services/chemicalDb';
import { evaluateReaction } from './services/reactionEngine';
import type { ReactionOutcome } from './services/reactionEngine';
import { evaluateSafety } from './services/safetyClassifier';
import type { SafetyReport } from './services/safetyClassifier';
import { getInitialMastery } from './services/quizService';
import type { StudentMastery } from './services/quizService';

import { FlaskConical, HelpCircle, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  // Vessel State
  const [vesselType, setVesselType] = useState<'test_tube' | 'beaker' | 'burette'>('test_tube');
  const [vesselChemicals, setVesselChemicals] = useState<string[]>([]);
  const [vesselTemperature, setVesselTemperature] = useState<number>(25); // Celsius
  const [actionHistory, setActionHistory] = useState<string[]>([]);
  const [fillLevel, setFillLevel] = useState<number>(0); // 0 to 100

  // Actions Toggle
  const [isHeating, setIsHeating] = useState(false);
  const [isStirring, setIsStirring] = useState(false);
  const [useExcess, setUseExcess] = useState(false);
  
  // Pour animation
  const [isPouring, setIsPouring] = useState(false);
  const [pouringColor, setPouringColor] = useState<string>('');

  // Selected chemical on shelf
  const [selectedChemicalId, setSelectedChemicalId] = useState<string | null>(null);

  // Tab View for Side Drawer
  const [activeTab, setActiveTab] = useState<'chat' | 'quiz' | 'report'>('chat');

  // Logs & Observations
  const [actionLogs, setActionLogs] = useState<string[]>([]);
  const [observedStates, setObservedStates] = useState<ReactionOutcome[]>([]);

  // Safety overlay
  const [safetyReport, setSafetyReport] = useState<SafetyReport>({ isSafe: true, dangerLevel: 'none' });

  // Quiz student mastery (BKT)
  const [mastery, setMastery] = useState<StudentMastery>(() => getInitialMastery());

  // Titration active dripping state
  const [isTitrating, setIsTitrating] = useState(false);
  const [titrationRate, setTitrationRate] = useState(2); // drops per sec
  const [titrateVolume, setTitrateVolume] = useState(0); // ml added from burette
  const titrationIntervalRef = useRef<number | null>(null);

  // Reaction outcome calculation
  const [reactionOutcome, setReactionOutcome] = useState<ReactionOutcome>(() => 
    evaluateReaction([], 25, [])
  );

  // Run reaction engine whenever vessel state changes
  useEffect(() => {
    const outcome = evaluateReaction(vesselChemicals, vesselTemperature, actionHistory);
    setReactionOutcome(outcome);
  }, [vesselChemicals, vesselTemperature, actionHistory]);

  // Slowly heat or cool the vessel
  useEffect(() => {
    let timer: number;
    if (isHeating) {
      timer = window.setInterval(() => {
        setVesselTemperature(prev => Math.min(100, prev + 2.5));
      }, 200);
    } else {
      timer = window.setInterval(() => {
        setVesselTemperature(prev => Math.max(25, prev - 1.0));
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isHeating]);

  // Handle Titration dripping loop
  useEffect(() => {
    if (isTitrating) {
      const intervalMs = 1000 / titrationRate;
      titrationIntervalRef.current = window.setInterval(() => {
        // Drip KMnO4 into beaker containing Fe2+/oxalate
        // Simulating 0.2ml per drop
        setTitrateVolume(prev => {
          const nextVol = Math.min(25, prev + 0.2);
          
          // Add KMnO4 to vessel chemicals if not already in excess
          setVesselChemicals(prevChems => {
            const nextChems = [...prevChems];
            
            // Add KMnO4 drop
            nextChems.push('k_mn_o4_aq');
            
            // Check for safety warning
            const safety = evaluateSafety(nextChems, [...actionHistory, 'add']);
            if (!safety.isSafe) {
              setIsTitrating(false);
              setSafetyReport(safety);
              return prevChems; // cancel addition
            }

            // Fill beaker liquid level slowly
            setFillLevel(f => Math.min(95, f + 0.4));
            return nextChems;
          });

          // Log action occasionally
          if (Math.round(nextVol) % 5 === 0 && Math.round(nextVol) !== Math.round(prev)) {
            logAction(`Titrated: Added ${Math.round(nextVol)}ml of Potassium Permanganate (KMnO4) from burette.`);
          }

          return nextVol;
        });

      }, intervalMs);
    } else {
      if (titrationIntervalRef.current) {
        clearInterval(titrationIntervalRef.current);
      }
    }

    return () => {
      if (titrationIntervalRef.current) {
        clearInterval(titrationIntervalRef.current);
      }
    };
  }, [isTitrating, titrationRate, actionHistory]);

  const logAction = (msg: string) => {
    setActionLogs(prev => [...prev, msg]);
    // Evaluate outcome to log observations
    const currentOutcome = evaluateReaction(vesselChemicals, vesselTemperature, actionHistory);
    setObservedStates(prev => [...prev, currentOutcome]);
  };

  const handleAddChemical = () => {
    if (!selectedChemicalId) return;
    const chem = CHEMICAL_DATABASE[selectedChemicalId];
    if (!chem) return;

    // Safety check first
    const prospectiveChemicals = [...vesselChemicals, selectedChemicalId];
    const prospectiveActions = [...actionHistory, 'add'];
    if (useExcess) prospectiveActions.push('excess_reagent');

    const safety = evaluateSafety(prospectiveChemicals, prospectiveActions);
    if (!safety.isSafe) {
      setSafetyReport(safety);
      return;
    }

    // Set pouring visual details
    setPouringColor(chem.color);
    setIsPouring(true);

    setTimeout(() => {
      setIsPouring(false);
      
      // Update vessel state
      setVesselChemicals(prev => {
        const next = [...prev, selectedChemicalId];
        return next;
      });

      if (useExcess && !actionHistory.includes('excess_reagent')) {
        setActionHistory(prev => [...prev, 'excess_reagent']);
      }

      setFillLevel(prev => Math.min(90, prev + (chem.state === 'solid' ? 5 : 20)));
      
      const excessStr = useExcess ? ' in excess' : '';
      logAction(`Added ${chem.name} [${chem.formula}]${excessStr} to the ${vesselType.replace('_', ' ')}.`);

      // Celebrate positive confirmation with confetti!
      const finalResult = evaluateReaction(prospectiveChemicals, vesselTemperature, prospectiveActions);
      if (finalResult.identifiedIon) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }, 800); // 800ms pouring visual delay
  };

  const handleHeatToggle = () => {
    const nextHeating = !isHeating;
    setIsHeating(nextHeating);
    
    if (nextHeating) {
      setActionHistory(prev => [...prev, 'heat']);
      logAction(`Heated the vessel using Bunsen burner.`);
    } else {
      logAction(`Extinguished Bunsen burner.`);
    }
  };

  const handleStir = () => {
    if (fillLevel === 0) return;
    setIsStirring(true);
    setActionHistory(prev => [...prev, 'stir']);
    logAction(`Stirred the mixture with glass rod.`);

    setTimeout(() => {
      setIsStirring(false);
    }, 3000);
  };

  const handleFilter = () => {
    if (fillLevel === 0) return;
    
    setActionHistory(prev => [...prev, 'filter']);
    
    if (reactionOutcome.precipitate.present) {
      // Remove liquid, keep ppt
      setFillLevel(15); 
      logAction(`Filtered the mixture: Collected the precipitate residue.`);
    } else {
      setFillLevel(0);
      setVesselChemicals([]);
      logAction(`Filtered the mixture: No precipitate retained on filter paper.`);
    }
  };

  const handleReset = () => {
    setVesselChemicals([]);
    setVesselTemperature(25);
    setActionHistory([]);
    setFillLevel(0);
    setIsHeating(false);
    setIsStirring(false);
    setUseExcess(false);
    setIsTitrating(false);
    setTitrateVolume(0);
    setSafetyReport({ isSafe: true, dangerLevel: 'none' });
    logAction(`Cleaned and washed the glassware.`);
  };

  const handlePresetLoad = (presetName: string, chemicals: string[], type: 'test_tube' | 'beaker' | 'burette', fill: number, actions: string[] = []) => {
    handleReset();
    setVesselType(type);
    setVesselChemicals(chemicals);
    setFillLevel(fill);
    setActionHistory(actions);
    logAction(`Loaded Experiment Preset: ${presetName}.`);
  };

  return (
    <div className="app-container">
      {/* 1. LEFT PANEL: Chemical shelf */}
      <ChemicalShelf
        onSelectChemical={setSelectedChemicalId}
        selectedChemicalId={selectedChemicalId}
      />

      {/* 2. CENTER PANEL: Simulation lab bench */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          borderRight: '1px solid var(--glass-border)',
          overflow: 'hidden',
          padding: '20px',
          background: 'rgba(5, 7, 18, 0.2)'
        }}
      >
        {/* Preset Experiments Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Class 12 Syllabus Demo Presets:
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handlePresetLoad('Lead Cation Test', ['pb_no3_2'], 'test_tube', 20)}
              style={{ fontSize: '11px', padding: '6px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: '#cbd5e1' }}
            >
              Pb²⁺ Salt (Lead)
            </button>
            <button
              onClick={() => handlePresetLoad('Copper Cation Test', ['cu_so4'], 'test_tube', 20)}
              style={{ fontSize: '11px', padding: '6px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: '#cbd5e1' }}
            >
              Cu²⁺ Salt (Copper)
            </button>
            <button
              onClick={() => handlePresetLoad('KMnO₄ Titration Set', ['fe_so4_aq', 'dil_h2so4'], 'beaker', 30)}
              style={{ fontSize: '11px', padding: '6px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: '#cbd5e1' }}
            >
              Redox Titration
            </button>
            <button
              onClick={() => handlePresetLoad('Brown Ring Test', ['k_no3', 'fe_so4_aq'], 'test_tube', 40)}
              style={{ fontSize: '11px', padding: '6px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: '#cbd5e1' }}
            >
              Nitrate Brown Ring
            </button>
            <button
              onClick={() => handlePresetLoad('Protein Biuret', ['egg_albumin'], 'test_tube', 20)}
              style={{ fontSize: '11px', padding: '6px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: '#cbd5e1' }}
            >
              Biuret Protein Test
            </button>
          </div>
        </div>

        {/* Vessel Container Selector */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
          {(['test_tube', 'beaker', 'burette'] as const).map(vt => (
            <button
              key={vt}
              onClick={() => setVesselType(vt)}
              style={{
                fontSize: '12px',
                padding: '6px 14px',
                background: vesselType === vt ? 'rgba(99,102,241,0.15)' : 'transparent',
                borderColor: vesselType === vt ? 'var(--primary)' : 'var(--glass-border)',
                borderWidth: '1px',
                color: vesselType === vt ? 'var(--primary)' : '#94a3b8',
                textTransform: 'capitalize'
              }}
            >
              {vt.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Active Simulation Display */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.4) 0%, rgba(5, 7, 18, 0.7) 100%)',
            border: '1px solid var(--glass-border)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)',
            marginBottom: '20px'
          }}
        >
          {/* Glassware slots */}
          <div style={{ width: '160px', height: '340px', position: 'relative' }}>
            <VesselRenderer
              type={vesselType}
              outcome={reactionOutcome}
              temperature={vesselTemperature}
              isHeating={isHeating}
              isStirring={isStirring}
              fillLevel={fillLevel}
              isPouring={isPouring}
              pouringColor={pouringColor}
            />
          </div>
        </div>

        {/* Reaction Inference Card */}
        {fillLevel > 0 && (
          <div
            className="glass-panel"
            style={{
              padding: '14px',
              borderLeft: `4px solid ${reactionOutcome.identifiedIon ? 'var(--safe)' : 'var(--primary)'}`,
              marginBottom: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Observation & Inference
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {titrateVolume > 0 && (
                  <span style={{ fontSize: '10px', background: 'rgba(6,182,212,0.15)', color: 'var(--secondary)', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>
                    Dripped: {titrateVolume.toFixed(1)} ml
                  </span>
                )}
                {reactionOutcome.identifiedIon && (
                  <span style={{ fontSize: '10px', background: 'rgba(16,185,129,0.15)', color: 'var(--safe)', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>
                    Ion Identified: {reactionOutcome.identifiedIon}
                  </span>
                )}
              </div>
            </div>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#f1f5f9' }}>
              {reactionOutcome.inference}
            </p>
            <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.4' }}>
              {reactionOutcome.explanation}
            </p>
            {reactionOutcome.balancedEquation && (
              <code style={{ fontSize: '10.5px', color: 'var(--secondary)', fontFamily: 'Fira Code', marginTop: '4px', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.03)' }}>
                {reactionOutcome.balancedEquation}
              </code>
            )}
          </div>
        )}

        {/* Apparatus controls */}
        <ApparatusControls
          onAdd={handleAddChemical}
          onHeat={handleHeatToggle}
          onStir={handleStir}
          onFilter={handleFilter}
          onReset={handleReset}
          isHeating={isHeating}
          isStirring={isStirring}
          hasChemicalSelected={selectedChemicalId !== null}
          useExcess={useExcess}
          onToggleExcess={() => setUseExcess(!useExcess)}
          isTitrating={isTitrating}
          onToggleTitration={() => setIsTitrating(!isTitrating)}
          titrationRate={titrationRate}
          onRateChange={setTitrationRate}
        />
      </div>

      {/* 3. RIGHT PANEL: Navigation Tabs / AI assistant / Quiz / Report */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Navigation tabs */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(15, 23, 42, 0.45)',
            borderBottom: '1px solid var(--glass-border)',
            padding: '10px 16px 0',
            gap: '8px'
          }}
        >
          {([
            { id: 'chat', label: 'AI Assistant' },
            { id: 'quiz', label: 'Viva Quiz' },
            { id: 'report', label: 'Lab Report' }
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                fontSize: '13px',
                padding: '10px 14px',
                border: 'none',
                background: 'transparent',
                borderBottom: `3px solid ${activeTab === tab.id ? 'var(--primary)' : 'transparent'}`,
                color: activeTab === tab.id ? 'white' : '#94a3b8',
                borderRadius: '8px 8px 0 0',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {tab.id === 'chat' && <FlaskConical size={14} />}
              {tab.id === 'quiz' && <HelpCircle size={14} />}
              {tab.id === 'report' && <FileText size={14} />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content wrapper */}
        <div style={{ flex: 1, overflow: 'hidden', padding: '16px' }}>
          {activeTab === 'chat' && <AiAssistant />}
          {activeTab === 'quiz' && (
            <QuizPanel mastery={mastery} onUpdateMastery={setMastery} />
          )}
          {activeTab === 'report' && (
            <LabReportPanel
              actionLogs={actionLogs}
              observedStates={observedStates}
              finalOutcome={reactionOutcome}
              onClearLogs={() => {
                setActionLogs([]);
                setObservedStates([]);
              }}
            />
          )}
        </div>
      </div>

      {/* Safety Overlay Dialog */}
      <SafetyOverlay
        report={safetyReport}
        onDismiss={() => setSafetyReport({ isSafe: true, dangerLevel: 'none' })}
        onReset={handleReset}
      />
    </div>
  );
};
export default App;
