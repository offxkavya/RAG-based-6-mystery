export interface Chemical {
  id: string;
  name: string;
  formula: string;
  state: 'solid' | 'liquid' | 'gas' | 'aqueous';
  color: string; // hex color or standard name
  category: 'cation_salt' | 'anion_salt' | 'acid' | 'base' | 'reagent' | 'indicator' | 'organic' | 'other';
  synonyms: string[]; // for NLP mapping (e.g. "baking soda", "blue vitriol")
  description: string;
  safetyFlags: string[]; // e.g. "corrosive", "toxic", "oxidizer", "flammable"
  hazardsDescription?: string;
}

export const CHEMICAL_DATABASE: Record<string, Chemical> = {
  // Cations (primarily nitrates, chlorides or sulfates for testing)
  'pb_no3_2': {
    id: 'pb_no3_2',
    name: 'Lead Nitrate',
    formula: 'Pb(NO3)2',
    state: 'solid',
    color: '#ffffff',
    category: 'cation_salt',
    synonyms: ['lead nitrate', 'pb(no3)2', 'lead(ii) nitrate'],
    description: 'White crystalline solid, soluble in water. Primary salt for Pb2+ cation analysis.',
    safetyFlags: ['toxic', 'oxidizer'],
    hazardsDescription: 'Lead compounds are toxic and cumulative poisons. Keep away from heat and organic materials.'
  },
  'cu_so4': {
    id: 'cu_so4',
    name: 'Copper Sulfate Pentahydrate',
    formula: 'CuSO4',
    state: 'solid',
    color: '#3b82f6', // Bright blue
    category: 'cation_salt',
    synonyms: ['copper sulfate', 'blue vitriol', 'cuso4', 'copper(ii) sulfate', 'cupric sulfate'],
    description: 'Beautiful blue crystalline salt. Soluble in water. Primary salt for Cu2+ cation analysis.',
    safetyFlags: ['toxic', 'irritant'],
    hazardsDescription: 'Harmful if swallowed. Irritating to eyes and skin.'
  },
  'fe_cl3': {
    id: 'fe_cl3',
    name: 'Ferric Chloride',
    formula: 'FeCl3',
    state: 'solid',
    color: '#b45309', // Yellowish-brown
    category: 'cation_salt',
    synonyms: ['ferric chloride', 'fecl3', 'iron(iii) chloride'],
    description: 'Orange-brown deliquescent solid. Soluble in water. Primary salt for Fe3+ cation analysis.',
    safetyFlags: ['corrosive', 'irritant'],
    hazardsDescription: 'Corrosive to metals and causes skin burns.'
  },
  'al_cl3': {
    id: 'al_cl3',
    name: 'Aluminum Chloride',
    formula: 'AlCl3',
    state: 'solid',
    color: '#ffffff',
    category: 'cation_salt',
    synonyms: ['aluminum chloride', 'alcl3', 'aluminium chloride'],
    description: 'White solid, turns yellowish in moisture. Soluble in water. Used for Al3+ analysis.',
    safetyFlags: ['corrosive', 'irritant'],
    hazardsDescription: 'Reacts violently with water releasing HCl gas. Highly corrosive.'
  },
  'zn_so4': {
    id: 'zn_so4',
    name: 'Zinc Sulfate',
    formula: 'ZnSO4',
    state: 'solid',
    color: '#ffffff',
    category: 'cation_salt',
    synonyms: ['zinc sulfate', 'znso4'],
    description: 'White crystalline solid, soluble in water. Used for Zn2+ analysis.',
    safetyFlags: ['irritant'],
    hazardsDescription: 'Causes serious eye damage. Harmful to aquatic life.'
  },
  'ni_so4': {
    id: 'ni_so4',
    name: 'Nickel Sulfate',
    formula: 'NiSO4',
    state: 'solid',
    color: '#10b981', // Greenish-blue
    category: 'cation_salt',
    synonyms: ['nickel sulfate', 'niso4', 'nickel(ii) sulfate'],
    description: 'Beautiful emerald-green crystalline solid. Soluble in water. Used for Ni2+ analysis.',
    safetyFlags: ['toxic', 'carcinogen', 'sensitizer'],
    hazardsDescription: 'May cause cancer by inhalation. May cause allergic skin reaction.'
  },
  'ca_cl2': {
    id: 'ca_cl2',
    name: 'Calcium Chloride',
    formula: 'CaCl2',
    state: 'solid',
    color: '#ffffff',
    category: 'cation_salt',
    synonyms: ['calcium chloride', 'cacl2'],
    description: 'White deliquescent granules, soluble in water. Used for Ca2+ analysis.',
    safetyFlags: ['irritant'],
    hazardsDescription: 'Causes serious eye irritation.'
  },
  'ba_cl2': {
    id: 'ba_cl2',
    name: 'Barium Chloride',
    formula: 'BaCl2',
    state: 'solid',
    color: '#ffffff',
    category: 'cation_salt',
    synonyms: ['barium chloride', 'bacl2'],
    description: 'White crystalline solid, soluble in water. Used for Ba2+ analysis and sulfate anion test.',
    safetyFlags: ['toxic'],
    hazardsDescription: 'Toxic if swallowed. Avoid inhalation of dust.'
  },
  'mg_so4': {
    id: 'mg_so4',
    name: 'Magnesium Sulfate',
    formula: 'MgSO4',
    state: 'solid',
    color: '#ffffff',
    category: 'cation_salt',
    synonyms: ['magnesium sulfate', 'epsom salt', 'mgso4'],
    description: 'White crystalline powder, soluble in water. Used for Mg2+ analysis and sulfate tests.',
    safetyFlags: [],
    hazardsDescription: 'Generally safe, but ingestions in large quantities cause laxative effects.'
  },
  'nh4_cl': {
    id: 'nh4_cl',
    name: 'Ammonium Chloride',
    formula: 'NH4Cl',
    state: 'solid',
    color: '#ffffff',
    category: 'cation_salt',
    synonyms: ['ammonium chloride', 'nh4cl', 'sal ammoniac'],
    description: 'White crystalline solid, soluble in water. Used for NH4+ analysis and Group III analysis buffer.',
    safetyFlags: ['irritant'],
    hazardsDescription: 'Harmful if swallowed. Causes serious eye irritation.'
  },

  // Anions (primarily sodium or potassium salts for testing)
  'na2_co3': {
    id: 'na2_co3',
    name: 'Sodium Carbonate',
    formula: 'Na2CO3',
    state: 'solid',
    color: '#ffffff',
    category: 'anion_salt',
    synonyms: ['sodium carbonate', 'washing soda', 'soda ash', 'na2co3'],
    description: 'White powder, soluble in water. Gives carbon dioxide gas with acids.',
    safetyFlags: ['irritant'],
    hazardsDescription: 'Causes serious eye irritation.'
  },
  'na2_s': {
    id: 'na2_s',
    name: 'Sodium Sulfide',
    formula: 'Na2S',
    state: 'solid',
    color: '#fef08a', // Yellowish
    category: 'anion_salt',
    synonyms: ['sodium sulfide', 'na2s'],
    description: 'Yellow-to-red crystalline flakes, soluble in water. Smells like rotten eggs when acidified (H2S gas).',
    safetyFlags: ['corrosive', 'toxic', 'environment-hazard'],
    hazardsDescription: 'Very toxic to aquatic life. Contact with acids liberates toxic gas.'
  },
  'na2_so3': {
    id: 'na2_so3',
    name: 'Sodium Sulfite',
    formula: 'Na2SO3',
    state: 'solid',
    color: '#ffffff',
    category: 'anion_salt',
    synonyms: ['sodium sulfite', 'na2so3'],
    description: 'White powder, soluble in water. Liberates sulfur dioxide gas with dilute acids.',
    safetyFlags: ['irritant'],
    hazardsDescription: 'May cause allergic reactions in sensitive individuals.'
  },
  'na2_so4': {
    id: 'na2_so4',
    name: 'Sodium Sulfate',
    formula: 'Na2SO4',
    state: 'solid',
    color: '#ffffff',
    category: 'anion_salt',
    synonyms: ['sodium sulfate', 'na2so4'],
    description: 'White crystalline solid, soluble in water. Used to analyze sulfate anion.',
    safetyFlags: [],
    hazardsDescription: 'Relatively safe compound.'
  },
  'na_no2': {
    id: 'na_no2',
    name: 'Sodium Nitrite',
    formula: 'NaNO2',
    state: 'solid',
    color: '#fef08a', // slightly yellowish white
    category: 'anion_salt',
    synonyms: ['sodium nitrite', 'nano2'],
    description: 'White to slightly yellowish crystalline powder. Highly soluble. Liberates brown nitrogen dioxide gas with acids.',
    safetyFlags: ['toxic', 'oxidizer'],
    hazardsDescription: 'Toxic if swallowed. May intensify fire; oxidizer.'
  },
  'k_no3': {
    id: 'k_no3',
    name: 'Potassium Nitrate',
    formula: 'KNO3',
    state: 'solid',
    color: '#ffffff',
    category: 'anion_salt',
    synonyms: ['potassium nitrate', 'saltpetre', 'kno3'],
    description: 'White powder, soluble in water. Used in the brown ring test for nitrate identification.',
    safetyFlags: ['oxidizer'],
    hazardsDescription: 'Strong oxidizer; may ignite organic materials on contact.'
  },
  'na_cl': {
    id: 'na_cl',
    name: 'Sodium Chloride',
    formula: 'NaCl',
    state: 'solid',
    color: '#ffffff',
    category: 'anion_salt',
    synonyms: ['sodium chloride', 'common salt', 'nacl', 'table salt'],
    description: 'White crystalline table salt. Used for chloride tests.',
    safetyFlags: [],
    hazardsDescription: 'Safe in standard concentrations.'
  },
  'k_br': {
    id: 'k_br',
    name: 'Potassium Bromide',
    formula: 'KBr',
    state: 'solid',
    color: '#ffffff',
    category: 'anion_salt',
    synonyms: ['potassium bromide', 'kbr'],
    description: 'White crystals, highly soluble in water. Liberates red-brown bromine gas with conc. H2SO4.',
    safetyFlags: ['irritant'],
    hazardsDescription: 'Causes skin and eye irritation.'
  },
  'k_i': {
    id: 'k_i',
    name: 'Potassium Iodide',
    formula: 'KI',
    state: 'solid',
    color: '#ffffff',
    category: 'anion_salt',
    synonyms: ['potassium iodide', 'ki'],
    description: 'White crystalline solid, turns yellow in air due to iodine oxidation. Liberates violet iodine vapor with conc. H2SO4.',
    safetyFlags: ['irritant'],
    hazardsDescription: 'Causes skin irritation and eye irritation.'
  },
  'na3_po4': {
    id: 'na3_po4',
    name: 'Sodium Phosphate',
    formula: 'Na3PO4',
    state: 'solid',
    color: '#ffffff',
    category: 'anion_salt',
    synonyms: ['sodium phosphate', 'na3po4', 'trisodium phosphate'],
    description: 'White crystalline powder. Soluble in water. Used for phosphate analysis.',
    safetyFlags: ['irritant'],
    hazardsDescription: 'Highly alkaline in solution. Causes severe eye and skin irritation.'
  },
  'na2_c2o4': {
    id: 'na2_c2o4',
    name: 'Sodium Oxalate',
    formula: 'Na2C2O4',
    state: 'solid',
    color: '#ffffff',
    category: 'anion_salt',
    synonyms: ['sodium oxalate', 'na2c2o4'],
    description: 'White powder, soluble in water. Used for oxalate analysis and redox titrations.',
    safetyFlags: ['toxic'],
    hazardsDescription: 'Harmful in contact with skin and if swallowed. Forms toxic calcium oxalate in kidneys.'
  },
  'ch3coo_na': {
    id: 'ch3coo_na',
    name: 'Sodium Acetate',
    formula: 'CH3COONa',
    state: 'solid',
    color: '#ffffff',
    category: 'anion_salt',
    synonyms: ['sodium acetate', 'ch3coona'],
    description: 'White crystalline powder. Soluble in water. Smells like vinegar when acidified.',
    safetyFlags: [],
    hazardsDescription: 'Generally safe.'
  },

  // Acids & Bases
  'dil_hcl': {
    id: 'dil_hcl',
    name: 'Dilute Hydrochloric Acid',
    formula: 'HCl (dil)',
    state: 'aqueous',
    color: 'rgba(255, 255, 255, 0.2)', // clear/water-like
    category: 'acid',
    synonyms: ['dilute hydrochloric acid', 'dil hcl', 'dilute hcl', 'hcl dil'],
    description: 'Aqueous solution of hydrogen chloride (~2M). Primary reagent for Group I cations and dilute acid group anions.',
    safetyFlags: ['corrosive', 'irritant'],
    hazardsDescription: 'Corrosive. Can cause skin irritation and eye damage.'
  },
  'conc_hcl': {
    id: 'conc_hcl',
    name: 'Concentrated Hydrochloric Acid',
    formula: 'HCl (conc)',
    state: 'liquid',
    color: 'rgba(240, 240, 250, 0.4)', // slightly yellow/fuming
    category: 'acid',
    synonyms: ['concentrated hydrochloric acid', 'conc hcl', 'concentrated hcl', 'hcl conc', 'muriatic acid'],
    description: 'Concentrated aqueous hydrogen chloride (~12M). Fuming liquid with pungent odor.',
    safetyFlags: ['corrosive', 'toxic', 'irritant'],
    hazardsDescription: 'Highly corrosive. Causes severe skin burns and eye damage. Fumes are extremely irritating to respiration.'
  },
  'dil_h2so4': {
    id: 'dil_h2so4',
    name: 'Dilute Sulfuric Acid',
    formula: 'H2SO4 (dil)',
    state: 'aqueous',
    color: 'rgba(255, 255, 255, 0.2)',
    category: 'acid',
    synonyms: ['dilute sulfuric acid', 'dil h2so4', 'dilute h2so4', 'h2so4 dil'],
    description: 'Aqueous sulfuric acid solution (~1M). Used for identifying carbonate, sulfide, sulfite, and nitrite anions.',
    safetyFlags: ['corrosive'],
    hazardsDescription: 'Causes severe skin burns and eye damage.'
  },
  'conc_h2so4': {
    id: 'conc_h2so4',
    name: 'Concentrated Sulfuric Acid',
    formula: 'H2SO4 (conc)',
    state: 'liquid',
    color: 'rgba(230, 230, 240, 0.6)', // oily, dense
    category: 'acid',
    synonyms: ['concentrated sulfuric acid', 'conc h2so4', 'concentrated h2so4', 'h2so4 conc', 'oil of vitriol'],
    description: 'Highly concentrated sulfuric acid (~18M). Oily, extremely hygroscopic and dehydrating.',
    safetyFlags: ['corrosive', 'reactive'],
    hazardsDescription: 'Extremely corrosive. Reacts violently with water generating extreme heat. Carbonizes organic matter on contact.'
  },
  'dil_hno3': {
    id: 'dil_hno3',
    name: 'Dilute Nitric Acid',
    formula: 'HNO3 (dil)',
    state: 'aqueous',
    color: 'rgba(255, 255, 255, 0.2)',
    category: 'acid',
    synonyms: ['dilute nitric acid', 'dil hno3', 'dilute hno3', 'hno3 dil'],
    description: 'Aqueous solution of nitric acid (~2M). Used in anion analysis (e.g. halide tests).',
    safetyFlags: ['corrosive', 'oxidizer'],
    hazardsDescription: 'Corrosive. Strong oxidizing agent.'
  },
  'conc_hno3': {
    id: 'conc_hno3',
    name: 'Concentrated Nitric Acid',
    formula: 'HNO3 (conc)',
    state: 'liquid',
    color: 'rgba(254, 243, 199, 0.5)', // faint yellow due to NO2 decomposition
    category: 'acid',
    synonyms: ['concentrated nitric acid', 'conc hno3', 'concentrated hno3', 'hno3 conc'],
    description: 'Concentrated nitric acid (~16M). Strong oxidizing agent. Stains skin yellow (xanthoproteic reaction).',
    safetyFlags: ['corrosive', 'oxidizer', 'toxic'],
    hazardsDescription: 'Severely corrosive. Causes skin burns. Contact with combustible materials may cause fire. Releases toxic NOx fumes.'
  },
  'na_oh': {
    id: 'na_oh',
    name: 'Sodium Hydroxide Solution',
    formula: 'NaOH',
    state: 'aqueous',
    color: 'rgba(255, 255, 255, 0.2)',
    category: 'base',
    synonyms: ['sodium hydroxide', 'naoh', 'caustic soda', 'lye'],
    description: 'Aqueous sodium hydroxide (~2M). Strong base used to precipitate metal cations and liberate ammonia gas from ammonium salts.',
    safetyFlags: ['corrosive'],
    hazardsDescription: 'Highly corrosive. Causes severe skin burns and serious eye damage.'
  },
  'nh4_oh': {
    id: 'nh4_oh',
    name: 'Ammonium Hydroxide Solution',
    formula: 'NH4OH',
    state: 'aqueous',
    color: 'rgba(255, 255, 255, 0.2)',
    category: 'base',
    synonyms: ['ammonium hydroxide', 'nh4oh', 'ammonia solution', 'aqueous ammonia'],
    description: 'Aqueous solution of ammonia (~2M). Weak base. Used as a group reagent and to dissolve precipitates (like AgCl or copper hydroxides).',
    safetyFlags: ['corrosive', 'irritant', 'toxic'],
    hazardsDescription: 'Corrosive. Vapor is highly irritating to the eyes and respiratory system.'
  },

  // Lab Reagents & Indicators
  
};