import { CHEMICAL_DATABASE } from './chemicalDb';

export interface ReactionOutcome {
  color: string; // css color (hex/rgba)
  precipitate: {
    present: boolean;
    color: string;
    type: 'gelatinous' | 'curdy' | 'crystalline' | 'powdery' | 'none';
    details: string;
  };
  gas: {
    present: boolean;
    name: string; // e.g. "CO2", "H2S", "NH3", "NO2", "SO2", "Cl2", "Br2", "I2"
    color: string; // css color
    smell: string;
    bubbles: boolean;
  };
  temperatureEffect: 'exothermic' | 'endothermic' | 'none';
  balancedEquation: string;
  inference: string;
  identifiedIon?: string;
  explanation: string;
}

// Evaluate what happens when a list of chemical IDs are added together in a vessel under specific conditions.
export function evaluateReaction(
  chemicalIds: string[],
  temperature: number, // in Celsius, standard is 25, heated is e.g. 70-100
  actionHistory: string[] // e.g. 'stir', 'filter', 'heat'
): ReactionOutcome {
  // Normalize chemicals list
  const uniqueChemicals = Array.from(new Set(chemicalIds));
  
  // Default fallback (no chemicals, or just water)
  const defaultOutcome: ReactionOutcome = {
    color: 'rgba(255, 255, 255, 0.2)', // clear
    precipitate: { present: false, color: '', type: 'none', details: '' },
    gas: { present: false, name: '', color: '', smell: '', bubbles: false },
    temperatureEffect: 'none',
    balancedEquation: '',
    inference: 'No reaction observed.',
    explanation: 'Substances are either unreactive or dissolved as spectator ions.'
  };

  if (uniqueChemicals.length === 0) {
    return defaultOutcome;
  }

  // If there's only one chemical
  if (uniqueChemicals.length === 1) {
    const chemId = uniqueChemicals[0];
    const chem = CHEMICAL_DATABASE[chemId];
    if (!chem) return defaultOutcome;

    // Convert solid to aqueous if water is in the system or standard visual
    if (chem.state === 'solid') {
      // Solid in vessel (dry test)
      return {
        color: 'rgba(255, 255, 255, 0.1)',
        precipitate: {
          present: true,
          color: chem.color,
          type: 'powdery',
          details: `Dry solid powder of ${chem.name}`
        },
        gas: { present: false, name: '', color: '', smell: '', bubbles: false },
        temperatureEffect: 'none',
        balancedEquation: '',
        inference: `Placed dry ${chem.name} in vessel.`,
        explanation: `${chem.name} is a ${chem.color === '#ffffff' ? 'white' : 'colored'} crystalline solid.`
      };
    }

    return {
      color: chem.color,
      precipitate: { present: false, color: '', type: 'none', details: '' },
      gas: { present: false, name: '', color: '', smell: '', bubbles: false },
      temperatureEffect: 'none',
      balancedEquation: '',
      inference: `Added ${chem.name} to the vessel.`,
      explanation: `${chem.name} dissolved in water to form a solution.`
    };
  }

  const has = (id: string) => uniqueChemicals.includes(id);
  const hasAny = (...ids: string[]) => ids.some(id => uniqueChemicals.includes(id));
  const isHeated = temperature > 50 || actionHistory.includes('heat');

  // Let's check for specific reaction rules in Class 12 syllabus:

  // ==========================================
  // SAFETY & EXOTHERMIC EXPLOSIONS (e.g. Conc H2SO4 + Water)
  // ==========================================
  if (has('conc_h2so4') && has('water') && !actionHistory.includes('acid_to_water')) {
    return {
      color: 'rgba(255, 255, 255, 0.3)',
      precipitate: { present: false, color: '', type: 'none', details: '' },
      gas: { present: true, name: 'H2O Vapor', color: 'rgba(240, 240, 240, 0.5)', smell: 'none', bubbles: true },
      temperatureEffect: 'exothermic',
      balancedEquation: 'H2SO4 (conc) + H2O -> H2SO4 (aq) + Heat',
      inference: 'WARNING: DANGEROUS REACTION! Extreme heat evolved.',
      explanation: 'Adding water directly to concentrated sulfuric acid causes sudden boiling and spitting of the acid due to the highly exothermic hydration reaction. Always add acid to water slowly with constant stirring.'
    };
  }

  // ==========================================
  // REDOX TITRATION: KMnO4 + Mohr's Salt / Oxalic Acid
  // ==========================================
  // KMnO4 (purple) + Mohr's Salt (FeSO4) + acid -> Fe3+ (very pale yellow) + Mn2+ (colorless)
  if (has('k_mn_o4_aq') && (has('fe_so4_aq') || has('na2_c2o4')) && (has('dil_h2so4') || has('conc_h2so4'))) {
    const isOxalate = has('na2_c2o4');
    
    if (isOxalate && !isHeated) {
      // Oxalic acid titration requires warming to 60C, otherwise reaction is extremely slow
      return {
        color: '#a21caf', // remains purple-pink
        precipitate: { present: false, color: '', type: 'none', details: '' },
        gas: { present: false, name: '', color: '', smell: '', bubbles: false },
        temperatureEffect: 'none',
        balancedEquation: '2KMnO4 + 5Na2C2O4 + 8H2SO4 -> K2SO4 + 2MnSO4 + 5Na2SO4 + 10CO2 + 8H2O (SLOW AT RT)',
        inference: 'Slow reaction. Purple color of KMnO4 does not decolorize immediately at room temperature.',
        explanation: 'Oxalate ions react slowly with permanganate at room temperature because the activation energy is high. Warmed solution (60-70°C) is required for KMnO4 to decolorize rapidly.'
      };
    }

    // Reaction happens! KMnO4 is decolorized.
    const reactionEq = isOxalate 
      ? '2KMnO4 + 5Na2C2O4 + 8H2SO4 -> K2SO4 + 2MnSO4 + 5Na2SO4 + 10CO2↑ + 8H2O'
      : '2KMnO4 + 10FeSO4 + 8H2SO4 -> K2SO4 + 2MnSO4 + 5Fe2(SO4)3 + 8H2O';
    
    return {
      color: 'rgba(255, 255, 255, 0.2)', // Colorless Mn2+
      precipitate: { present: false, color: '', type: 'none', details: '' },
      gas: { 
        present: isOxalate, 
        name: 'CO2', 
        color: 'rgba(255, 255, 255, 0.1)', 
        smell: 'odorless', 
        bubbles: isOxalate 
      },
      temperatureEffect: 'exothermic',
      balancedEquation: reactionEq,
      inference: 'Permanganate color discharged (decolorized). Endpoint reached.',
      explanation: `Potassium Permanganate (Mn VII, purple) is reduced to Manganese sulfate (Mn II, colorless) by ${isOxalate ? 'oxalate' : 'ferrous'} ions in acidic medium. This represents a quantitative redox titration.`
    };
  }

  // ==========================================
  // CATION TEST: LEAD (Pb2+)
  // ==========================================
  if (hasAny('pb_no3_2')) {
    // 1. Pb2+ + HCl -> PbCl2 white ppt
    if (hasAny('dil_hcl', 'conc_hcl')) {
      if (isHeated) {
        // PbCl2 dissolves in hot water!
        return {
          color: 'rgba(255, 255, 255, 0.25)',
          precipitate: { present: false, color: '', type: 'none', details: '' },
          gas: { present: false, name: '', color: '', smell: '', bubbles: false },
          temperatureEffect: 'none',
          balancedEquation: 'Pb(NO3)2 + 2HCl --(heat)--> PbCl2 (aq) + 2HNO3',
          inference: 'Lead Chloride precipitate dissolves on heating.',
          identifiedIon: 'Pb2+',
          explanation: 'Lead chloride is insoluble in cold water but dissolves readily in hot water due to its temperature-dependent solubility curve.'
        };
      } else {
        return {
          color: 'rgba(255, 255, 255, 0.2)',
          precipitate: { 
            present: true, 
            color: '#ffffff', 
            type: 'crystalline', 
            details: 'White precipitate of Lead Chloride (PbCl2)' 
          },
          gas: { present: false, name: '', color: '', smell: '', bubbles: false },
          temperatureEffect: 'none',
          balancedEquation: 'Pb(NO3)2 + 2HCl -> PbCl2↓ + 2HNO3',
          inference: 'White precipitate formed. Group I cation (Pb2+) indicated.',
          identifiedIon: 'Pb2+',
          explanation: 'Lead(II) ions react with chloride ions to precipitate white lead chloride.'
        };
      }
    }

    // 2. Pb2+ + KI -> PbI2 yellow ppt (Golden spangles)
    if (has('k_i')) {
      if (isHeated) {
        return {
          color: 'rgba(253, 224, 71, 0.3)', // light yellow solution
          precipitate: { 
            present: true, 
            color: '#facc15', 
            type: 'crystalline', 
            details: 'Golden spangles (recrystallized PbI2)' 
          },
          gas: { present: false, name: '', color: '', smell: '', bubbles: false },
          temperatureEffect: 'none',
          balancedEquation: 'Pb(NO3)2 + 2KI --(heat & cool)--> PbI2↓ + 2KNO3',
          inference: 'Brilliant yellow precipitate formed which recrystallizes as golden spangles.',
          identifiedIon: 'Pb2+',
          explanation: 'Lead Iodide precipitates as a bright yellow solid. Boiling it dissolves the precipitate, and slow cooling recrystallizes it into shiny golden-yellow hexagonal plates known as "golden spangles".'
        };
      } else {
        return {
          color: 'rgba(255, 255, 255, 0.2)',
          precipitate: { 
            present: true, 
            color: '#eab308', 
            type: 'powdery', 
            details: 'Yellow precipitate of Lead Iodide (PbI2)' 
          },
          gas: { present: false, name: '', color: '', smell: '', bubbles: false },
          temperatureEffect: 'none',
          balancedEquation: 'Pb(NO3)2 + 2KI -> PbI2↓ + 2KNO3',
          inference: 'Brilliant yellow precipitate of PbI2. Pb2+ cation confirmed.',
          identifiedIon: 'Pb2+',
          explanation: 'Lead(II) ions react with iodide ions to form a yellow precipitate of lead iodide.'
        };
      }
    }

    // 3. Pb2+ + K2CrO4 -> PbCrO4 yellow ppt (Wait, K2CrO4 can be modeled with chromate, or let's use other reactions if needed)
  }

  // ==========================================
  // CATION TEST: COPPER (Cu2+)
  // ==========================================
  if (has('cu_so4')) {
    // 1. Cu2+ + H2S -> CuS black ppt
    if (has('h2_s_water') || has('na2_s')) {
      return {
        color: 'rgba(255, 255, 255, 0.2)',
        precipitate: { 
          present: true, 
          color: '#1f2937', // Black
          type: 'powdery', 
          details: 'Black precipitate of Copper Sulfide (CuS)' 
        },
        gas: { present: false, name: '', color: '', smell: '', bubbles: false },
        temperatureEffect: 'none',
        balancedEquation: 'CuSO4 + H2S -> CuS↓ + H2SO4',
        inference: 'Black precipitate formed. Group II cation (Cu2+) indicated.',
        identifiedIon: 'Cu2+',
        explanation: 'Copper(II) ions precipitate as black copper sulfide even in acidic medium (Group II).'
      };
    }

    // 2. Cu2+ + NH4OH -> Pale blue ppt, dissolves in excess to Deep blue solution
    if (has('nh4_oh') || has('na_oh')) {
      const isAmmonia = has('nh4_oh');
      
      // Let's assume excess NH4OH or NaOH
      if (isAmmonia && actionHistory.includes('excess_reagent')) {
        return {
          color: '#1e3a8a', // Deep inky blue
          precipitate: { present: false, color: '', type: 'none', details: '' },
          gas: { present: false, name: '', color: '', smell: '', bubbles: false },
          temperatureEffect: 'none',
          balancedEquation: 'CuSO4 + 4NH4OH -> [Cu(NH3)4]SO4 + 4H2O',
          inference: 'Deep blue (inky blue) solution formed. Cu2+ confirmed.',
          identifiedIon: 'Cu2+',
          explanation: 'Copper(II) hydroxide initially precipitates as pale blue, but dissolves in excess ammonium hydroxide to form the soluble tetraamminecopper(II) complex, which exhibits a characteristic deep blue color.'
        };
      } else {
        return {
          color: 'rgba(59, 130, 246, 0.3)', // Pale blue solution
          precipitate: { 
            present: true, 
            color: '#60a5fa', // pale blue
            type: 'gelatinous', 
            details: 'Pale blue precipitate of Copper Hydroxide Cu(OH)2' 
          },
          gas: { present: false, name: '', color: '', smell: '', bubbles: false },
          temperatureEffect: 'none',
          balancedEquation: 'CuSO4 + 2NaOH -> Cu(OH)2↓ + Na2SO4',
          inference: 'Pale blue precipitate formed. Cu2+ indicated.',
          identifiedIon: 'Cu2+',
          explanation: 'Copper(II) ions react with hydroxide ions to form a pale blue precipitate of copper(II) hydroxide.'
        };
      }
    }

    // 3. Cu2+ + K4[Fe(CN)6] -> chocolate brown ppt
    if (has('k4_fe_cn_6')) {
      return {
        color: 'rgba(255, 255, 255, 0.2)',
        precipitate: {
          present: true,
          color: '#78350f', // Chocolate brown
          type: 'powdery',
          details: 'Chocolate brown precipitate of Copper Ferrocyanide Cu2[Fe(CN)6]'
        },
        gas: { present: false, name: '', color: '', smell: '', bubbles: false },
        temperatureEffect: 'none',
        balancedEquation: '2CuSO4 + K4[Fe(CN)6] -> Cu2[Fe(CN)6]↓ + 2K2SO4',
        inference: 'Chocolate brown precipitate formed. Cu2+ confirmed.',
        identifiedIon: 'Cu2+',
        explanation: 'Copper(II) ions react with potassium ferrocyanide to form a highly characteristic chocolate-brown precipitate of copper ferrocyanide.'
      };
    }
  }

  // ==========================================
  // CATION TEST: FERRIC IRON (Fe3+)
  // ==========================================
  if (has('fe_cl3')) {
    // 1. Fe3+ + NH4OH / NaOH -> Reddish brown ppt
    if (has('nh4_oh') || has('na_oh') || (has('nh4_cl') && has('nh4_oh'))) {
      return {
        color: 'rgba(255, 255, 255, 0.2)',
        precipitate: {
          present: true,
          color: '#991b1b', // Reddish-brown
          type: 'gelatinous',
          details: 'Reddish-brown gelatinous precipitate of Ferric Hydroxide Fe(OH)3'
        },
        gas: { present: false, name: '', color: '', smell: '', bubbles: false },
        temperatureEffect: 'none',
        balancedEquation: 'FeCl3 + 3NH4OH -> Fe(OH)3↓ + 3NH4Cl',
        inference: 'Reddish-brown gelatinous precipitate. Group III cation (Fe3+) indicated.',
        identifiedIon: 'Fe3+',
        explanation: 'Iron(III) ions precipitate as reddish-brown gelatinous iron(III) hydroxide in basic medium.'
      };
    }

    // 2. Fe3+ + KSCN -> blood red solution
    if (has('k_scn')) {
      return {
        color: '#7f1d1d', // Blood red
        precipitate: { present: false, color: '', type: 'none', details: '' },
        gas: { present: false, name: '', color: '', smell: '', bubbles: false },
        temperatureEffect: 'none',
        balancedEquation: 'FeCl3 + 3KSCN -> [Fe(SCN)3] (aq) + 3KCl',
        inference: 'Blood-red coloration observed. Fe3+ confirmed.',
        identifiedIon: 'Fe3+',
        explanation: 'Iron(III) ions form a highly soluble thiocyanatoiron(III) complex with thiocyanate ions, producing a characteristic blood-red color.'
      };
    }

    // 3. Fe3+ + K4[Fe(CN)6] -> Prussian blue ppt
    if (has('k4_fe_cn_6')) {
      return {
        color: 'rgba(255, 255, 255, 0.2)',
        precipitate: {
          present: true,
          color: '#1e3a8a', // Prussian Blue
          type: 'powdery',
          details: 'Prussian blue precipitate of Iron(III) Ferrocyanide Fe4[Fe(CN)6]3'
        },
        gas: { present: false, name: '', color: '', smell: '', bubbles: false },
        temperatureEffect: 'none',
        balancedEquation: '4FeCl3 + 3K4[Fe(CN)6] -> Fe4[Fe(CN)6]3↓ + 12KCl',
        inference: 'Prussian blue precipitate formed. Fe3+ confirmed.',
        identifiedIon: 'Fe3+',
        explanation: 'Iron(III) ions react with ferrocyanide to form a complex ferric ferrocyanide precipitate with an intense Prussian blue color.'
      };
    }
  }

  // ==========================================
  // CATION TEST: ALUMINUM (Al3+)
  // ==========================================
  if (has('al_cl3')) {
    // 1. Al3+ + NH4OH/NaOH -> Gelatinous white ppt
    if (has('nh4_oh') || has('na_oh') || (has('nh4_cl') && has('nh4_oh'))) {
      const isExcessNaOH = has('na_oh') && actionHistory.includes('excess_reagent');
      
      if (isExcessNaOH) {
        return {
          color: 'rgba(255, 255, 255, 0.2)',
          precipitate: { present: false, color: '', type: 'none', details: '' },
          gas: { present: false, name: '', color: '', smell: '', bubbles: false },
          temperatureEffect: 'none',
          balancedEquation: 'Al(OH)3 + NaOH -> NaAlO2 (aq) + 2H2O',
          inference: 'Gelatinous white precipitate dissolves in excess NaOH.',
          identifiedIon: 'Al3+',
          explanation: 'Aluminum hydroxide is amphoteric. It precipitates in the presence of hydroxide ions, but dissolves in excess sodium hydroxide to form soluble sodium aluminate.'
        };
      } else {
        return {
          color: 'rgba(255, 255, 255, 0.2)',
          precipitate: {
            present: true,
            color: '#f3f4f6', // white
            type: 'gelatinous',
            details: 'White gelatinous precipitate of Aluminum Hydroxide Al(OH)3'
          },
          gas: { present: false, name: '', color: '', smell: '', bubbles: false },
          temperatureEffect: 'none',
          balancedEquation: 'AlCl3 + 3NH4OH -> Al(OH)3↓ + 3NH4Cl',
          inference: 'White gelatinous precipitate formed. Group III cation (Al3+) indicated.',
          identifiedIon: 'Al3+',
          explanation: 'Aluminum ions precipitate as white gelatinous aluminum hydroxide in alkaline medium.'
        };
      }
    }
  }

  // ==========================================
  // 
  return defaultOutcome;
}