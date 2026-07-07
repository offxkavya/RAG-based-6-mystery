import React, { useState, useEffect } from 'react';
import { FileText, Download, Edit3, Check, RefreshCw } from 'lucide-react';
import { generateReportStructure, exportReportToPdf } from '../services/reportGenerator';
import type { LabReportData } from '../services/reportGenerator';
import type { ReactionOutcome } from '../services/reactionEngine';

interface LabReportPanelProps {
  actionLogs: string[];
  observedStates: ReactionOutcome[];
  finalOutcome?: ReactionOutcome;
  onClearLogs: () => void;
}

export const LabReportPanel: React.FC<LabReportPanelProps> = ({
  actionLogs,
  observedStates,
  finalOutcome,
  onClearLogs
}) => {
  const [report, setReport] = useState<LabReportData>(() => 
    generateReportStructure(actionLogs, observedStates, finalOutcome)
  );
  
  const [editMode, setEditMode] = useState<boolean>(false);

  // Re-generate report structure whenever actionLogs or outcomes change
  useEffect(() => {
    setReport(generateReportStructure(actionLogs, observedStates, finalOutcome));
  }, [actionLogs, observedStates, finalOutcome]);

  const handleDownload = () => {
    exportReportToPdf(report, 'class_12_chemistry_vlab_report.pdf');
  };

  const handleFieldChange = (field: keyof LabReportData, value: string | string[]) => {
    setReport(prev => ({
      ...prev,
      [field]: value
    }));
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
          <FileText size={20} className="glow-text-primary" style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '16px', fontWeight: 'bold' }}>Lab Report Drawer</h2>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setEditMode(!editMode)}
            style={{
              padding: '6px 10px',
              fontSize: '11px',
              borderRadius: '8px',
              background: editMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${editMode ? 'var(--safe)' : 'var(--glass-border)'}`,
              color: editMode ? 'var(--safe)' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {editMode ? <Check size={12} /> : <Edit3 size={12} />}
            {editMode ? 'Done Editing' : 'Edit Report'}
          </button>
          <button
            onClick={onClearLogs}
            style={{
              padding: '6px 10px',
              fontSize: '11px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <RefreshCw size={12} /> Reset Log
          </button>
        </div>
      </div>

      {actionLogs.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#64748b', textAlign: 'center', padding: '20px' }}>
          <FileText size={48} style={{ opacity: 0.3 }} />
          <span style={{ fontSize: '13px' }}>Your experiment steps and observations will be recorded here automatically.</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
          {/* Aim Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--primary)', letterSpacing: '0.5px' }}>
              AIM OF EXPERIMENT
            </span>
            {editMode ? (
              <textarea
                value={report.aim}
                onChange={(e) => handleFieldChange('aim', e.target.value)}
                style={{ fontSize: '12px', width: '100%', minHeight: '60px' }}
              />
            ) : (
              <p style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.4' }}>{report.aim}</p>
            )}
          </div>

          {/* Materials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--primary)', letterSpacing: '0.5px' }}>
              APPARATUS & REAGENTS
            </span>
            <ul style={{ paddingLeft: '18px', fontSize: '12.5px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {report.materials.map((mat, i) => (
                <li key={i}>{mat}</li>
              ))}
            </ul>
          </div>

          {/* Theory */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--primary)', letterSpacing: '0.5px' }}>
              CHEMICAL THEORY
            </span>
            {editMode ? (
              <textarea
                value={report.theory}
                onChange={(e) => handleFieldChange('theory', e.target.value)}
                style={{ fontSize: '12px', width: '100%', minHeight: '100px' }}
              />
            ) : (
              <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.45', textAlign: 'justify' }}>
                {report.theory}
              </p>
            )}
          </div>

          {/* Observations table preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--primary)', letterSpacing: '0.5px' }}>
              OBSERVATION REGISTER
            </span>
            <div style={{ overflowX: 'auto', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', color: '#cbd5e1' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)' }}>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Step / Action</th>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Observation</th>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Inference</th>
                  </tr>
                </thead>
                <tbody>
                  {report.observations.map((obs, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '8px', verticalAlign: 'top', color: '#94a3b8' }}>{obs.step}</td>
                      <td style={{ padding: '8px', verticalAlign: 'top' }}>{obs.observation}</td>
                      <td style={{ padding: '8px', verticalAlign: 'top', color: 'var(--secondary)' }}>{obs.inference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chemical equations */}
          {report.equations.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--primary)', letterSpacing: '0.5px' }}>
                CHEMICAL EQUATIONS
              </span>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                {report.equations.map((eq, i) => (
                  <code key={i} style={{ display: 'block', fontSize: '11px', color: 'var(--secondary)', fontFamily: 'Fira Code', margin: '4px 0' }}>
                    {eq}
                  </code>
                ))}
              </div>
            </div>
          )}

          {/* Result */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--primary)', letterSpacing: '0.5px' }}>
              RESULT & CONCLUSION
            </span>
            {editMode ? (
              <textarea
                value={report.result}
                onChange={(e) => handleFieldChange('result', e.target.value)}
                style={{ fontSize: '12px', width: '100%', minHeight: '60px' }}
              />
            ) : (
              <p style={{ fontSize: '12.5px', color: '#cbd5e1', fontWeight: '500', lineHeight: '1.4' }}>{report.result}</p>
            )}
          </div>

          {/* Precautions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--primary)', letterSpacing: '0.5px' }}>
              SAFETY PRECAUTIONS
            </span>
            <ul style={{ paddingLeft: '18px', fontSize: '12px', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {report.precautions.map((prec, i) => (
                <li key={i}>{prec}</li>
              ))}
            </ul>
          </div>

          {/* Export PDF Button */}
          <button
            onClick={handleDownload}
            className="btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '13px', display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '10px' }}
          >
            <Download size={16} /> Export Syllabus Lab Report (PDF)
          </button>
        </div>
      )}
    </div>
  );
};
