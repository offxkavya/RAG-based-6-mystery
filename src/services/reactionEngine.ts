import { CHEMICAL_DATABASE } from './chemicalDb';

export interface ReactionOutcome {
  color: string;
  precipitate: { present: boolean; color: string; type: string; details: string; };
  gas: { present: boolean; name: string; color: string; smell: string; bubbles: boolean; };
  temperatureEffect: 'exothermic' | 'endothermic' | 'none';
  balancedEquation: string;
  inference: string;
  explanation: string;
  identifiedIon?: string;
}

export function evaluateReaction(chemicalIds: string[], temperature: number, actionHistory: string[]): ReactionOutcome {
  return {
    color: 'rgba(255, 255, 255, 0.2)',
    precipitate: { present: false, color: '', type: 'none', details: '' },
    gas: { present: false, name: '', color: '', smell: '', bubbles: false },
    temperatureEffect: 'none',
    balancedEquation: '',
    inference: 'No reaction observed.',
    explanation: 'Substances are unreactive.'
  };
}
