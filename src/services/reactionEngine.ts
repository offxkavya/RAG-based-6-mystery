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
  // CATION TEST: ZINC (Zn2+)
  // ==========================================
  if (has('zn_so4')) {
    // 1. Zn2+ + NaOH -> White ppt, dissolves in excess NaOH
    if (has('na_oh')) {
      const excess = actionHistory.includes('excess_reagent');
      if (excess) {
        return {
          color: 'rgba(255, 255, 255, 0.2)',
          precipitate: { present: false, color: '', type: 'none', details: '' },
          gas: { present: false, name: '', color: '', smell: '', bubbles: false },
          temperatureEffect: 'none',
          balancedEquation: 'Zn(OH)2 + 2NaOH -> Na2ZnO2 (aq) + 2H2O',
          inference: 'White precipitate of Zn(OH)2 dissolves in excess NaOH.',
          identifiedIon: 'Zn2+',
          explanation: 'Zinc hydroxide is amphoteric and reacts with excess hydroxide to form soluble sodium zincate.'
        };
      } else {
        return {
          color: 'rgba(255, 255, 255, 0.2)',
          precipitate: {
            present: true,
            color: '#ffffff',
            type: 'powdery',
            details: 'White precipitate of Zinc Hydroxide Zn(OH)2'
          },
          gas: { present: false, name: '', color: '', smell: '', bubbles: false },
          temperatureEffect: 'none',
          balancedEquation: 'ZnSO4 + 2NaOH -> Zn(OH)2↓ + Na2SO4',
          inference: 'White precipitate formed. Zn2+ indicated.',
          identifiedIon: 'Zn2+',
          explanation: 'Zinc ions react with hydroxide to precipitate white zinc hydroxide.'
        };
      }
    }

    // 2. Zn2+ + H2S (in alkaline medium) -> Grey/white ppt
    if ((has('h2_s_water') || has('na2_s')) && (has('nh4_oh') || has('na_oh'))) {
      return {
        color: 'rgba(255, 255, 255, 0.2)',
        precipitate: {
          present: true,
          color: '#e5e7eb', // dirty white
          type: 'powdery',
          details: 'White-grey precipitate of Zinc Sulfide ZnS'
        },
        gas: { present: false, name: '', color: '', smell: '', bubbles: false },
        temperatureEffect: 'none',
        balancedEquation: 'ZnSO4 + H2S --(base)--> ZnS↓ + H2SO4',
        inference: 'Dirty-white precipitate formed. Group IV cation (Zn2+) indicated.',
        identifiedIon: 'Zn2+',
        explanation: 'Zinc sulfide precipitates in alkaline medium because the sulfide ion concentration is high enough to exceed the Ksp of ZnS.'
      };
    }
  }

  // ==========================================
  // CATION TEST: NICKEL (Ni2+)
  // ==========================================
  if (has('ni_so4')) {
    // 1. Ni2+ + DMG + NH4OH -> Cherry-red ppt
    if (has('dmg_reagent') && (has('nh4_oh') || has('na_oh'))) {
      return {
        color: 'rgba(255, 255, 255, 0.2)',
        precipitate: {
          present: true,
          color: '#e11d48', // Cherry-red
          type: 'curdy',
          details: 'Brilliant cherry-red precipitate of Nickel DMG complex [Ni(dmg)2]'
        },
        gas: { present: false, name: '', color: '', smell: '', bubbles: false },
        temperatureEffect: 'none',
        balancedEquation: 'Ni2+ + 2C4H8N2O2 --(NH3)--> [Ni(C4H7N2O2)2]↓ + 2H+',
        inference: 'Cherry-red precipitate formed. Ni2+ cation confirmed.',
        identifiedIon: 'Ni2+',
        explanation: 'Nickel(II) ions react with Dimethylglyoxime in an ammoniacal (basic) solution to form a bright, highly insolubilized cherry-red complex.'
      };
    }

    // 2. Ni2+ + NaOH -> Green ppt
    if (has('na_oh')) {
      return {
        color: 'rgba(255, 255, 255, 0.2)',
        precipitate: {
          present: true,
          color: '#a7f3d0', // Pale green
          type: 'powdery',
          details: 'Green precipitate of Nickel Hydroxide Ni(OH)2'
        },
        gas: { present: false, name: '', color: '', smell: '', bubbles: false },
        temperatureEffect: 'none',
        balancedEquation: 'NiSO4 + 2NaOH -> Ni(OH)2↓ + Na2SO4',
        inference: 'Green precipitate formed. Ni2+ indicated.',
        explanation: 'Nickel(II) forms a green precipitate of Nickel(II) hydroxide with alkali.'
      };
    }
  }

  // ==========================================
  // CATION TEST: CALCIUM (Ca2+)
  // ==========================================
  if (has('ca_cl2')) {
    // Calcium + Ammonium Oxalate -> white ppt
    if (has('nh4_c2o4_aq') || has('na2_c2o4')) {
      return {
        color: 'rgba(255, 255, 255, 0.2)',
        precipitate: {
          present: true,
          color: '#ffffff',
          type: 'crystalline',
          details: 'White precipitate of Calcium Oxalate CaC2O4'
        },
        gas: { present: false, name: '', color: '', smell: '', bubbles: false },
        temperatureEffect: 'none',
        balancedEquation: 'CaCl2 + (NH4)2C2O4 -> CaC2O4↓ + 2NH4Cl',
        inference: 'White precipitate formed. Ca2+ confirmed.',
        identifiedIon: 'Ca2+',
        explanation: 'Calcium ions react with oxalate ions to form highly insoluble calcium oxalate precipitate.'
      };
    }
  }

  // ==========================================
  // CATION TEST: BARIUM (Ba2+)
  // ==========================================
  if (has('ba_cl2')) {
    // Barium + Sulfate -> white ppt (BaSO4)
    if (has('na2_so4') || has('mg_so4') || has('dil_h2so4') || has('conc_h2so4')) {
      return {
        color: 'rgba(255, 255, 255, 0.2)',
        precipitate: {
          present: true,
          color: '#ffffff',
          type: 'powdery',
          details: 'Heavy white precipitate of Barium Sulfate BaSO4'
        },
        gas: { present: false, name: '', color: '', smell: '', bubbles: false },
        temperatureEffect: 'none',
        balancedEquation: 'BaCl2 + H2SO4 -> BaSO4↓ + 2HCl',
        inference: 'Thick white precipitate, insoluble in concentrated acids. Ba2+ and Sulfate confirmed.',
        identifiedIon: 'Ba2+',
        explanation: 'Barium ions react with sulfate ions to form barium sulfate, which is highly insoluble in water and dilute acids.'
      };
    }
  }

  // ==========================================
  // CATION TEST: AMMONIUM (NH4+)
  // ==========================================
  if (has('nh4_cl')) {
    // NH4+ + NaOH + heat -> Ammonia gas
    if (has('na_oh')) {
      if (isHeated) {
        return {
          color: 'rgba(255, 255, 255, 0.2)',
          precipitate: { present: false, color: '', type: 'none', details: '' },
          gas: {
            present: true,
            name: 'NH3',
            color: 'rgba(255, 255, 255, 0.1)',
            smell: 'pungent, ammonia smell',
            bubbles: true
          },
          temperatureEffect: 'none',
          balancedEquation: 'NH4Cl + NaOH --(heat)--> NaCl + H2O + NH3↑',
          inference: 'Pungent smelling gas evolved. NH4+ indicated.',
          identifiedIon: 'NH4+',
          explanation: 'Ammonium salts react with strong alkalis on heating to release free ammonia gas. Ammonia can be detected by its pungent odor.'
        };
      }
    }

    // NH4+ + Nessler's reagent -> Brown ppt
    if (has('nessler_reagent')) {
      return {
        color: 'rgba(255, 255, 255, 0.2)',
        precipitate: {
          present: true,
          color: '#7c2d12', // Reddish-brown
          type: 'powdery',
          details: 'Brown precipitate of Iodide of Million\'s base (3HgO.Hg(NH2)I)'
        },
        gas: { present: false, name: '', color: '', smell: '', bubbles: false },
        temperatureEffect: 'none',
        balancedEquation: 'NH4+ + 2K2[HgI4] + 4OH- -> NH2.HgO.HgI↓ (brown) + 7I- + 3H2O + 4K+',
        inference: 'Brown precipitate formed. NH4+ cation confirmed.',
        identifiedIon: 'NH4+',
        explanation: 'Ammonium ions react with Nessler\'s reagent in basic medium to form a characteristic brown precipitate of basic mercury(II) amido-iodide complex.'
      };
    }
  }

  // ==========================================
  // ANION TEST: CARBONATE (CO3^2-)
  // ==========================================
  if (has('na2_co3') && (has('dil_hcl') || has('dil_h2so4') || has('conc_h2so4') || has('conc_hcl'))) {
    return {
      color: 'rgba(255, 255, 255, 0.2)',
      precipitate: { present: false, color: '', type: 'none', details: '' },
      gas: {
        present: true,
        name: 'CO2',
        color: 'rgba(255, 255, 255, 0.1)',
        smell: 'odorless',
        bubbles: true
      },
      temperatureEffect: 'none',
      balancedEquation: 'Na2CO3 + 2HCl -> 2NaCl + H2O + CO2↑',
      inference: 'Brisk effervescence with evolution of colorless, odorless gas. Carbonate (CO3^2-) indicated.',
      identifiedIon: 'CO32-',
      explanation: 'Carbonates react with dilute acids to release carbon dioxide gas which bubbles out rapidly (brisk effervescence).'
    };
  }

  // ==========================================
  // ANION TEST: SULFIDE (S^2-)
  // ==========================================
  if (has('na2_s') && (has('dil_hcl') || has('dil_h2so4') || has('conc_h2so4') || has('conc_hcl'))) {
    return {
      color: 'rgba(255, 255, 255, 0.2)',
      precipitate: { present: false, color: '', type: 'none', details: '' },
      gas: {
        present: true,
        name: 'H2S',
        color: 'rgba(255, 255, 255, 0.15)',
        smell: 'rotten eggs',
        bubbles: true
      },
      temperatureEffect: 'none',
      balancedEquation: 'Na2S + H2SO4 -> Na2SO4 + H2S↑',
      inference: 'Colorless gas with rotten-egg smell evolved. Sulfide (S2-) indicated.',
      identifiedIon: 'S2-',
      explanation: 'Sulfide salts react with dilute acids to release toxic hydrogen sulfide gas, which has a distinct rotten-egg smell.'
    };
  }

  // ==========================================
  // ANION TEST: SULFITE (SO3^2-)
  // ==========================================
  if (has('na2_so3') && (has('dil_hcl') || has('dil_h2so4') || has('conc_h2so4') || has('conc_hcl'))) {
    return {
      color: 'rgba(255, 255, 255, 0.2)',
      precipitate: { present: false, color: '', type: 'none', details: '' },
      gas: {
        present: true,
        name: 'SO2',
        color: 'rgba(255, 255, 255, 0.1)',
        smell: 'burning sulfur / suffocating',
        bubbles: true
      },
      temperatureEffect: 'none',
      balancedEquation: 'Na2SO3 + H2SO4 -> Na2SO4 + H2O + SO2↑',
      inference: 'Colorless gas with suffocating smell of burning sulfur. Sulfite (SO32-) indicated.',
      identifiedIon: 'SO32-',
      explanation: 'Sulfite salts react with acids to release sulfur dioxide gas.'
    };
  }

  // ==========================================
  // ANION TEST: NITRITE (NO2-)
  // ==========================================
  if (has('na_oh') || has('na_no2')) {
    if (has('na_no2') && (has('dil_hcl') || has('dil_h2so4') || has('conc_h2so4') || has('conc_hcl'))) {
      return {
        color: 'rgba(254, 243, 199, 0.3)',
        precipitate: { present: false, color: '', type: 'none', details: '' },
        gas: {
          present: true,
          name: 'NO2',
          color: '#b45309', // Light brown gas
          smell: 'pungent, suffocating',
          bubbles: true
        },
        temperatureEffect: 'none',
        balancedEquation: '2NaNO2 + H2SO4 -> Na2SO4 + HNO2 + HNO3 + NO2↑',
        inference: 'Brown gas evolved. Nitrite (NO2-) indicated.',
        identifiedIon: 'NO2-',
        explanation: 'Nitrite salts react with acids to form unstable nitrous acid, which decomposes to liberate reddish-brown nitrogen dioxide gas.'
      };
    }
  }

  // ==========================================
  // ANION TEST: HALIDES (Cl-, Br-, I-) with AgNO3
  // ==========================================
  if (has('ag_no3_aq')) {
    // 1. Chloride
    if (has('na_cl') || has('nh4_cl')) {
      return {
        color: 'rgba(255, 255, 255, 0.2)',
        precipitate: {
          present: true,
          color: '#ffffff',
          type: 'curdy',
          details: 'Curdy white precipitate of Silver Chloride AgCl'
        },
        gas: { present: false, name: '', color: '', smell: '', bubbles: false },
        temperatureEffect: 'none',
        balancedEquation: 'NaCl + AgNO3 -> AgCl↓ + NaNO3',
        inference: 'Curdy white precipitate, soluble in NH4OH. Chloride (Cl-) confirmed.',
        identifiedIon: 'Cl-',
        explanation: 'Chloride ions react with silver nitrate to form white curdy silver chloride, which dissolves in ammonium hydroxide due to soluble diamminesilver(I) complex formation.'
      };
    }
    // 2. Bromide
    if (has('k_br')) {
      return {
        color: 'rgba(255, 255, 255, 0.2)',
        precipitate: {
          present: true,
          color: '#fef08a', // pale yellow
          type: 'powdery',
          details: 'Pale yellow precipitate of Silver Bromide AgBr'
        },
        gas: { present: false, name: '', color: '', smell: '', bubbles: false },
        temperatureEffect: 'none',
        balancedEquation: 'KBr + AgNO3 -> AgBr↓ + KNO3',
        inference: 'Pale yellow precipitate, sparingly soluble in NH4OH. Bromide (Br-) confirmed.',
        identifiedIon: 'Br-',
        explanation: 'Bromide ions react with silver nitrate to precipitate pale yellow silver bromide.'
      };
    }
    // 3. Iodide
    if (has('k_i')) {
      return {
        color: 'rgba(255, 255, 255, 0.2)',
        precipitate: {
          present: true,
          color: '#facc15', // yellow
          type: 'powdery',
          details: 'Yellow precipitate of Silver Iodide AgI'
        },
        gas: { present: false, name: '', color: '', smell: '', bubbles: false },
        temperatureEffect: 'none',
        balancedEquation: 'KI + AgNO3 -> AgI↓ + KNO3',
        inference: 'Bright yellow precipitate, insoluble in NH4OH. Iodide (I-) confirmed.',
        identifiedIon: 'I-',
        explanation: 'Iodide ions react with silver nitrate to precipitate bright yellow silver iodide.'
      };
    }
  }

  // ==========================================
  // NITRATE TEST (NO3-) - BROWN RING TEST
  // ==========================================
  if (has('k_no3') || has('pb_no3_2')) {
    // Brown ring conditions: Nitrate + freshly prepared FeSO4 + conc H2SO4 (carefully)
    if (has('fe_so4_aq') && has('conc_h2so4')) {
      return {
        color: 'rgba(255, 255, 255, 0.2)',
        precipitate: {
          present: true,
          color: '#78350f', // Brown layer
          type: 'crystalline', // represent the ring
          details: 'Brown ring of Nitrosoferrous Sulfate [Fe(H2O)5(NO)]SO4 at the junction'
        },
        gas: { present: false, name: '', color: '', smell: '', bubbles: false },
        temperatureEffect: 'exothermic',
        balancedEquation: '2KNO3 + 6FeSO4 + 4H2SO4 -> 3Fe2(SO4)3 + K2SO4 + 4H2O + 2[Fe(H2O)5(NO)]SO4 (ring)',
        inference: 'Brown ring formed at the junction of the two liquids. Nitrate (NO3-) confirmed.',
        identifiedIon: 'NO3-',
        explanation: 'Nitrate ions are reduced to nitric oxide (NO) by iron(II) ions. NO then complexes with remaining hydrated iron(II) ions to form a brown-colored coordination complex [Fe(H2O)5(NO)]2+ which appears as a ring at the interface of sulfuric acid.'
      };
    }
  }

  // ==========================================
  // ORGANIC TEST: CARBOHYDRATES / PROTEINS
  // ==========================================
  if (has('egg_albumin')) {
    // 1. Biuret Test: Protein + NaOH + CuSO4 (reagents represented here by na_oh + cu_so4)
    if (has('na_oh') && has('cu_so4')) {
      return {
        color: '#7c3aed', // Purple/Violet
        precipitate: { present: false, color: '', type: 'none', details: '' },
        gas: { present: false, name: '', color: '', smell: '', bubbles: false },
        temperatureEffect: 'none',
        balancedEquation: 'Protein + Cu2+ --(alkaline)--> Violet Complex',
        inference: 'Violet coloration observed. Proteins confirmed (Biuret Test).',
        identifiedIon: 'protein',
        explanation: 'The Biuret test detects peptide bonds. Copper(II) ions complex with peptide nitrogen atoms in basic medium to yield a violet coordination complex.'
      };
    }
    // 2. Xanthoproteic Test: Protein + conc. HNO3 + heat -> Yellow solution
    if (has('conc_hno3')) {
      if (isHeated) {
        return {
          color: '#f59e0b', // Yellow/Orange
          precipitate: { present: false, color: '', type: 'none', details: '' },
          gas: { present: false, name: '', color: '', smell: '', bubbles: false },
          temperatureEffect: 'none',
          balancedEquation: 'Protein + HNO3 (conc) --(heat)--> Yellow nitro-protein',
          inference: 'Yellow coloration formed. Proteins confirmed (Xanthoproteic Test).',
          identifiedIon: 'protein',
          explanation: 'Concentrated nitric acid reacts with activated aromatic amino acids (like tyrosine and tryptophan) in proteins, nitrating the benzene ring to yield yellow nitro-compounds.'
        };
      }
    }
  }

  // 3. Glucose + Fehling's Test (simulated by cu_so4 + na_oh + glucose_sol + heat)
  if (has('glucose_sol') && has('cu_so4') && has('na_oh')) {
    if (isHeated) {
      return {
        color: 'rgba(255, 255, 255, 0.2)',
        precipitate: {
          present: true,
          color: '#dc2626', // Brick red
          type: 'powdery',
          details: 'Brick-red precipitate of Cuprous Oxide Cu2O'
        },
        gas: { present: false, name: '', color: '', smell: '', bubbles: false },
        temperatureEffect: 'none',
        balancedEquation: 'R-CHO + 2Cu2+ + 5OH- --(heat)--> R-COO- + Cu2O↓ (red) + 3H2O',
        inference: 'Brick-red precipitate of Cu2O formed. Reducing Sugar (Glucose) confirmed.',
        identifiedIon: 'reducing_sugar',
        explanation: 'Fehling\'s/Benedict\'s test contains copper(II) ions in basic complex. Heating with reducing sugars reduces the copper(II) (blue) to insoluble copper(I) oxide (brick-red ppt).'
      };
    }
  }

  // 4. Starch + Iodine (simulated by starch_sol or starch_indicator + k_i + conc_h2so4/dil_hcl or KI oxidizes to I2)
  // Let's make starch + KI + Conc H2SO4 release Iodine, turning starch blue-black
  if (hasAny('starch_sol', 'starch_indicator') && has('k_i') && (has('conc_h2so4') || has('dil_hno3'))) {
    return {
      color: '#1e1b4b', // Very dark blue-black
      precipitate: { present: false, color: '', type: 'none', details: '' },
      gas: { present: false, name: '', color: '', smell: '', bubbles: false },
      temperatureEffect: 'none',
      balancedEquation: '2I- + H2SO4 + O2 -> I2 + SO4(2-) + H2O; I2 + Starch -> Starch-Iodine Complex',
      inference: 'Intense blue-black coloration observed. Starch confirmed.',
      explanation: 'The oxidizing environment oxidizes iodide (I-) to free iodine (I2). Free iodine slips inside the helices of starch amylose, forming a coordinate complex with a characteristic deep blue-black color.'
    };
  }

  // ==========================================
  // SURFACE CHEMISTRY: ADSORPTION OF ACETIC ACID ON CHARCOAL
  // ==========================================
  if (has('acetic_acid') && has('activated_charcoal') && actionHistory.includes('filter')) {
    return {
      color: 'rgba(255, 255, 255, 0.1)', // filtered water-like
      precipitate: { present: false, color: '', type: 'none', details: '' },
      gas: { present: false, name: '', color: '', smell: '', bubbles: false },
      temperatureEffect: 'none',
      balancedEquation: 'CH3COOH (aq) + Charcoal (s) -> CH3COOH (adsorbed on charcoal) + filtrate',
      inference: 'Adsorption completed. Acetic acid molecules adsorbed on charcoal surface, reducing concentration in filtrate.',
      explanation: 'Activated charcoal has high porosity and surface area. It adsorbs acetic acid molecules via physical adsorption (Van der Waals forces). The filtrate has a lower concentration of acid.'
    };
  }

  // ==========================================
  // PHENOL TEST
  // ==========================================
  if (has('phenol_pure') && has('fe_cl3')) {
    return {
      color: '#4c1d95', // Deep Violet
      precipitate: { present: false, color: '', type: 'none', details: '' },
      gas: { present: false, name: '', color: '', smell: '', bubbles: false },
      temperatureEffect: 'none',
      balancedEquation: '6C6H5OH + FeCl3 -> H3[Fe(OC6H5)6] (violet complex) + 3HCl',
      inference: 'Characteristic violet coloration observed. Phenolic group confirmed.',
      identifiedIon: 'phenol',
      explanation: 'Phenol reacts with neutral ferric chloride solution to form a soluble coordination complex of iron(III) which exhibits a deep violet/purple color.'
    };
  }

  // If no specific reaction triggers, return default outcome
  return defaultOutcome;
}
