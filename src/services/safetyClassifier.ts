export interface SafetyReport {
  isSafe: boolean;
  dangerLevel: 'none' | 'low' | 'medium' | 'high';
  hazardTitle?: string;
  explanation?: string;
  precautions?: string[];
}

export function evaluateSafety(chemicalIds: string[], actionHistory: string[]): SafetyReport {
  const has = (id: string) => chemicalIds.includes(id);
  const isHeated = actionHistory.includes('heat');

  // 1. HIGH DANGER: Concentrated Sulfuric Acid + Water (direct mixing without care)
  if (has('conc_h2so4') && has('water') && !actionHistory.includes('acid_to_water')) {
    return {
      isSafe: false,
      dangerLevel: 'high',
      hazardTitle: 'Acid Splattering Hazard (Exothermic Runaway)',
      explanation: 'Adding water directly to concentrated sulfuric acid releases an enormous amount of heat (hydration energy). The water boils instantly at the surface, causing the concentrated acid to splatter violently out of the test tube.',
      precautions: [
        'NEVER add water to concentrated acid.',
        'Always add concentrated acid slowly along the sides of the vessel containing water, with constant stirring and cooling.'
      ]
    };
  }

  // 2. HIGH DANGER: Potassium Ferrocyanide + Concentrated Acids
  if (has('k4_fe_cn_6') && (has('conc_h2so4') || has('conc_hcl') || has('conc_hno3'))) {
    return {
      isSafe: false,
      dangerLevel: 'high',
      hazardTitle: 'Lethal Hydrogen Cyanide (HCN) Gas Release',
      explanation: 'Potassium ferrocyanide contains complexed cyanide groups. Under strongly acidic conditions (especially concentrated sulfuric or hydrochloric acid) and heat, the complex decomposes, liberating highly toxic and lethal hydrogen cyanide (HCN) gas.',
      precautions: [
        'Never mix cyanides or ferrocyanides with concentrated strong acids.',
        'If required by the syllabus, perform under a high-efficiency fume hood with extreme caution.'
      ]
    };
  }

  // 3. HIGH DANGER: Concentrated HNO3/H2SO4 + Organic solvent/Phenol
  if ((has('conc_hno3') || has('conc_h2so4')) && has('phenol_pure') && isHeated) {
    return {
      isSafe: false,
      dangerLevel: 'high',
      hazardTitle: 'Rapid Exothermic Nitration & Runaway Explosion',
      explanation: 'Concentrated nitric acid mixed with phenol undergoes rapid aromatic nitration, forming picric acid (trinitrophenol). This reaction is highly exothermic and can lead to a thermal runaway and chemical explosion if not temperature-controlled.',
      precautions: [
        'Do not heat concentrated nitric acid directly with pure organic aromatics.',
        'Perform in dilute conditions and ice baths.'
      ]
    };
  }

  // 4. MEDIUM DANGER: Sodium Sulfide + Acids -> Toxic H2S Gas
  if (has('na2_s') && (has('dil_hcl') || has('dil_h2so4') || has('conc_h2so4') || has('conc_hcl') || has('dil_hno3'))) {
    return {
      isSafe: false,
      dangerLevel: 'medium',
      hazardTitle: 'Toxic Hydrogen Sulfide (H2S) Gas Release',
      explanation: 'Mixing sulfides with any acid releases Hydrogen Sulfide (H2S) gas. H2S is highly toxic, smells like rotten eggs, and can cause headache, nausea, and respiratory paralysis in higher concentrations.',
      precautions: [
        'Perform sulfide tests only in a well-ventilated laboratory or fume hood.',
        'Keep the quantities of sodium sulfide very small.'
      ]
    };
  }

  // 5. MEDIUM DANGER: Sodium Nitrite + Acids -> Toxic NO2 Gas
  if (has('na_no2') && (has('dil_hcl') || has('dil_h2so4') || has('conc_h2so4') || has('conc_hcl'))) {
    return {
      isSafe: false,
      dangerLevel: 'medium',
      hazardTitle: 'Corrosive Nitrogen Dioxide (NO2) Gas Release',
      explanation: 'Mixing nitrites with acids produces brown nitrogen dioxide (NO2) gas. NO2 is a severe respiratory irritant that causes pulmonary edema upon inhalation of significant quantities.',
      precautions: [
        'Do not inhale the brown fumes.',
        'Perform in a fume hood or near an exhaust window.'
      ]
    };
  }

  // 6. MEDIUM DANGER: Sodium Sulfite + Acids -> Pungent SO2 Gas
  if (has('na2_so3') && (has('dil_hcl') || has('dil_h2so4') || has('conc_h2so4') || has('conc_hcl'))) {
    return {
      isSafe: false,
      dangerLevel: 'medium',
      hazardTitle: 'Sulfur Dioxide (SO2) Suffocating Fumes',
      explanation: 'Acidifying sulfites liberates Sulfur Dioxide (SO2) gas, which has a suffocating, burning sulfur smell. SO2 dissolves in respiratory moisture to form sulfurous acid, irritating mucous membranes.',
      precautions: [
        'Keep the test tube pointed away from your face.',
        'Use dilute acids and small amounts of salt.'
      ]
    };
  }

  // 7. LOW/MEDIUM DANGER: Nessler\'s Reagent (Mercury Toxics)
  if (has('nessler_reagent') && (has('dil_hcl') || has('conc_hcl') || has('dil_h2so4') || has('conc_h2so4'))) {
    return {
      isSafe: true, // Lab simulation proceeds, but flags caution
      dangerLevel: 'low',
      hazardTitle: 'Mercury Heavy Metal Exposure & Neutralization hazard',
      explanation: 'Nessler\'s reagent contains mercury (K2[HgI4]). Adding strong acids to it neutralizes the KOH base and causes toxic mercuric salts to precipitate, creating chemical waste disposal hazards.',
      precautions: [
        'Avoid skin contact. Mercury compounds are neurotoxic and absorbable.',
        'Dispose of Nessler\'s reagent waste in designated heavy metal containers.'
      ]
    };
  }

  // 8. LOW DANGER: Brisk Effervescence (CO2)
  if (has('na2_co3') && (has('dil_hcl') || has('dil_h2so4'))) {
    return {
      isSafe: true,
      dangerLevel: 'none',
      explanation: 'Generates Carbon Dioxide (CO2) gas. Safe to handle under normal laboratory ventilation.'
    };
  }

  return {
    isSafe: true,
    dangerLevel: 'none'
  };
}
