export interface Chemical {
  id: string;
  name: string;
  formula: string;
  state: 'solid' | 'liquid' | 'gas' | 'aqueous';
  color: string;
  category: string;
  synonyms: string[];
  description: string;
  safetyFlags: string[];
  hazardsDescription?: string;
}

export const CHEMICAL_DATABASE: Record<string, Chemical> = {};
