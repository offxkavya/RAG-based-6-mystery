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
  
};