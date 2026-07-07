import { jsPDF } from 'jspdf';
import { CHEMICAL_DATABASE } from './chemicalDb';

export interface LabReportData {
  aim: string;
  materials: string[];
  theory: string;
  procedure: string[];
  observations: { step: string; observation: string; inference: string }[];
  equations: string[];
  result: string;
  precautions: string[];
}

export function generateReportStructure(
  actionLogs: string[],
  observedStates: any[],
  finalOutcome?: any
): LabReportData {
  const data: LabReportData = {
    aim: 'To perform systematic qualitative/quantitative analysis on the given chemical system.',
    materials: ['Test Tubes', 'Beakers', 'Test tube holder', 'Bunsen burner', 'Stirring rod', 'Distilled water'],
    theory: 'Qualitative analysis involves identifying the constituent ions or functional groups present in a substance. In redox titrations, the concentration of an unknown reducing agent is determined by reacting it with a standard solution of an oxidizing agent (like KMnO4) in acidic medium, using the self-indicating properties of permanganate ions.',
    procedure: [],
    observations: [],
    equations: [],
    result: 'The analysis was successfully conducted.',
    precautions: [
      'Handle all acids and bases with extreme caution.',
      'Use test tube holders while heating substances.',
      'Do not inhale evolved gases directly.'
    ]
  };

  // Build procedure from action logs
  actionLogs.forEach((log, index) => {
    data.procedure.push(`${index + 1}. ${log}`);
  });

  // Extract chemicals mentioned in logs
  const chemicalsAdded: string[] = [];
  actionLogs.forEach(log => {
    for (const [id, chem] of Object.entries(CHEMICAL_DATABASE)) {
      if (log.toLowerCase().includes(chem.name.toLowerCase()) || log.toLowerCase().includes(chem.formula.toLowerCase())) {
        chemicalsAdded.push(id);
      }
    }
  });
  const uniqueChems = Array.from(new Set(chemicalsAdded));
  
  // Add chemicals to materials
  uniqueChems.forEach(cid => {
    const chem = CHEMICAL_DATABASE[cid];
    if (chem && !data.materials.includes(chem.name)) {
      data.materials.push(`${chem.name} [${chem.formula}]`);
    }
  });

  // Build observations table
  observedStates.forEach((state, index) => {
    if (state.inference && state.inference !== 'No reaction observed.') {
      data.observations.push({
        step: actionLogs[index] || `Step ${index + 1}`,
        observation: state.precipitate.present 
          ? `Formed a ${state.precipitate.color} ${state.precipitate.type} precipitate. ${state.gas.present ? `Evolved ${state.gas.name} gas.` : ''}`
          : state.gas.present
            ? `Evolved ${state.gas.name} gas (color: ${state.gas.color || 'colorless'}, smell: ${state.gas.smell}).`
            : `Solution turned ${state.color.includes('rgba') ? 'clear' : 'colored'}.`,
        inference: state.inference
      });

      if (state.balancedEquation && !data.equations.includes(state.balancedEquation)) {
        data.equations.push(state.balancedEquation);
      }
    }
  });

  // Tailor based on final outcomes
  if (finalOutcome) {
    if (finalOutcome.identifiedIon) {
      const ionId = finalOutcome.identifiedIon;
      data.aim = `Qualitative Analysis: To identify the presence of Cation/Anion in the given inorganic sample.`;
      data.result = `The given inorganic sample contains Cation/Anion: ${ionId}.`;
      data.theory = `Qualitative analysis relies on precipitation, gas evolution, or color-changing complexes. A group reagent is added systematically to isolate specific ions based on their solubility products (Ksp).`;
    }
    
    if (finalOutcome.balancedEquation.includes('KMnO4')) {
      data.aim = `Redox Titration: Volumetric analysis of Potassium Permanganate (KMnO4) against Mohr's Salt / Oxalic Acid.`;
      data.result = `The redox titration was successfully completed. The endpoint was observed at the permanent appearance of a pale pink color.`;
      data.theory = `Potassium permanganate acts as a strong oxidizing agent in the presence of dilute sulfuric acid. In this acidic medium, KMnO4 (purple) is reduced to MnSO4 (colorless). The endpoint is identified without external indicators since the first excess drop of KMnO4 turns the solution permanent pale pink.`;
      data.precautions.push('Never use hydrochloric acid or nitric acid to acidify KMnO4, as they interfere with the titration.');
      data.precautions.push('If using oxalic acid, ensure the solution temperature is maintained around 60°C during the titration.');
    }
  }

  return data;
}

export function exportReportToPdf(report: LabReportData, filename = 'chemistry_lab_report.pdf') {
  const doc = new jsPDF();
  
  // Set fonts and styles
  doc.setFont('Helvetica', 'normal');
  
  // Header banner
  doc.setFillColor(30, 41, 59); // Indigo/Slate
  doc.rect(0, 0, 210, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('CLASS XII VIRTUAL CHEMISTRY LAB', 15, 20);
  doc.setFontSize(10);
  doc.text('Automated Laboratory Record Sheet (CBSE/ISC Syllabus)', 15, 28);
  
  // Document Body
  doc.setTextColor(30, 41, 59);
  let y = 45;

  // 1. AIM
  doc.setFontSize(12);
  doc.setFont('Helvetica', 'bold');
  doc.text('AIM:', 15, y);
  y += 6;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(11);
  const splitAim = doc.splitTextToSize(report.aim, 180);
  doc.text(splitAim, 15, y);
  y += splitAim.length * 6 + 4;

  // 2. MATERIALS REQUIRED
  doc.setFontSize(12);
  doc.setFont('Helvetica', 'bold');
  doc.text('MATERIALS & REAGENTS REQUIRED:', 15, y);
  y += 6;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(11);
  const materialsText = report.materials.join(', ');
  const splitMaterials = doc.splitTextToSize(materialsText, 180);
  doc.text(splitMaterials, 15, y);
  y += splitMaterials.length * 6 + 4;

  // 3. THEORY
  doc.setFontSize(12);
  doc.setFont('Helvetica', 'bold');
  doc.text('CHEMICAL THEORY:', 15, y);
  y += 6;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10.5);
  const splitTheory = doc.splitTextToSize(report.theory, 180);
  doc.text(splitTheory, 15, y);
  y += splitTheory.length * 5.5 + 4;

  // 4. PROCEDURE
  doc.setFontSize(12);
  doc.setFont('Helvetica', 'bold');
  doc.text('PROCEDURE PERFORMED:', 15, y);
  y += 6;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10.5);
  report.procedure.forEach(step => {
    const splitStep = doc.splitTextToSize(step, 180);
    doc.text(splitStep, 15, y);
    y += splitStep.length * 5.5;
  });
  y += 4;

  // Check page overflow
  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  // 5. OBSERVATIONS
  doc.setFontSize(12);
  doc.setFont('Helvetica', 'bold');
  doc.text('OBSERVATIONS TABLE:', 15, y);
  y += 6;
  
  // Table headers
  doc.setFontSize(10);
  doc.setFillColor(226, 232, 240);
  doc.rect(15, y, 180, 8, 'F');
  doc.text('Experiment / Step', 17, y + 5.5);
  doc.text('Observation', 75, y + 5.5);
  doc.text('Inference', 140, y + 5.5);
  y += 8;

  doc.setFont('Helvetica', 'normal');
  report.observations.forEach(obs => {
    // Check page overflow inside loops
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    const stepText = doc.splitTextToSize(obs.step, 55);
    const obsText = doc.splitTextToSize(obs.observation, 60);
    const infText = doc.splitTextToSize(obs.inference, 55);
    const rowHeight = Math.max(stepText.length, obsText.length, infText.length) * 5 + 4;

    doc.rect(15, y, 180, rowHeight);
    doc.text(stepText, 17, y + 4.5);
    doc.text(obsText, 77, y + 4.5);
    doc.text(infText, 142, y + 4.5);
    y += rowHeight;
  });
  y += 6;

  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  // 6. CHEMICAL EQUATIONS
  if (report.equations.length > 0) {
    doc.setFontSize(12);
    doc.setFont('Helvetica', 'bold');
    doc.text('BALANCED CHEMICAL EQUATIONS:', 15, y);
    y += 6;
    doc.setFont('Courier', 'normal'); // Monospace for equations
    doc.setFontSize(10);
    report.equations.forEach(eq => {
      const splitEq = doc.splitTextToSize(eq, 180);
      doc.text(splitEq, 15, y);
      y += splitEq.length * 5.5;
    });
    y += 4;
  }

  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  // 7. RESULT
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('RESULT:', 15, y);
  y += 6;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(11);
  const splitResult = doc.splitTextToSize(report.result, 180);
  doc.text(splitResult, 15, y);
  y += splitResult.length * 6 + 4;

  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  // 8. PRECAUTIONS
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('SAFETY PRECAUTIONS:', 15, y);
  y += 6;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10.5);
  report.precautions.forEach(prec => {
    const splitPrec = doc.splitTextToSize(`- ${prec}`, 180);
    doc.text(splitPrec, 15, y);
    y += splitPrec.length * 5.5;
  });

  // Footer page numbering
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Page ${i} of ${pageCount}`, 100, 287);
    doc.text('Class 12 AI Virtual Lab Report - Grounded in syllabus practical standards.', 15, 287);
  }

  doc.save(filename);
}
